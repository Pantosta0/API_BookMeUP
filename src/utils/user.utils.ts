import axios from 'axios';


export async function generateAvatarLink(gender: string): Promise<string> {
    try {
        const url = `https://randomuser.me/api/?gender=${gender}&inc=picture`;
        const response = await axios.get(url);
        return response.data.results[0].picture.large
    } catch (error: any) {
        console.debug(error.message || "error");
        return "https://cdn-icons-png.flaticon.com/512/1/1247.png"
    }
}