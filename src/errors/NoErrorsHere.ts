import { GuessLanguage } from "../managers/GuessLanguage";
import { UMMError } from "./UMMError";

// No Hints here!
// 로그에 아무런 오류도 없을 때
export class NoErrorsHere extends UMMError {
    constructor(userID: string) {
        var l:any = GuessLanguage.get(userID);
        super();
        this.type = 0;
        this.cause = l["no_errors_here.cause"];
        this.solution = l["no_errors_here.solution"];
    }
}