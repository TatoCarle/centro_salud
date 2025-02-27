import { ValidRoles } from '../valid-roles/valid-roles.enum';

export interface User {
  id: string;
  email: string;
  password?: string;
  fullName: string;
  isActive: boolean;
  roles: ValidRoles[];
}