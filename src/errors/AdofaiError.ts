import { UMMError } from "./UMMError";
import { GuessLanguage } from "../managers/GuessLanguage";

// 얼불춤은 최신, umm세팅은 r68 이하일때 생기는 에러
export class AdofaiError extends UMMError {
    constructor(userID: string, error: string) {
        var l:any = GuessLanguage.get(userID);
        super();
        this.cause = l["adofai_error.cause"];
        this.solution = l["adofai_error.solution"].replace("{value}", error);
    }
}