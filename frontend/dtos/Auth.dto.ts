export interface RegisterRequestDTO {
    email: string;
    password: string;
    name?: string;
}

export interface LoginRequestDTO {
    email: string;
    password: string;
}

export interface AuthResponseDTO {
    token: string;
    user: {
        id: string;
        email: string;
        name?: string;
    }
}
