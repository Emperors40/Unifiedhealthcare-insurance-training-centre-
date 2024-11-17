import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../types';

const SECRET_KEY = process.env.JWT_SECRET || 'your-secret-key';

class AuthService {
  async generateToken(user: User): Promise<string> {
    return jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: '1d' });
  }

  async verifyToken(token: string): Promise<any> {
    return jwt.verify(token, SECRET_KEY);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async comparePasswords(plainTextPassword: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(plainTextPassword, hashedPassword);
  }
}

export const authService = new AuthService();