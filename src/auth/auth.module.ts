import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtModule } from "@nestjs/jwt";
import { ATStrategy, RTStrategy } from "./strategy";
import { APP_GUARD } from "@nestjs/core";
import { ATGuard } from "./common/guards";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [
        AuthService,
        ATStrategy, 
        RTStrategy,
        {
            provide: APP_GUARD,
            useClass: ATGuard
        }
    ]
})
export class AuthModule {}