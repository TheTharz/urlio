import { Request, Response } from 'express';
import { authService } from '../services/auth.service';

export class AuthController {
    async register(req: Request, res: Response) {
        try {
            const { email, password, name } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required' });
            }

            const result = await authService.register({ email, password, name });
            res.status(201).json({ success: true, data: result });
        } catch (error: any) {
            if (error.message === 'Email already in use') {
                return res.status(409).json({ success: false, message: error.message });
            }
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    async login(req: Request, res: Response) {
        try {
            const { email, password } = req.body;

            if (!email || !password) {
                return res.status(400).json({ success: false, message: 'Email and password are required' });
            }

            const result = await authService.login({ email, password });
            res.status(200).json({ success: true, data: result });
        } catch (error: any) {
            if (error.message === 'Invalid email or password') {
                return res.status(401).json({ success: false, message: error.message });
            }
            console.error(error);
            res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }
}

export const authController = new AuthController();
