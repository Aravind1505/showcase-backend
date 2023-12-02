import { Body, Controller, Post } from "@nestjs/common";
import AuthService from "./auth.service";
import { AuthSignInDTO, AuthSignUpDTO } from "./dto";

@Controller('auth')
class AuthController {
    constructor(private authService:AuthService) {}

    @Post('signin')
    signin(@Body() dto:AuthSignInDTO) {
        return this.authService.signin(dto);
    }

    @Post('signup')
    signup(@Body() dto:AuthSignUpDTO) {
        return this.authService.signup(dto);
    }
}

export default AuthController;