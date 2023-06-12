const app=require('./app');
const connectDB = require('./config/db');


const { serverPort } = require('./secret');

// Handling Uncaught Exception
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Uncaught Exception`);
  process.exit(1);
});

// Config
require('dotenv').config()

// server connection with database
   const server=app.listen(process.env.PORT,async() => {
    console.log(`Server is working on ${serverPort}`);
    await connectDB()
  });

  // Unhandled Promise Rejection
process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Shutting down the server due to Unhandled Promise Rejection`);

  server.close(() => {
    process.exit(1);
  });
});