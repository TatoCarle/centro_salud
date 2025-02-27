import { IsString, IsEmail, MinLength, IsOptional, IsBoolean, IsArray, MaxLength, Matches, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';
import { ValidRoles } from '../../../domain/valid-roles/valid-roles.enum';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  @MaxLength(50)
  @Matches(
    /(?:(?=.*\d)|(?=.*\W+))(?![.\n])(?=.*[A-Z])(?=.*[a-z]).*$/, {
    message: 'The password must have a Uppercase, lowercase letter and a number'
  })
  password: string;

  @IsString()
  @MinLength(3)
  fullName: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsArray()
  @IsEnum(ValidRoles, { each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [value])
  roles?: ValidRoles[];
}