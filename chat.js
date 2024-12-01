import dotenv from "dotenv";
dotenv.config();
import readline from "readline";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.API_KEY);

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" });

    const chat = model.startChat({
        history: [ //to create your own AI Chatbot
            {
              role: "user",
              parts: [
                {text: "You are a traveler. You are the Travel agent. Here is an article about exciting things to do in New York City. Convert this into a structured format with 3 columns - activity, best season to partake in this activity, and amount of time needed.\n\nNew York City vibrates with an irresistible energy that never sleeps, offering an abundance of experiences for every traveler! In the pleasant embrace of spring or the colorful tapestry of fall, dedicate a half or even a full day to exploring the sprawling expanse of Central Park. Take a leisurely bike ride, enjoy a picnic lunch, or rent a boat on the lake – the possibilities for enjoyment are endless! Regardless of the season, art enthusiasts can immerse themselves in the vast collection of the Metropolitan Museum of Art, dedicating an afternoon to wander through centuries of human creativity.\n\nFor a dose of captivating entertainment, catch a world-renowned Broadway show, a three-hour journey into the heart of theater and music. Spring or fall offers the ideal weather for a ferry ride to the Statue of Liberty and Ellis Island, allowing for a half or full day to delve into the stories of immigration and freedom that shaped America. When the weather beckons you outdoors in the summer months, dedicate an hour to a stroll along the High Line, a unique elevated park offering breathtaking city views and urban gardens.\n\nAs dusk settles, head to the dazzling spectacle of Times Square, spending thirty minutes to an hour soaking in the vibrant lights and bustling energy. For a moment of reflection, visit the poignant 9/11 Memorial & Museum, dedicating two to three hours to honor the lives lost and the unwavering spirit of the city. From the trendy streets of Soho to the historic charm of Greenwich Village, exploring the diverse neighborhoods of New York City is an adventure in itself, with the time commitment varying based on your chosen area and interests. And for those seeking a taste of the city's vibrant culture, a two-hour hour food tour will tantalize your taste buds with diverse flavors and culinary delights.\n\nNo matter your interests or the time of year, New York City promises an unforgettable experience, brimming with iconic sights, captivating performances, and endless opportunities for exploration!"},
              ],
            },
            {
              role: "model",
              parts: [
                {text: "Hola, mi nombre es Itzmary Agent. I will assist you about travelling"},
              ],
            },
          ],
      
        generationConfig: {
            maxOutputTokens: 200,
        },
    });

    async function askAndRespond() {
        rl.question("You: ", async (msg) => {
            if (msg.toLowerCase() === "exit") {
                rl.close();
            } else {
                const result = await chat.sendMessage(msg);
                const response = await result.response;
                const text = await response.text();
                console.log("AI: ", text);
                askAndRespond();
            }
        });
    }

    askAndRespond(); // Start the conversation loop
}

run();
