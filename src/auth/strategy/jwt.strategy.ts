import { Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import { RepositoryService } from "src/repository/repository.service";

@Injectable()
export class JwtStrategy extends PassportStrategy (
    Strategy,
    'jwt'
) {
    constructor(
        config: ConfigService,
        private prisma: RepositoryService,
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('JWT_SECRET'),
            expiresIn: '15m'
        })
    }

    async validate(payload: { sub: number, email: string }) {
        const user = await this.prisma.user.findUnique({
            where: {
                id: payload.sub
            }
        });
        const { hash, ...result } = user;
        
        return result;
    }
}