// import { Injectable, NotFoundException } from '@nestjs/common';
// import axios from 'axios';
// import { User } from '../../domain/entities/user.entity';
// import { IUserRepository } from '../../domain/interfaces/user.repository.interface';

// @Injectable()
// export class UserHttpAdapter implements IUserRepository {
//   private readonly API_URL = 'https://jsonplaceholder.typicode.com/users';

//   async findAll(): Promise<User[]> {
//     const { data } = await axios.get<User[]>(this.API_URL);
//     return data;
//   }

//   async create(user: Omit<User, 'id'>): Promise<User> {
//     const { data } = await axios.post<User>(this.API_URL, user);
//     return data;
//   }

//   async findById(id: string): Promise<User> {
//     const { data } = await axios.get<User>(`${this.API_URL}/${id}`);
//     return data;
//   }

//   async findByEmail(email: string): Promise<User> {
//     const { data } = await axios.get<User[]>(this.API_URL, {
//       params: { email }
//     });

//     const user = data.find(user => user.email === email);

//     if (!user) {
//       throw new NotFoundException(`User with email ${email} not found`);
//     }

//     return user;
//   }
// }