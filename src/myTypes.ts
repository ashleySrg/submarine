import { Collection, Client } from "discord.js";

export type Command = {
  data: {
    name: string;
    description: string;
    options: Array<any>;
  },
  execute: Function
};

export class ExtendClient extends Client {
    public commands: Collection<string, Command> = new Collection();
};

export type SubmarineInformation = {
  server: string;
  numbering: number;
  name: string;
  departure_time: string;
  required_time: string;
};

export class DatabaseException extends Error {
  static DUPLICATION_EXCEPTION: string = '[DATABASE] already_exists_in_database';
}
