import { Patient } from '../entities/patient.entity';

export interface IPatientRepository {
  findAll(): Promise<Patient[]>;
  findOne(id: string): Promise<Patient>;
  create(patient: Omit<Patient, 'id'>): Promise<Patient>;
  update(id: string, patient: Partial<Patient>): Promise<Patient>;
  delete(id: string): Promise<void>;
  findByDni(dni: string): Promise<Patient>;
}