import { SupportLanguage } from "./SupportLanguage"

export class UserLanguage {
    public koreanUseCount: number = 0;
    public anotherUserCount: number = 0;
    public condict: boolean = false;
    public maybeLanguage: SupportLanguage = SupportLanguage.KOREAN;
}