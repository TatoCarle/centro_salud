import { Injectable, NotFoundException, Inject } from '@nestjs/common';
import { TOKENS } from '../../infrastructure/providers/tokens';
import { IPatientRepository } from '../../domain/interfaces/patient.repository.interface';
import { CreatePatientDto } from '../../interfaces/http/dtos/create-patient.dto';
import { UpdatePatientDto } from '../../interfaces/http/dtos/update-patient.dto';
import { Patient } from '../../domain/entities/patient.entity';

@Injectable()
export class PatientService {
  constructor(
    @Inject(TOKENS.PATIENT_REPOSITORY)
    private readonly patientRepository: IPatientRepository
  ) {}

  async create(createPatientDto: CreatePatientDto) {
    const patientData: Omit<Patient, 'id'> = {
      ...createPatientDto,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return await this.patientRepository.create(patientData);
  }

  async findAll() {
    return await this.patientRepository.findAll();
  }

  async findOne(id: string) {
    return await this.patientRepository.findOne(id);
  }

  async findByDni(dni: string) {
    return await this.patientRepository.findByDni(dni);
  }

  async update(id: string, updatePatientDto: UpdatePatientDto) {
    const existingPatient = await this.patientRepository.findOne(id);

    if (!existingPatient) {
      throw new NotFoundException(`Paciente con ID ${id} no encontrado`);
    }

    return await this.patientRepository.update(id, updatePatientDto);
  }

  async delete(id: string) {
    return await this.patientRepository.delete(id);
  }
}