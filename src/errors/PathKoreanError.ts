import { GuessLanguage } from "../managers/GuessLanguage";
import { UMMError } from "./UMMError";

// 경로에 한국어가 있을 때 생기는 에러
export class PathKoreanError extends UMMError {
    constructor(userID: string, path: string) {
        var l:any = GuessLanguage.get(userID);
        super();
        this.type = 0;
        this.cause = l["path_korean_error.cause"];
        this.solution = l["path_korean_error.solution"].replace("{value}", path);
    }
}