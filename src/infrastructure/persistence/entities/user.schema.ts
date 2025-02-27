import { Entity, Column, ObjectIdColumn, Index } from 'typeorm';
import { ValidRoles } from '../../../domain/valid-roles/valid-roles.enum';
import { ApiProperty } from '@nestjs/swagger';

@Entity('users')
export class UserEntity {
  @ApiProperty({ description: 'id user', example: '506196f9-5441-4889-a5af-f7889c8ddf8a', uniqueItems: true })
  @ObjectIdColumn()
  _id: string;

  @ApiProperty({ description: 'email user', example: 'user@example.com', uniqueItems: true })
  @Column()
  @Index('IDX_USER_EMAIL_NEW', { unique: true })  // Added specific index name
  email: string;

  @ApiProperty({ description: 'password user', example: '123456' })
  @Column()
  password: string;

  @ApiProperty({ description: 'fullName user', example: 'John Doe' })
  @Column()
  fullName: string;

  @ApiProperty({ description: 'isActive user', example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ description: 'roles user', example: ['admin', 'user'] })
  @Column('array')
  roles: ValidRoles[];
}