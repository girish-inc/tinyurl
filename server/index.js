require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const prisma = require('./prisma');
const linkRoutes = require('./routes/linkRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middleware
// CORS configuration: Allow frontend URL in production if FRONTEND_URL is set
// Otherwise, same-origin only (for monolithic deployment)
const corsOptions = {
    origin: process.env.NODE_ENV === 'production' 
        ? (process.env.FRONTEND_URL || false) // Use FRONTEND_URL if set, otherwise same origin
        : true, // In development, allow all origins
    credentials: true
};
app.use(cors(corsOptions));
app.use(express.json());

// API routes - must be defined BEFORE the catch-all :code route
app.use('/api/links', linkRoutes);

// Health check endpoint
app.get('/healthz', (req, res) => {
    res.json({
        ok: true,
        version: "1.0",
        uptime: process.uptime()
    });
});

// Redirect route - handles short link redirects with click tracking
// MUST be defined AFTER all other routes
// Only matches valid short codes (6-8 alphanumeric characters)
app.get('/:code', async (req, res, next) => {
    const { code } = req.params;
    
    // Block reserved paths that could conflict
    if (['api', 'healthz', 'code'].includes(code)) {
        return next();
    }

    // Validate code format: 6-8 alphanumeric characters
    // This ensures we only process actual short codes, not React Router routes
    const codeRegex = /^[A-Za-z0-9]{6,8}$/;
    if (!codeRegex.test(code)) {
        // Not a valid short code format, let React Router handle it
        return next();
    }

    try {
        const link = await prisma.link.findUnique({
            where: { code }
        });

        if (!link) {
            // Code format is valid but not found in database
            // Let React Router handle it (might be a route like /dashboard)
            return next();
        }

        // Increment clicks and update lastClicked
        await prisma.link.update({
            where: { code },
            data: {
                clicks: { increment: 1 },
                lastClicked: new Date(),
            },
        });

        return res.redirect(302, link.target);
    } catch (error) {
        return next(error);
    }
});

// Production: serve static files from client/dist (only if files exist)
// This is for monolithic deployment. For separate frontend/backend, skip this.
if (process.env.NODE_ENV === 'production') {
    const distPath = path.join(__dirname, '../client/dist');
    const indexPath = path.join(distPath, 'index.html');
    
    // Check if dist directory exists (only serve static files if client was built)
    const fs = require('fs');
    if (fs.existsSync(distPath) && fs.existsSync(indexPath)) {
        app.use(express.static(distPath));
        // Catch-all route for React Router (Express 5 compatible)
        app.use((req, res) => {
            res.sendFile(indexPath);
        });
        console.log('✓ Static files enabled (monolithic deployment)');
    } else {
        console.log('ℹ Static files not found - assuming separate frontend/backend deployment');
    }
}

// Global error handler - must be last middleware
app.use(errorHandler);

// Test database connection on startup with retry logic
async function testConnection(retries = 3, delay = 2000) {
    const dbUrl = process.env.DATABASE_URL;
    
    // Validate connection string format
    if (!dbUrl) {
        console.error('✗ DATABASE_URL is not set in .env file');
        process.exit(1);
    }
    
    // Check if using pooler endpoint
    const isPooler = dbUrl.includes('-pooler.neon.tech');
    const hasSSL = dbUrl.includes('sslmode=');
    
    console.log('🔍 Connection diagnostics:');
    console.log(`   Using pooler: ${isPooler ? '✓' : '✗ (should use -pooler.neon.tech)'}`);
    console.log(`   SSL configured: ${hasSSL ? '✓' : '✗ (add ?sslmode=require)'}`);
    
    if (!isPooler) {
        console.warn('⚠️  Warning: Not using pooled connection. Neon requires pooler for serverless.');
    }
    if (!hasSSL) {
        console.warn('⚠️  Warning: SSL mode not specified. Add ?sslmode=require to your DATABASE_URL');
    }
    
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            console.log(`\n🔄 Attempting connection (${attempt}/${retries})...`);
            await prisma.$connect();
            console.log('✓ Database connection successful!');
            return;
        } catch (error) {
            console.error(`✗ Attempt ${attempt} failed:`, error.message);
            
            if (attempt < retries) {
                console.log(`⏳ Retrying in ${delay/1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
                delay *= 1.5; // Exponential backoff
            } else {
                console.error('\n❌ All connection attempts failed');
                if (error.message.includes('Can\'t reach database server')) {
                    console.error('\n⚠️  Troubleshooting steps:');
                    console.error('1. 🌐 Wake up your database in Neon console (databases auto-pause after inactivity)');
                    console.error('2. 🔗 Verify your connection string in Neon dashboard:');
                    console.error('   - Go to your project → Connection Details');
                    console.error('   - Select "Pooled connection" (NOT "Direct connection")');
                    console.error('   - Copy the full connection string');
                    console.error('3. ✅ Ensure your .env file has:');
                    console.error('   DATABASE_URL="postgresql://user:pass@ep-xxx-pooler.neon.tech/db?sslmode=require"');
                    console.error('4. 🔄 After updating .env, restart the server');
                    console.error('5. 🌍 Check if your network/firewall allows connections to Neon');
                }
                process.exit(1);
            }
        }
    }
}

const PORT = process.env.PORT || 4000;
testConnection().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});