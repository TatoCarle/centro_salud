import { Controller, Get, Post, Body, Param, Delete, Put, Patch } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { PatientService } from '../../application/services/patient.service';
import { CreatePatientDto } from './dtos/create-patient.dto';
import { UpdatePatientDto } from './dtos/update-patient.dto';

@ApiTags('patients')
@Controller('patients')
export class PatientController {
  constructor(private readonly patientService: PatientService) { }

  @Post()
  @ApiOperation({ summary: 'Crear nuevo paciente' })
  @ApiResponse({ status: 201, description: 'Paciente creado exitosamente.' })
  @ApiResponse({ status: 400, description: 'Datos inválidos.' })
  create(@Body() createPatientDto: CreatePatientDto) {
    console.log("Ingresan datos de paciente al controlador", createPatientDto);

    return this.patientService.create(createPatientDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los pacientes' })
  @ApiResponse({ status: 200, description: 'Lista de pacientes.' })
  findAll() {
    console.log('findAll');
    return this.patientService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener un paciente por ID' })
  @ApiResponse({ status: 200, description: 'Paciente encontrado.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  findOne(@Param('id') id: string) {
    return this.patientService.findOne(id);
  }

  @Get('dni/:dni')
  @ApiOperation({ summary: 'Obtener un paciente por DNI' })
  @ApiResponse({ status: 200, description: 'Paciente encontrado.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  findByDni(@Param('dni') dni: string) {
    return this.patientService.findByDni(dni);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Actualizar un paciente' })
  @ApiResponse({ status: 200, description: 'Paciente actualizado.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  update(@Param('id') id: string, @Body() updatePatientDto: UpdatePatientDto) {
    return this.patientService.update(id, updatePatientDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Eliminar un paciente' })
  @ApiResponse({ status: 200, description: 'Paciente eliminado.' })
  @ApiResponse({ status: 404, description: 'Paciente no encontrado.' })
  remove(@Param('id') id: string) {
    return this.patientService.delete(id);
  }
}