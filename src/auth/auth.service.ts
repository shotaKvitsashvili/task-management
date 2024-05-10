import { ConflictException, Injectable, InternalServerErrorException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt'

import { UsersRepository } from './users.repository';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private usersRepository: UsersRepository,
        private jwtService: JwtService
    ) { }

    async createUser({ username, password }: AuthCredentialsDto): Promise<void> {
        const salt = await bcrypt.genSalt()
        const hashedPass = await bcrypt.hash(password, salt)

        const user = this.usersRepository.create({ username, password: hashedPass });

        try {
            await this.usersRepository.save(user);
        } catch (error) {
            if (error.code == 23505) {
                throw new ConflictException('Username already exists')
            } else {
                throw new InternalServerErrorException()
            }
        }
    }

    async signIn({ username, password }: AuthCredentialsDto): Promise<{ accessToken: string }> {
        const user = await this.usersRepository.findOneBy({ username })

        if (user && (await bcrypt.compare(password, user?.password))) {
            const payload = { username }
            return {
                accessToken: await this.jwtService.sign(payload)
            }
        } else {
            throw new UnauthorizedException('Wrong credentials')
        }
    }
}
