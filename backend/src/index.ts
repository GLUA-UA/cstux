import { config } from 'dotenv';
import Database from './database/Database';
import { ExpressApp } from './express/ExpressApp';

// Get environment variables from .env file
config();

// Initialize database
Database.initDB();

// Get port from environment variables
const port = parseInt(process.env.PORT || '3000');

// Start the server
const app = new ExpressApp();
app.start(port);