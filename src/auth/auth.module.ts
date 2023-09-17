import { Module } from "@nestjs/common";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { JwtStrategy } from "./strategy";
import { JwtModule } from "@nestjs/jwt";
import { RTStrategy } from "./strategy/rt.strategy";

@Module({
    imports: [JwtModule.register({})],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy, RTStrategy]
})
export class AuthModule {}