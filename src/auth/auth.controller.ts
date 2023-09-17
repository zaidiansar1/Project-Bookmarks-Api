import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthDTO } from "./dto";
import { RTGuard } from "./guards";
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signUp')
    signUp(@Body() dto: AuthDTO) {
        return this.authService.signUp(dto);
    }

    @Post('signIn')
    signIn(@Body() dto: AuthDTO) {
        return this.authService.signIn(dto);
    }
    
    @UseGuards(RTGuard)
    @Post('refresh')
    refreshTokens(@Req() req) {
        return this.authService.refreshTokens(req.user.sub, req.user.rt);
    }
}