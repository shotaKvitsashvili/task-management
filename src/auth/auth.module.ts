import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { User } from './user.entity';
import { JwtStrategy } from './jwt_strategy';

@Module({
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
    imports: [
        TypeOrmModule.forFeature([User]),
        PassportModule.register({
            defaultStrategy: 'jwt'
        }),
        JwtModule.register({
            secret: 'topSecret',
            signOptions: {
                expiresIn: 3600
            }
        })
    ],
    exports: [JwtStrategy, PassportModule]
})
export class AuthModule { }
