import mongoose from "mongoose";

const ticketSchema = new mongoose.Schema({
    title: String,
    description:String,
    status:{type: String, default: "open", enum: ["open", "in-progress", "closed"]},
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null},
    priority: { type: String, default: "medium", enum: ["low", "medium", "high"] },
    deadline: { type: Date, default: null },
    helpfulNotes: String,
    relatedSkills: { type: [String], default: [] },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model("Ticket", ticketSchema)