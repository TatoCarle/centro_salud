import { Controller, Get, Post, Body, Param, Put, Patch } from '@nestjs/common';
import { UserService } from '../../application/services/user.service';
import { CreateUserDto } from './dtos/create-user.dto';
import { LoginUserDto } from './dtos/login-user.dto';
import { UpdateUserDto } from './dtos/update-user-dto';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../domain/entities/user.entity';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { AuthService } from 'src/application/services/auth.service';

interface JwtPayload {
  id: string;
}

@Controller('users')
export class UserController {
  constructor(
    private readonly userService: UserService,

    private readonly authService: AuthService
  ) { }

  @Post('register')
  @ApiOperation({ summary: 'Register User' })
  @ApiResponse({ status: 200, description: 'Return an User and token.' })

  register(@Body() createUserDto: CreateUserDto) {
    return this.userService.register(createUserDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Login user get an token' })
  @ApiResponse({ status: 200, description: 'New Token auth.' })
  login(@Body() loginUserDto: LoginUserDto) {
    return this.userService.login(loginUserDto);
  }



  @Post('renew')
  @ApiOperation({ summary: 'renew token user' })
  @ApiResponse({ status: 200, description: 'Return a new Token' })
  checkAuthStatus(@Body() user: User) {
    console.log(user);
    return {
      ...user,
      token: this.authService.getJwtToken({ id: user.id })
    };
  }




  @Patch(':id')
  @ApiOperation({ summary: 'Update User' })
  @ApiResponse({ status: 200, description: 'Return an User.' })
  update_user(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }
  soft_update_user(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.patch(id, updateUserDto);
  }
  @Get()
  @ApiOperation({ summary: 'Get All Users' })
  @ApiResponse({ status: 200, description: 'Return an Array of Users.' })
  findAll() {
    return this.userService.findAll();
  }
  @Get(':id')
  @ApiOperation({ summary: 'Get an User' })
  @ApiResponse({ status: 200, description: 'Return an User.' })
  findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }
}