import axios, { AxiosResponse } from "axios";

export class SansGithub {
    public static async findReleases(modName: string): Promise<any> {
        try {
            let res: AxiosResponse = await axios.get(`https://api.github.com/search/repositories?q=${modName}`);
            if(res.status != 200) return null;
            if(res.data.items[0].name == modName)
                return `https://github.com/${res.data.items[0].full_name}/releases`;
        } catch (err) {
            return null;
        }

    }
}