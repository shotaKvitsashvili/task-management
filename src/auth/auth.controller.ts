import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';

@Controller('auth')
export class AuthController {
    constructor(
        private authService: AuthService
    ) { }

    @Post('/signup')
    signUp(@Body() { username, password }: AuthCredentialsDto): Promise<void> {
        return this.authService.createUser({ username, password })
    }

    @Post('/signin')
    signIn(@Body() { username, password }: AuthCredentialsDto): Promise<{ accessToken: string }> {
        return this.authService.signIn({ username, password })
    }
}
