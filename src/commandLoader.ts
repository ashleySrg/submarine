import fs from 'node:fs';
import path from 'node:path';
import { ExtendClient } from './myTypes';



export function loadCommands(client: ExtendClient) {
  const commandPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandPath).filter(file => file.endsWith('.js'));

  for (const file of commandFiles) {
    const filePath = path.join(commandPath, file);
    const command = require(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command);
      console.log(`[SUCCESS] ${command.data.name} was successfully registered.`)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a "data" or "execute" property.`);
    }
  }
}
