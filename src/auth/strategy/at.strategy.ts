import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { RepositoryService } from "src/repository/repository.service";
import { JwtPayload } from "../types";

@Injectable()
export class ATStrategy extends PassportStrategy (
    Strategy,
    'jwt'
) {
    constructor(
        config: ConfigService,
        private prisma: RepositoryService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('AT_SECRET'),
            expiresIn: '15m'
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        });
        const { hash, ...result } = user;
        
        return result;
    }
}