const fs = require('fs');
import axios from 'axios';
import { Client, Collection, Intents } from 'discord.js';
import dotenv from 'dotenv';
import Web3 from 'web3';
import { CommandHandler } from './interfaces/CommandHandler';
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc } from "firebase/firestore";


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

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    projectId: "opensea-trader",
    storageBucket: "opensea-trader.appspot.com",
    messagingSenderId: "659397861769",
    appId: "1:659397861769:web:2056edd290f6c206bb8158"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

// axios.get('https://api.opensea.io/api/v1/asset/0xe785e82358879f061bc3dcac6f0444462d4b5330/933/').then((value) => console.log(value.data['last_sale']['total_price'] / 1000000000000000000));

// const etherClient = require('etherscan-api').init(process.env.ETHERSCAN_TOKEN)

// etherClient.proxy.eth_getTransactionByHash('0xed76bd7258bd2a6280842f50c34d0f97a75ce9660b95ead95fcbd47ae7e20273').then(((result: any) => {
//     console.log(result)
// }));

// etherClient.proxy.eth_getTransactionReceipt('0xed76bd7258bd2a6280842f50c34d0f97a75ce9660b95ead95fcbd47ae7e20273').then(((result: any) => {
//     console.log(result);
//     const gasPrice = Web3.utils.hexToNumber(result.result.effectiveGasPrice) / 1000000000000000000;
//     const gasUsed = Web3.utils.hexToNumber(result.result.gasUsed);
//     console.log(`Gas Price ${gasPrice}`);
//     console.log(`Gas Used ${gasUsed}`);
//     console.log(`Transaction Cost in ETH: ${gasPrice * gasUsed}`)
// }));

// console.log(Web3.utils.hexToNumber('0x449a2'));


// gas: '0x449a2',
// gasPrice: '0x10c59eb154',
// maxFeePerGas: '0x1281576379',
// maxPriorityFeePerGas: '0x7b30d546',

// Converted
// gas: '280994',
// gasPrice: '72034988372',
// maxFeePerGas: '79479399289',
// maxPriorityFeePerGas: '2066797894',

// EtherScan Label
// Gas Limit: '280,994',
// Gas Price: '0.000000072034988372 ',
// maxFeePerGas: '0.000000079479399289',
// maxPriorityFeePerGas: '2066797894',

// Used = 0.014868597879887776 
