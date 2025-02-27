import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { PatientEntity } from '../entities/patient.schema';
import { IPatientRepository } from '../../../domain/interfaces/patient.repository.interface';
import { Patient } from '../../../domain/entities/patient.entity';

@Injectable()
export class PatientMongoAdapter implements IPatientRepository {
  private readonly logger = new Logger(PatientMongoAdapter.name);

  constructor(
    @InjectRepository(PatientEntity)
    private readonly patientRepository: Repository<PatientEntity>
  ) { }

  async findAll(): Promise<Patient[]> {
    const entities = await this.patientRepository.find();
    return entities.map(this.toPatient);
  }

  async findOne(id: string): Promise<Patient> {
    const entity = await this.patientRepository.findOne({
      where: { _id: id }
    });

    if (!entity) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    return this.toPatient(entity);
  }

  async findByDni(dni: string): Promise<Patient> {
    const entity = await this.patientRepository.findOne({
      where: { dni }
    });

    if (!entity) {
      throw new NotFoundException(`Paciente con DNI ${dni} no encontrado`);
    }

    return this.toPatient(entity);
  }

  async create(patient: Omit<Patient, 'id'>): Promise<Patient> {
    try {
      const existingPatient = await this.patientRepository.findOne({
        where: { dni: patient.dni }
      });

      if (existingPatient) {
        throw new ConflictException(`Ya existe un paciente con el DNI ${patient.dni}`);
      }

      const entity = this.patientRepository.create({
        _id: uuidv4(),
        ...patient,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      console.log("Paciente creado!!!", entity);

      const savedEntity = await this.patientRepository.save(entity);
      return this.toPatient(savedEntity);
    } catch (error) {
      this.logger.error('Error al crear paciente:', error);
      throw error;
    }
  }

  async update(id: string, patientData: Partial<Patient>): Promise<Patient> {
    const existingPatient = await this.patientRepository.findOne({
      where: { _id: id }
    });

    if (!existingPatient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    if (patientData.dni && patientData.dni !== existingPatient.dni) {
      const duplicateDni = await this.patientRepository.findOne({
        where: { dni: patientData.dni }
      });

      if (duplicateDni) {
        throw new ConflictException(`Ya existe un paciente con el DNI ${patientData.dni}`);
      }
    }

    const updatedEntity = this.patientRepository.merge(existingPatient, {
      ...patientData,
      updatedAt: new Date()
    });

    const savedEntity = await this.patientRepository.save(updatedEntity);
    return this.toPatient(savedEntity);
  }

  async delete(id: string): Promise<void> {
    const result = await this.patientRepository.delete({ _id: id });

    if (result.affected === 0) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }
  }

  private toPatient(entity: PatientEntity): Patient {
    return new Patient(
      entity._id,
      entity.firstName,
      entity.lastName,
      entity.dni,
      entity.email,
      entity.phone,
      entity.birthDate,
      entity.address,
      entity.healthInsurance,
      entity.insuranceNumber,
      entity.bloodType,
      entity.allergies,
      entity.chronicConditions,
      entity.isActive,
      entity.createdAt,
      entity.updatedAt
    );
  }
}