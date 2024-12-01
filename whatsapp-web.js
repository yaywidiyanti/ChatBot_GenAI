import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAI } from "@google/generative-ai";
import { Client } from "whatsapp-web.js";
import qrcode from "qrcode-terminal";

// Load AI model
const genAI = new GoogleGenerativeAI(process.env.API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-pro" });

// Initialize WhatsApp Client
const client = new Client();

client.on("qr", (qr) => {
    qrcode.generate(qr, { small: true });
});

client.on("ready", () => {
    console.log("WhatsApp Client is ready!");
});

client.on("message", async (msg) => {
    console.log(`Received message: ${msg.body}`);

    if (msg.body.toLowerCase() === "exit") {
        msg.reply("Thank you for chatting with President University's Customer Service!");
        return;
    }

    // Static commands
    if (msg.body.toLowerCase() === "hallo") {
        msg.reply("Hello! Welcome to President University's Customer Service. How can I assist you today?");
        return;
    }

    // AI-powered responses
    const chat = model.startChat({
        history: [
            {
                role: "system",
                parts: [
                    {
                        text: `You are President University's Customer Service AI. Use the following data to answer questions:
                        
                        - Admissions: Requirements (transcripts, English proficiency test), deadlines (Spring: Feb 1, Fall: Aug 1), scholarships (Merit-based and need-based available).
                        - Programs: Undergraduate (IT, Business, Law), Graduate (MBA, Engineering).
                        - Campus Facilities: Library, dormitories, sports facilities, labs.
                        - Contacts: admissions@presuniv.ac.id, +62-21-XXX.
                        
                        If unsure, say: "I'm sorry, I don't have that information. Please contact admissions@presuniv.ac.id for further assistance."`,
                    },
                ],
            },
        ],
        generationConfig: {
            maxOutputTokens: 300,
        },
    });

    try {
        const result = await chat.sendMessage(msg.body);
        const response = await result.response.text();
        msg.reply(response);
    } catch (error) {
        console.error("Error generating response:", error);
        msg.reply("Sorry, I encountered an error processing your request. Please try again later.");
    }
});

client.initialize();
