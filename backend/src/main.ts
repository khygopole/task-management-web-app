// Import essential libraries
import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

// import necessary Routes and Function
import UserRoutes from "./routes/User";
import TaskRoutes from "./routes/Task";
import { ConnectMongoAtlas } from "./database/database";

// Staging
import path from "path";
import { fileURLToPath } from "url";
import dotenv from "dotenv";

dotenv.config();

// Setup Express and Port
const app = express();
const PORT = process.env.PORT || 3000;

// __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static frontend
app.use(express.static(path.join(__dirname, "public")));
app.get("*", (_req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// Set Cors so that server can connect to the client via port 5173
app.use(
  cors({
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP requests to be performed in the server
    credentials: true, // This would include the cookies and any authorization keys in the HTTP payload
  })
);

// Enable JSON data parsing from HTTP requests
app.use(express.json());

// Enable HTTP cookie parsing from HTTP requests
app.use(cookieParser());

// Connect Server to MongoDB Atlas
(async () => {
  try {
    await ConnectMongoAtlas();
    console.log("Successfully connected to MongoDB Atlas");
  } catch (error) {
    console.error(`Cannot connect to the database. Error: ${error}`);
  }
})();

// Apply Routes
app.use("/users", UserRoutes);
app.use("/tasks", TaskRoutes);

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV} mode on PORT ${PORT}`);
});

app.get("/", (res: Response) => {
  console.log("Server is running");
  res.send({ message: "Server is running" });
});
