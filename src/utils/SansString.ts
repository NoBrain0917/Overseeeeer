export class SansString {
    public static isNullOrEmpty(str: string): boolean {
        return str === null || str === undefined || str === "";
    }

    public static getBetween(str: string, start: string, end: string): string {
        let startIndex: number = str.indexOf(start);
        let endIndex: number = str.indexOf(end);
        return str.substring(startIndex + start.length, endIndex);
    }

    public static deleteTooLongtext(str: string, max: number): string {
        if (str.length > max) {
            return str.substring(0, max) + "...";
        }
        return str;
    }

}