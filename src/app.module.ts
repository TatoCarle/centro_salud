import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { AppService } from './app.service';
import { UserService } from './application/services/user.service';
import { AuthService } from './application/services/auth.service';
import { TOKENS } from './infrastructure/providers/tokens';
import { ConfigModule } from '@nestjs/config';
import { UserEntity } from './infrastructure/persistence/entities/user.schema';
import { UserMongoAdapter } from './infrastructure/persistence/repositories/user-mongo.adapter';
import { UserController } from './interfaces/http/user.controller';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'mongodb',
      host: process.env.MONGODB_HOST,
      port: +(process.env.MONGODB_PORT || 27017),
      database: process.env.MONGODB_DATABASE,
      entities: [UserEntity],
      synchronize: true,
      useNewUrlParser: true,
      //esta instruccion es para eliminar la base de datos
      //dropSchema: true  // Add this line temporarily
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    TypeOrmModule.forFeature([UserEntity]),
  ],
  controllers: [UserController],
  providers: [
    AppService,
    UserService,
    {
      provide: TOKENS.USER_REPOSITORY,
      useClass: UserMongoAdapter,
    },
  ],
})
export class AppModule {}
