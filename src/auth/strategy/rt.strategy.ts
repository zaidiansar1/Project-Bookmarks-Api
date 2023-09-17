import { ForbiddenException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PassportStrategy } from "@nestjs/passport";
import { Request } from "express";
import { ExtractJwt, Strategy } from "passport-jwt";
import { JwtPayload } from "../types";

@Injectable()
export class RTStrategy extends PassportStrategy(
    Strategy,
    'jwt-refresh'
) {
    constructor(
        config: ConfigService
    ) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: config.get('RT_SECRET'),
            passReqToCallback: true,
        });
    }

    async validate(req: Request, payload: JwtPayload) {
        const rt = req?.get('authorization').replace('Bearer', '').trim();

        if (!rt) throw new ForbiddenException('Refresh Token malformed')
        
        return {
            ...payload,
            rt
        };
    }
}