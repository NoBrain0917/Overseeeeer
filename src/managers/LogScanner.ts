import axios, { Axios } from "axios";
import {Client, Message, MessageEmbed} from "discord.js";
import { AdofaiError } from "../errors/AdofaiError";
import { LatestVerError } from "../errors/LatestVerError";
import { ModError } from "../errors/ModError";
import { NoErrorsHere } from "../errors/NoErrorsHere";
import { OldVerError } from "../errors/OldVerError";
import { PathKoreanError } from "../errors/PathKoreanError";
import { SourceFileError } from "../errors/SourceFileError";
import { UMMError } from "../errors/UMMError";
import { SansGithub } from "../utils/SansGithub";
import { SansString } from "../utils/SansString";
import { GuessLanguage } from "./GuessLanguage";



export class LogScanner {
    public static readonly SCAN_ROOM_ID: string = "987725850860462080";

    public static async onMessage(message: Message): Promise<void> {
        // console.log(message.content)
        // console.log(message.attachments?.first()?.url)
        if(message.author.bot) return;
        if(message.channelId != LogScanner.SCAN_ROOM_ID) return;

        let isUMMText: boolean = message.content.startsWith("Mono path[0] = ") && message.content.includes("A Dance of Fire and Ice/MonoBleedingEdge/etc");
        let isFile: boolean = message.attachments.size > 0;

        if(isUMMText) 
            await LogScanner.scan(message.content, message);
            
        else if(isFile) {
            let isLogFile: boolean = message.attachments.first().name.toLowerCase().endsWith(".txt") || message.attachments.first().name.toLowerCase().endsWith(".log");
            if(isLogFile) {
                let text: string = (await axios.get(message.attachments.first().url, { responseType: "text" })).data;
                if(text.startsWith("Mono path[0] = ") && text.includes("A Dance of Fire and Ice/MonoBleedingEdge/etc"))
                    await LogScanner.scan(text, message);
            }
            
        }
        
    }

    public static init(client: Client): void {
        client.user.setActivity("Viewing everyone's log files...", { type: "WATCHING"})
        console.log("Me at the zoo!")
    }

    private static async scan(str: string, message: Message): Promise<void> {
        try {
            let l: any = GuessLanguage.get(message.author.id);
            let embed: MessageEmbed = new MessageEmbed();
            embed.setTitle(l["check_log"]);

            let error: UMMError = new NoErrorsHere(message.author.id);


            let modErrors: string[] = [];
            let lines: string[] = str.trim().split("\n");
            for (let n = 0; n < str.length; n++) {
                if (SansString.isNullOrEmpty(lines[n])) continue;

                let line = lines[n].trim();
                if (line == "[Manager] [Error] Method 'SetupLevelEventsInfo' not found.") {
                    error = new LatestVerError(message.author.id);
                    embed.addField(error.cause, error.solution);
                    await message.reply({embeds: [embed]})
                    return;

                }
                if (line == "[Manager] [Error] Class 'ADOStartup' not found.") {
                    error = new OldVerError(message.author.id);
                    embed.addField(error.cause, error.solution);
                    await message.reply({embeds: [embed]})
                    return;

                }
                if (line == "ExecutionEngineException: String conversion error: Illegal byte sequence encounted in the input.") {
                    let path: string = SansString.getBetween(str, "Mono path[0] = '", "'\n");
                    let boldPath: string = "";
                    path.split("/").forEach((v: string) => boldPath += `${/[ㄱ-ㅎㅏ-ㅣ가-힣]/g.test(v) ? "**`" + v + "`**" : v}/`);
                    error = new PathKoreanError(message.author.id, boldPath)
                    embed.addField(error.cause, error.solution);
                    await message.reply({embeds: [embed]})
                    return;
                }

                if (line[0] == "[") {
                    let mod = SansString.getBetween(line, "[", "]");

                    if (line.includes("[Error] File '") && line.endsWith(".dll' not found.")) {
                        error = new SourceFileError(message.author.id, await SansGithub.findReleases(mod));
                        embed.addField(error.cause, error.solution);

                    } else if (line.includes("[Exception]")) {
                        let er = "```" + SansString.deleteTooLongtext(line.split("[Exception] ")[1], 90) + "\n" + SansString.deleteTooLongtext(lines[n + 2], 64) + "```";
                        if (modErrors.includes(er)) continue;

                        error = new ModError(message.author.id, mod, await SansGithub.findReleases(mod), er);
                        embed.addField(error.cause, error.solution);
                        modErrors.push(er);

                    }
                } else {

                    if (line.includes("Exception: ")) {
                        let er = "```" + SansString.deleteTooLongtext(line, 90) + "\n" + SansString.deleteTooLongtext(lines[n + 1], 64) + "```";
                        if (modErrors.includes(er)) continue;

                        error = new AdofaiError(message.author.id, er);
                        embed.addField(error.cause, error.solution);
                        modErrors.push(er);

                    }
                }
            }

            if (error instanceof NoErrorsHere)
                embed.addField(error.cause, error.solution);

            // console.log(embed)

            if (JSON.stringify(embed).length >= 6000) {
                await message.reply("문제가 너무 많아요 \:(")
                return;
            }

            await message.reply({embeds: [embed]});
        } catch (e) {
            await message.reply("와샌주아시눈구나겁나어렵습니다");
        }

    }

}