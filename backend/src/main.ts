// Import essential libraries
import express, { Request, Response } from "express";
// import cors from "cors";
import cookieParser from "cookie-parser";

// import necessary Routes and Function
import UserRoutes from "./routes/User.js";
import TaskRoutes from "./routes/Task.js";
import { ConnectMongoAtlas } from "./database/database.js";

// For deployment
import path from "path";

// Setup Express and Port
const app = express();
const PORT = process.env.PORT || 3000;

const __dirname = path.resolve();

// Set Cors so that server can connect to the client via port 5173
// app.use(
//   cors({
//     origin: ["http://localhost:5173"],
//     methods: ["GET", "POST", "PUT", "DELETE"], // Allow these HTTP requests to be performed in the server
//     credentials: true, // This would include the cookies and any authorization keys in the HTTP payload
//   })
// );

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

// if (process.env.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "/frontend/dist")));

//   app.get("*", (req: Request, res: Response) => {
//     res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
//   });
// }

if (process.env.NODE_ENV === "production") {
  // Go up one level to the root directory
  const rootDir = path.join(__dirname, "..");

  // Serve the static files from `root/frontend/dist`
  app.use(express.static(path.join(rootDir, "frontend", "dist")));

  app.get("*", (req: Request, res: Response) => {
    // Send the `index.html` file from `root/frontend/dist`
    res.sendFile(path.resolve(rootDir, "frontend", "dist", "index.html"));
  });
}

app.listen(PORT, () => {
  console.log(`Server running on PORT ${PORT}`);
});

app.get("/", (res: Response) => {
  console.log("Server is running");
  res.send({ message: "Server is running" });
});
