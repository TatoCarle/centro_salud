import { IsString, IsEmail, IsOptional, IsArray, IsBoolean, isString } from 'class-validator';
import { ValidRoles } from 'src/domain/valid-roles/valid-roles.enum';
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';
import { UUID } from 'crypto';

export class UpdateUserDto extends PartialType(CreateUserDto) {

}