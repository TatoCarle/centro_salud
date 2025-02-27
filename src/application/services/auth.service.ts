import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  getJwtToken(payload: { id: string }): string {
    return this.jwtService.sign(payload);
  }
}