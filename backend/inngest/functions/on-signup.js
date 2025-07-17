import {inngest} from "../client.js";
import User from "../../models/user.js";
import { NonRetriableError } from "inngest";
import {sendEmail} from "../../utils/mailer.js"

export const onUserSignUp = inngest.createFunction(
    {id: "on-user-sigup", retries: 2},
    {event: "user/signup"},

    async({event, step}) => {
        try {
            const {email} = event.data

            const user = await step.run("get-user-email", async() => {
                const userObject = await User.findOne({email})

                if(!userObject) {
                    throw new NonRetriableError("User not found")
                }

                return userObject
            })

            await step.run("send-welcome-email", async() => {
                console.log(`Sending welcome email to ${user.email}`);

                const subject = "Welcome to Our Service!";
                const text = `Hello,\n\nThank you for signing up!`

                await sendEmail(user.email, subject, text)
            })

            return {success: true}

        } catch (error) {
            console.error("Error in onUserSignUp function:", error.message);
        }
    }
)