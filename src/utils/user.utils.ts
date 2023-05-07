export async function generateAvatarLink(gender: string): Promise<string> {
    try {
        const url = `https://randomuser.me/api/?gender=${gender}&inc=picture`;
        const response = await fetch(url);
        const data = await response.json();
        return data.results[0].picture.large;
    } catch (error) {
        return "https://cdn-icons-png.flaticon.com/512/1/1247.png"
    }
}