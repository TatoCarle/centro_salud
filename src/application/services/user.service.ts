import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { TOKENS } from '../../infrastructure/providers/tokens';
import { Inject } from '@nestjs/common';
import { IUserRepository } from 'src/domain/interfaces/user.repository.interface';
import { CreateUserDto } from 'src/interfaces/http/dtos/create-user.dto';
import { LoginUserDto } from 'src/interfaces/http/dtos/login-user.dto';
import { User } from 'src/domain/entities/user.entity';
import { ValidRoles } from 'src/domain/valid-roles/valid-roles.enum';
import { UpdateUserDto } from 'src/interfaces/http/dtos/update-user-dto';
import { DataSource } from 'typeorm';
import { UserEntity } from 'src/infrastructure/persistence/entities/user.schema';
// ... other imports ...


@Injectable()
export class UserService {
  constructor(
    @Inject(TOKENS.USER_REPOSITORY)
    private readonly userRepository: IUserRepository,
    private readonly jwtService: JwtService,
    private readonly dataSource: DataSource,
  ) { }

  async register(createUserDto: CreateUserDto) {
    const userData: Omit<User, 'id'> = {
      ...createUserDto,
      isActive: createUserDto.isActive ?? true,
      roles: createUserDto.roles ?? [ValidRoles.user]
    };

    return await this.userRepository.create(userData);
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findByEmail(email);

    if (!user || !user.password) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Credenciales incorrectas');
    }

    const payload = {
      sub: user.id,
      email: user.email,
      roles: user.roles
    };

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        roles: user.roles
      },
      token: await this.jwtService.signAsync(payload)
    };
  }

  async findAll() {
    return await this.userRepository.findAll();
  }

  async findOne(id: string) {
    return await this.userRepository.findOne(id);
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    // Iniciar transacción
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      // Buscar el usuario existente
      const existingUser = await this.userRepository.findOne(id);
      if (!existingUser) {
        throw new NotFoundException(`User with id: ${id} not found`);
      }

      // Combinar datos existentes con actualizaciones
      const userToUpdate = {
        ...existingUser,
        ...updateUserDto
      };

      // Realizar la actualización dentro de la transacción
      await queryRunner.manager.save(UserEntity, userToUpdate);

      await queryRunner.commitTransaction();

      return await this.userRepository.findOne(id);
    } catch (error) {
      await queryRunner.rollbackTransaction();
      throw error;
    } finally {
      await queryRunner.release();
    }
  }
  async patch(id: string, partialUpdateDto: Partial<UpdateUserDto>) {
    // PATCH - Actualización parcial
    const existingUser = await this.userRepository.findOne(id);
    const updatedUser = { ...existingUser, ...partialUpdateDto };
    return await this.userRepository.update(id, updatedUser);
  }
}