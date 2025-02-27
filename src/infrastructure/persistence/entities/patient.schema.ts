import { Entity, Column, ObjectIdColumn } from 'typeorm';

@Entity('patients')
export class PatientEntity {
  @ObjectIdColumn()
  _id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ unique: true })
  dni: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column()
  birthDate: Date;

  @Column()
  address: string;

  @Column()
  healthInsurance: string;

  @Column()
  insuranceNumber: string;

  @Column({ nullable: true })
  bloodType?: string;

  @Column('simple-array', { nullable: true })
  allergies?: string[];

  @Column('simple-array', { nullable: true })
  chronicConditions?: string[];

  @Column({ default: true })
  isActive: boolean;

  @Column()
  createdAt: Date;

  @Column()
  updatedAt: Date;
}