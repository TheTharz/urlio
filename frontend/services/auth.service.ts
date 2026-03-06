import axios from 'axios';
import { RegisterRequestDTO, LoginRequestDTO, AuthResponseDTO } from '../dtos/Auth.dto';

const API_URL = 'http://localhost:5002/api/v1/auth';

export const login = async (data: LoginRequestDTO): Promise<AuthResponseDTO> => {
    const response = await axios.post<{ data: AuthResponseDTO }>(`${API_URL}/login`, data);
    return response.data.data;
};

export const register = async (data: RegisterRequestDTO): Promise<AuthResponseDTO> => {
    const response = await axios.post<{ data: AuthResponseDTO }>(`${API_URL}/register`, data);
    return response.data.data;
};
