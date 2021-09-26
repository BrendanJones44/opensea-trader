import { Client, Intents } from 'discord.js';
import dotenv from 'dotenv';

// Use dotenv to load DISCORD_TOKEN from a .env file
dotenv.config();
const discordToken = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', () => {
    console.log('Ready!');
});

// Login to Discord with your client's token
client.login(discordToken);
