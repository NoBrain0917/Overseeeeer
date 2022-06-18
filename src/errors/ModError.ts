import { GuessLanguage } from "../managers/GuessLanguage";
import { SansString } from "../utils/SansString";
import { UMMError } from "./UMMError";

// 모드에서 오류가 날때
export class ModError extends UMMError {
    constructor(userID: string, modName: string, githubURI: string, error: string) {
        var l:any = GuessLanguage.get(userID);
        super();
        this.cause = l["mod_error.cause"].replace("{value}", modName);
        if(SansString.isNullOrEmpty(githubURI))
            this.solution = l["mod_error.solution1"].replace("{value}", error).replace("{value2}", modName);
        else 
            this.solution =  l["mod_error.solution2"].replace("{value}", error).replace("{value2}", modName).replace("{value3}", githubURI);
        //this.solution = l["mod_error.solution2"].replace("{value}", modName).replace("{value2}", "modURL");
    }
}