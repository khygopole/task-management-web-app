// INSERT MONGODB DATABASE INSTANCE

import { MongoClient } from "mongodb";
import dotenv from "dotenv";
import { collections } from "../utils/types.js";

// Set path for .env file
dotenv.config({ path: "./.env" });

// Add MongoDB
const DATABASE_URI = process.env.DATABASE_URI || "";
let client: MongoClient;

// Connect Server to MongoDB Atlas
async function ConnectMongoAtlas() {
  if (!client) {
    client = new MongoClient(DATABASE_URI);
    await client.connect();
  }
}

// Retrieve Collection from Database
function GetDatabaseCollections(): collections {
  const db = client.db("TaskManagementSysDB");
  // Collections representation in the program
  const UserCollection = db.collection("User");
  const TaskCollection = db.collection("Task");

  return { UserCollection, TaskCollection };
}

export { ConnectMongoAtlas, GetDatabaseCollections };
