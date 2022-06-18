import { Client, Intents } from "discord.js";
import config from '../config.json';
import { GuessLanguage } from "./managers/GuessLanguage";
import { LogScanner } from "./managers/LogScanner";

let client: Client = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES]
});

client.addListener("ready", LogScanner.init);
client.addListener("messageCreate", LogScanner.onMessage);
client.addListener("messageCreate", GuessLanguage.onMessage);

client.login(config.token);



