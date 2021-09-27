import { Command } from "../interfaces/Command";
import ServerHandler from '../handlers/ServerHandler';

const ServerCommand: Command = {
    name: 'server',
    description: 'Replies with the server info',
    handler: ServerHandler,
}

export default ServerCommand;
