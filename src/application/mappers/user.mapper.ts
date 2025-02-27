import { User } from '../../domain/entities/user.entity';
import { UserEntity } from '../../infrastructure/persistence/entities/user.schema';
import { CreateUserDto } from '../../interfaces/http/dtos/create-user.dto';
import { ValidRoles } from '../../domain/valid-roles/valid-roles.enum';

export class UserMapper {
  static toDomain(entity: UserEntity): User {
    return {
      id: entity._id,
      email: entity.email,
      password: entity.password,
      fullName: entity.fullName,
      isActive: entity.isActive,
      roles: entity.roles as ValidRoles[]
    };
  }

  static toEntity(user: Omit<User, 'id'>): Partial<UserEntity> {
    return {
      email: user.email,
      password: user.password,
      fullName: user.fullName,
      isActive: user.isActive ?? true,
      roles: user.roles ?? [ValidRoles.user]
    };
  }

  static fromDto(dto: CreateUserDto): Omit<User, 'id'> {
    return {
      email: dto.email,
      password: dto.password,
      fullName: dto.fullName,
      isActive: dto.isActive ?? true,
      roles: dto.roles ?? [ValidRoles.user]
    };
  }
}