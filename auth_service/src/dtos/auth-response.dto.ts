export interface AuthResponseDTO {
    token: string;
    user: {
        id: string;
        email: string;
        name?: string;
    }
}
