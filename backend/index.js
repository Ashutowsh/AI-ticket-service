import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import userRoutes from "./routes/user.js";
import ticketRoutes from "./routes/ticket.js";
import { serve } from "inngest/express";
import { inngest } from "./inngest/client.js";
import {onUserSignUp} from "./inngest/functions/on-signup.js";
import {onTicketCreated} from "./inngest/functions/on-ticket-create.js";

dotenv.config();

const PORT = process.env.PORT || 3000;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/auth", userRoutes);
app.use("/api/tickets", ticketRoutes);

app.use("/api/inngest", serve({
    client: inngest,
    functions: [ onUserSignUp, onTicketCreated ]
}))

mongoose.connect(process.env.MONGO_URI)
.then(() => {
    console.log("MongoDB connected successfully");

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
})
.catch((err) => console.error("MongoDB connection error:", err));