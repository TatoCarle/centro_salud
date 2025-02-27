import { Injectable, NotFoundException, ConflictException, Logger, Inject } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import * as bcrypt from 'bcryptjs';
import { UserEntity } from '../entities/user.schema';
import { IUserRepository } from 'src/domain/interfaces/user.repository.interface';
import { User } from '../../../domain/entities/user.entity';  // Add this import
import { UserMapper } from '../../../application/mappers/user.mapper';
import { ValidRoles } from '../../../domain/valid-roles/valid-roles.enum';  // Add this import
import { CreateUserDto } from 'src/interfaces/http/dtos/create-user.dto';
import { UpdateUserDto } from 'src/interfaces/http/dtos/update-user-dto';

@Injectable()
export class UserMongoAdapter implements IUserRepository {
  private readonly logger = new Logger(UserMongoAdapter.name);

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,

  ) { }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    try {
      const existingUser = await this.userRepository.findOne({
        where: { _id: id }
      });

      if (!existingUser) {
        throw new NotFoundException(`User with id: ${id} not found`);
      }
      // Remove email and _id from updateUserDto if they exist
      delete updateUserDto.email;

      // Si hay contraseña nueva, hashearla
      if (updateUserDto.password) {
        updateUserDto.password = bcrypt.hashSync(updateUserDto.password, 10);
      }
      // Update directly using the repository
      await this.userRepository.update({ _id: id }, updateUserDto);
      // Fetch the updated user
      const updatedUser = await this.userRepository.findOne({
        where: { _id: id }
      });

      if (!updatedUser) {
        throw new NotFoundException(`User with id: ${id} not found after update`);
      }
      return UserMapper.toDomain(existingUser);
    } catch (error) {
      this.logger.error('Error updating user:', error);
      throw error;
    }
  }


  async delete(id: string): Promise<void> {
    if (!this.isValidObjectId(id)) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    const existingUser = await this.userRepository.findOne({
      where: { _id: id }
    });

    if (!existingUser) {
      throw new NotFoundException(`User with id: ${id} not found`);
    }

    await this.userRepository.remove(existingUser);
  }




  async findAll(): Promise<User[]> {
    this.logger.log("Executing findAll");
    const entities = await this.userRepository.find();
    return entities.map(UserMapper.toDomain);
  }

  async findOne(term: string): Promise<User> {
    let entity: UserEntity | null;

    // Try to find by email first
    entity = await this.userRepository.findOne({
      where: { email: term.toLowerCase() },
      select: {
        _id: true,
        email: true,
        password: true,
        fullName: true,
        isActive: true,
        roles: true
      }
    });

    // If not found by email, try by ID
    if (!entity) {
      entity = await this.userRepository.findOne({
        where: { _id: term },
        select: {
          _id: true,
          email: true,
          password: true,
          fullName: true,
          isActive: true,
          roles: true
        }
      });
    }

    if (!entity) {
      throw new NotFoundException(`User with ID/Email ${term} not found`);
    }

    return UserMapper.toDomain(entity);
  }


  async findByEmail(email: string): Promise<User> {
    const entity = await this.userRepository.findOne({
      where: { email },
      select: {
        _id: true,
        email: true,
        password: true,
        fullName: true,
        isActive: true,
        roles: true
      }
    });

    if (!entity) {
      throw new NotFoundException(`Usuario no encontrado`);
    }

    return UserMapper.toDomain(entity);
  }


  async create(user: Omit<User, 'id'>): Promise<User> {
    try {
      const normalizedEmail = user.email.toLowerCase().trim();

      const existingUser = await this.userRepository.findOne({
        where: { email: normalizedEmail }
      });

      if (existingUser) {
        throw new ConflictException(`Email ${normalizedEmail} already exists`);
      }


      if (!user.password) {
        throw new Error('Password is required');
      }

      const userEntity = this.userRepository.create({
        _id: uuidv4(),
        email: normalizedEmail,
        password: bcrypt.hashSync(user.password, 10),
        fullName: user.fullName,
        isActive: user.isActive ?? true,
        roles: user.roles ?? [ValidRoles.user]
      });

      const savedEntity = await this.userRepository.save(userEntity);
      return UserMapper.toDomain(savedEntity);
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      this.logger.error('Error creating user:', error);
      throw new Error('Error creating user');
    }
  }

  // Agregar este método helper para validar ids de MongoDB
  private isValidObjectId(id: string): boolean {
    return /^[0-9a-fA-F]{24}$/.test(id);
  }
}