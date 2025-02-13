const { Client } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const { TextServiceClient } = require('@google/generative-ai');
const { GoogleGenerativeAI } = require("@google/generative-ai");

require('dotenv').config(); // Load API key from .env file

// Google Gemini API Configuration
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY, );

// WhatsApp Client Setup
const client = new Client();

client.on('qr', (qr) => {
    console.log('Scan this QR code to connect:');
    qrcode.generate(qr, { small: true });
});

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


client.on('ready', () => {
    console.log('🤖 WhatsApp AI Bot with Gemini is ready!');
});

client.on('message', async (message) => {
    console.log(`Received message: ${message.body}`);

    if (!message.body.startsWith('!')) return; // Only respond to messages starting with "!"

    try {
        const prompt = message.body.substring(1); // Remove "!" and use the rest as the prompt
        const response =  await model.generateContent(prompt);

        message.reply(response.response.text());
    } catch (error) {
        console.error('Error with Gemini API:', error);
        message.reply('Oops! Something went wrong with the AI. 😔');
    }
});

// client.sendMessage(message){
//     // Function to send messages to specific numbers
//     // You can use this function to send messages to specific numbers
//     // Example: client.sendMessage('+1234567890', 'Hello, WhatsApp AI!');

// }

client.initialize();
