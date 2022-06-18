import { Message } from "discord.js";
import { SupportLanguage } from "../localized/SupportLanguage";
import { UserLanguage } from "../localized/UserLanguage";
import { SansString } from "../utils/SansString";
import text from "../localized/localizedText.json";

export class GuessLanguage {
    public static userLangCache: { [key: string]: UserLanguage } = {};

    public static get(userID: string) {
        if(!GuessLanguage.userLangCache[userID]) 
            GuessLanguage.userLangCache[userID] = new UserLanguage();
        return text[GuessLanguage.userLangCache[userID].maybeLanguage.toString()];
    }

    public static onMessage(message: Message): void {
        if(message.author.bot) return;

        if(message.content.startsWith("Mono path[0] = ")) return;
        if(message.content.length > 256) return;

        if(!GuessLanguage.userLangCache[message.author.id]) {
            GuessLanguage.userLangCache[message.author.id] = new UserLanguage();
            if(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(message.author.username)) 
            GuessLanguage.userLangCache[message.author.id].condict = true;
        }

        let userlang: UserLanguage = GuessLanguage.userLangCache[message.author.id];
        
        if(userlang.condict) return;
        message.content = message.content?.replace(/[~!@#\#$%<>^&*]/g, "")?.replace(/[0-9]/g,"").trim();
        if(SansString.isNullOrEmpty(message.content)) return;

        if(/[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/.test(message.content)) {
            userlang.koreanUseCount++;
            let accuracy = userlang.koreanUseCount / (userlang.koreanUseCount + userlang.anotherUserCount);
            if(userlang.koreanUseCount > userlang.anotherUserCount)
                userlang.maybeLanguage = SupportLanguage.KOREAN;
            if(accuracy > 0.8 && userlang.anotherUserCount + userlang.koreanUseCount > 20)
                userlang.condict = true;
        
        } else {
            userlang.anotherUserCount++;
            let accuracy = userlang.anotherUserCount / (userlang.koreanUseCount + userlang.anotherUserCount);
            if(userlang.koreanUseCount < userlang.anotherUserCount)
                userlang.maybeLanguage = SupportLanguage.ENGLISH;
            if(accuracy > 0.8 && userlang.anotherUserCount + userlang.koreanUseCount > 20)
                userlang.condict = true;
        
        }
    }

}