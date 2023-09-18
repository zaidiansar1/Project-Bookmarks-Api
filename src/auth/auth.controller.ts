import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthDTO } from "./dto";
import { AuthGuards, RTGuard } from "./guards";
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

    @UseGuards(AuthGuards)
    @Post('signOut')
    signOut(@Req() req) {
        return this.authService.signOut(req.user.id);
    }
}