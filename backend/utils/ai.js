import { createAgent, gemini } from "@inngest/agent-kit";

export const analyzeTicket = async(ticket) => {
    const supportAgent = createAgent({
        model: gemini({
            model: "gemini-1.5-flash-8b",
            apiKey: process.env.GEMINI_API_KEY,
        }),
        name: "AI ticket Triage assistant",
        system: `You are an AI assistant responsible for triaging technical support tickets. 
        Your job is to extract key information from user-submitted tickets, including a concise summary, a priority rating (low, medium, high), relevant technical notes, and a list of related technical skills (such as JavaScript, Python, MongoDB, etc.). 

        You must return strictly a valid JSON object only. Never include markdown, extra text, code fences, comments or explanations or any extra formatting.
        
        Repeat: Do not wrap your output in markdown or code fences.
        `
    });

    const response = await supportAgent.run(`
    You are a ticket triage agent. A user has submitted a support ticket.

    Your task is to analyze the ticket and return a strictly valid JSON object with the following fields:

    - "summary": A short 1-2 line summary of the issue.
    - "priority": One of "low", "medium", or "high" based on urgency or impact.
    - "helpfulNotes": Technical insights and if possible external resources that could help solve the issue.
    - "relatedSkills": An array of relevant skills like ["Node.js", "Docker", "PostgreSQL"].

    ⚠️ Do not include markdown, headers, or explanations. Only return the JSON object. No surrounding text.

    Here is an example of the expected output format:

    {
    "summary": "User is facing a CORS error while calling an API from the frontend.",
    "priority": "medium",
    "helpfulNotes": "The issue is likely due to missing CORS headers on the server. Ensure the backend includes proper 'Access-Control-Allow-Origin' headers. Refer to MDN CORS documentation.",
    "relatedSkills": ["JavaScript", "CORS", "Express.js"]
    }

    Now analyze the following ticket and return the JSON:

    Title: ${ticket.title}
    Description: ${ticket.description}
    `);
    

    const raw = response.output[0].content

    try {
        const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
        const  jsonString = match ? match[1] : raw.trim();
        // console.log("Parsed JSON String:", jsonString);

        return JSON.parse(jsonString);
    } catch (error) {
        console.error("Error parsing JSON response:", error.message);
        return null;
    }

}