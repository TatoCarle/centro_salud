export class Patient {
  constructor(
    public id: string,
    public firstName: string,
    public lastName: string,
    public dni: string,
    public email: string,
    public phone: string,
    public birthDate: Date,
    public address: string,
    public healthInsurance: string,
    public insuranceNumber: string,
    public bloodType?: string,
    public allergies?: string[],
    public chronicConditions?: string[],
    public isActive: boolean = true,
    public createdAt: Date = new Date(),
    public updatedAt: Date = new Date()
  ) {}
}