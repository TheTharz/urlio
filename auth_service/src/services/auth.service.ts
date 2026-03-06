import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import prisma from '../configs/database.config';
import { RegisterRequestDTO } from '../dtos/register-request.dto';
import { LoginRequestDTO } from '../dtos/login-request.dto';
import { AuthResponseDTO } from '../dtos/auth-response.dto';
import { env } from '../configs/env.config';

export class AuthService {
    async register(data: RegisterRequestDTO): Promise<AuthResponseDTO> {
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (existingUser) {
            throw new Error('Email already in use');
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        const user = await prisma.user.create({
            data: {
                email: data.email,
                password: hashedPassword,
                name: data.name,
            },
        });

        const token = jwt.sign(
            { id: user.id, email: user.email },
            env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name || undefined,
            },
        };
    }

    async login(data: LoginRequestDTO): Promise<AuthResponseDTO> {
        const user = await prisma.user.findUnique({
            where: { email: data.email },
        });

        if (!user) {
            throw new Error('Invalid email or password');
        }

        const isValidPassword = await bcrypt.compare(data.password, user.password);

        if (!isValidPassword) {
            throw new Error('Invalid email or password');
        }

        const token = jwt.sign(
            { id: user.id, email: user.email },
            env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                name: user.name || undefined,
            },
        };
    }
}

export const authService = new AuthService();
