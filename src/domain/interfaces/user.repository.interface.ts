import { User } from '../entities/user.entity';

export interface IUserRepository {
  findAll(): Promise<User[]>;
  findOne(id: string): Promise<User>;
  findByEmail(email: string): Promise<User>;
  create(user: Omit<User, 'id'>): Promise<User>;
  update(id: string, user: Partial<User>): Promise<User>;
  // Removing updateCompleted
}