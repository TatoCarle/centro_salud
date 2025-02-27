import { IsString, IsEmail, IsOptional, IsArray, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePatientDto {
  @ApiProperty({ description: 'Nombre del paciente' })
  @IsString()
  firstName: string;

  @ApiProperty({ description: 'Apellido del paciente' })
  @IsString()
  lastName: string;

  @ApiProperty({ description: 'DNI del paciente' })
  @IsString()
  dni: string;

  @ApiProperty({ description: 'Email del paciente' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: 'Teléfono del paciente' })
  @IsString()
  phone: string;

  @ApiProperty({ description: 'Fecha de nacimiento del paciente' })
  @IsDateString()
  birthDate: Date;

  @ApiProperty({ description: 'Dirección del paciente' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'Obra social o prepaga del paciente' })
  @IsString()
  healthInsurance: string;

  @ApiProperty({ description: 'Número de afiliado' })
  @IsString()
  insuranceNumber: string;

  @ApiProperty({ description: 'Grupo sanguíneo', required: false })
  @IsOptional()
  @IsString()
  bloodType?: string;

  @ApiProperty({ description: 'Alergias', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  allergies?: string[];

  @ApiProperty({ description: 'Condiciones crónicas', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  chronicConditions?: string[];
}