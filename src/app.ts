const fs = require('fs');
import { Client, Collection, Intents } from 'discord.js';
import dotenv from 'dotenv';
import { CommandHandler } from './interfaces/CommandHandler';

let commandHandlers: Collection<string, CommandHandler>;
const getCommandHandlers = async () => {
    const clientCommands = new Collection<string, CommandHandler>();
    const commandFileNames = fs.readdirSync('./src/commands/').filter((fileName: string) => fileName.endsWith('.ts'));
    console.log(`Found ${commandFileNames} commands`);

    for (const fileName of commandFileNames) {
        const commandModule = await import(`./commands/${fileName}`);
        const command = commandModule.default;
        clientCommands.set(command.name, command.handler);
        console.log(command.name);
    }
    return clientCommands;
}

// Use dotenv to load DISCORD_TOKEN from a .env file
dotenv.config();
const discordToken = process.env.DISCORD_TOKEN;

// Create a new client instance
const client = new Client({ intents: [Intents.FLAGS.GUILDS] });

// When the client is ready, run this code (only once)
client.once('ready', async () => {
    console.log('Ready!');
    commandHandlers = await getCommandHandlers();
});

// Login to Discord with your client's token
client.login(discordToken);

client.on('interactionCreate', async interaction => {
    if (!interaction.isCommand()) return;

    const commandHandler = commandHandlers.get(interaction.commandName);

    if (commandHandler === undefined) {
        console.error(`Command ${interaction.commandName} not found`);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
        return;
    }

    try {
        await commandHandler.execute(interaction);
    } catch (error) {
        console.error(error);
        await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
    }
});
