import { Body, Controller, Post, Req, UseGuards } from "@nestjs/common";
import { AuthService } from './auth.service';
import { AuthDTO } from "./dto";
import { RTGuard } from "./common/guards";
import { Public } from "./common/decorator";
@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('signUp')
    signUp(@Body() dto: AuthDTO) {
        return this.authService.signUp(dto);
    }

    @Public()
    @Post('signIn')
    signIn(@Body() dto: AuthDTO) {
        return this.authService.signIn(dto);
    }
    
    @Public()
    @UseGuards(RTGuard)
    @Post('refresh')
    refreshTokens(@Req() req) {
        return this.authService.refreshTokens(req.user.sub, req.user.rt);
    }

    @Post('signOut')
    signOut(@Req() req) {
        return this.authService.signOut(req.user.id);
    }
}