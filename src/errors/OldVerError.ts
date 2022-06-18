import { GuessLanguage } from "../managers/GuessLanguage";
import { UMMError } from "./UMMError";

// 얼불춤은 r68 이하, umm세팅은 최신일때 생기는 에러
export class OldVerError extends UMMError {
    constructor(userID: string) {
        var l:any = GuessLanguage.get(userID);
        super();
        this.type = 0;
        this.cause = l["olv_ver_error.cause"];
        this.solution = l["old_ver_error.solution"];
    }
}