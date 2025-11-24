import express from "express";
import dotenv from "dotenv";
import UserController from "./controllers/UserController.js";

import cors from "cors";
import FeedbackController from "./controllers/FeedbackController.js";

const app = express();

dotenv.config();
app.use(cors());
app.use(express.json());

app.use('/api/', UserController);
app.use('/feedback/', FeedbackController);

app.listen(process.env.SERVER_API || 5000, () => {
   console.log("Server started on port: " + process.env.SERVER_API) ;
});