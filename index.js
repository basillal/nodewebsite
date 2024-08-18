const express = require("express");
const { MongoClient } = require("mongodb");
const cors = require("cors");  // Add this line
const path = require('path');

// Initialize the Express app
const app = express();

// Enable CORS for all routes
app.use(cors());  // Add this line

// Middleware to parse JSON bodies
app.use(express.json());

// MongoDB connection URI
const uri = "mongodb+srv://basillal1010:OrWVHT3y6Z8hXwPq@store.2p1clix.mongodb.net/?retryWrites=true&w=majority&appName=store"
// Create a new MongoClient
const client = new MongoClient(uri);

// Function to connect to the database
async function connectToDatabase() {
  try {
    await client.connect();
    console.log("Connected to the database");
    return client.db('store');
  } catch (error) {
    console.error("Failed to connect to the database", error);
    throw error;
  }
}


app.use(express.static(path.join(__dirname, 'dist/myweb')));

// Send all other requests to the Angular app
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist/myweb/index.html'));
});

// Start the Express server
// app.get("/", (req, res) => {
//   res.send("Express on Vercel");
// });

// Register API endpoint
app.post("/register", async (req, res) => {
  let database;
  try {
    database = await connectToDatabase();
    const users = database.collection('users');

    // Get the user data from the request body
    const userData = req.body;

    // Insert the user data into the database
    const result = await users.insertOne(userData);

    res.status(201).json({
      message: "User registered successfully",
      userId: result.insertedId
    });
  } catch (error) {
    console.error("An error occurred:", error);
    res.status(500).json({ error: "Failed to register user" });
  } finally {
    if (database) {
      await client.close();
    }
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server ready on port ${PORT}.`));