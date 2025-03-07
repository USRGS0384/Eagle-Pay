import fs from 'fs';
import path from 'path';
import swaggerJsDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define Swagger options
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Eagle Pay API',
      version: '1.0.0',
      description: 'API documentation for Eagle Pay Mobile Money Transfer system.',
      contact: {
        name: 'Philip Ajuong Deng',
        email: 'philip@example.com',
      },
    },
    servers: [
      {
        url: process.env.BASE_URL || 'http://localhost:5000/api',
        description: 'Local Development Server',
      },
      {
        url: process.env.PROD_URL || 'https://eaglepay.example.com/api',
        description: 'Production Server',
      },
    ],
    components: {
      securitySchemes: {
        BearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ BearerAuth: [] }], // Apply JWT security globally
  },
  apis: [path.join(__dirname, '../routes/*.js')], // Path to API routes
};

// Generate Swagger JSON dynamically
const swaggerDocs = swaggerJsDoc(swaggerOptions);

// Path to save Swagger JSON
const swaggerFile = path.join(__dirname, '../swagger.json');

// Function to initialize Swagger in Express app
export default (app) => {
  if (fs.existsSync(swaggerFile)) {
    // Load Swagger from JSON file if it exists
    const swaggerDocument = JSON.parse(fs.readFileSync(swaggerFile, 'utf-8'));
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    console.log(`✅ Loaded Swagger API Documentation from '${swaggerFile}' 📖`);
  } else {
    // Use dynamically generated Swagger documentation
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    console.log('🚀 Swagger API Documentation Generated Dynamically 🛠️');

    // Save Swagger JSON for later use
    fs.writeFileSync(swaggerFile, JSON.stringify(swaggerDocs, null, 2), 'utf-8');
    console.log(`📂 Swagger JSON file saved at '${swaggerFile}'.`);
  }
};

// Export for external use (optional)
export { swaggerDocs, swaggerUi };

