
export async function assertResponseOk(response: Response) {
    if (!response.ok) {
        throw new Error(`Request failed, status: ${response.status} - ${await response.text()}`);
    }
}