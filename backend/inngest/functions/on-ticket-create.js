import {inngest} from "../client.js";
import Ticket from "../../models/ticket.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import {sendEmail} from "../../utils/mailer.js"
import { analyzeTicket } from "../../utils/ai.js";

export const onTicketCreated = inngest.createFunction(
    {id: "on-ticket-create", retries: 2},
    {event: "ticket/create"},
    async({event, step}) => {
        try {
            
            const {ticketId} = event.data;

            const ticket = await step.run("get-ticket", async() => {
                const ticketObject = await Ticket.findById(ticketId);

                if(!ticketObject){
                    throw new NonRetriableError("Ticket not found");
                }

                return ticketObject;
            });

            await step.run("update-ticket-status", async() => {
                await Ticket.findByIdAndUpdate(ticket._id, {status: "open"}, {new: true});
            })

            const aiResponse = await analyzeTicket(ticket);

            const relatedSkills = await step.run("ai-processing", async() => {
                let skills = [];
                if(aiResponse){
                    await Ticket.findByIdAndUpdate(ticket._id, {
                        priority: !["low", "medium", "high"].includes(aiResponse.priority) ? "medium" : aiResponse.priority,
                        helpfulNotes: aiResponse.helpfulNotes,
                        relatedSkills: aiResponse.relatedSkills,

                        status: "in-progress"
                    })

                    skills = aiResponse.relatedSkills;
                }

                return skills;
            })

            const moderator = await step.run("assign-moderator", async() => {
                let user = await User.findOne({role:"moderator", skills:{
                    $elemMatch: {
                        $regex: relatedSkills.join("|"),
                        $options: "i"
                    }
                }})

                if(!user){
                    user = await User.findOne({role:"admin"})
                }

                await Ticket.findByIdAndUpdate(ticket._id, {
                    assignedTo: user?._id || null
                })

                return user;
            })

            await step.run("send-ticket-notification", async() => {
                console.log(`Sending notification for ticket ${ticket._id}`);

                const subject = `Ticket Assigned: ${ticket.title}`;
                const text = `A new ticket has been assigned to you:\n\nTitle: ${ticket.title}\nDescription: ${ticket.description}`;

                await sendEmail(moderator.email, subject, text);
            });

            return {success: true}

        } catch (error) {
            console.error("Error in onTicketCreated function:", error.message);
        }
    }
)