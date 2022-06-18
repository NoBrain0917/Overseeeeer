import { GuessLanguage } from "../managers/GuessLanguage";
import { SansString } from "../utils/SansString";
import { UMMError } from "./UMMError";

// 모드 파일이 아닌 모드 소스코드를 다운받았을 때 생기는 에러
export class SourceFileError extends UMMError {
    constructor(userID: string, githubURI: string) {
        var l:any = GuessLanguage.get(userID);
        super();
        this.cause = l["source_file_error.cause"];
        this.solution = l["source_file_error.solution1"];

        if(SansString.isNullOrEmpty(githubURI)) 
            this.solution = l["source_file_error.solution1"]
        else 
            this.solution = l["source_file_error.solution2"].replace("{value}", githubURI);
        
        //this.solution = l["source_file_error.solution2"].replace("{value}", modName);
    }
}