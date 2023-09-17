import { ForbiddenException, Injectable } from "@nestjs/common";
import { RepositoryService } from "src/repository/repository.service";
import { AuthDTO } from "./dto";
import * as argon from "argon2";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";

@Injectable({})
export class AuthService {
    constructor(
        private repositoryService: RepositoryService,
        private jwtService: JwtService,
        private config: ConfigService,
    ) {}

    async signUp(dto: AuthDTO) {
        try {
            // Generate the password hash
            const generatedHash = await argon.hash(dto.password);
            // Save the new user in DB
            const user = await this.repositoryService.user.create({
                data: {
                    email: dto.email,
                    hash: generatedHash
                }
            });

            // Return the saved user
            const tokens = await this.getTokens(user.id, user.email);
            this.updateRTHash(user.id, tokens.refresh_token);
            return tokens;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new ForbiddenException("User already registered");
            }
            throw error;
        }
    }

    async signIn(dto: AuthDTO) {
        //find the user in the DB using unique email column 
        const user = await this.repositoryService.user.findUnique({
            where: {
                email: dto.email
            }
        });
        //if user is incorrect throw exception
        if (!user)
            throw new ForbiddenException('Email is incorrect');
        //else verify the password
        const checkPwd = argon.verify(user.hash, dto.password);
        //if password incorrect throw exception
        if (!checkPwd)
            throw new ForbiddenException('Password is incorrect');
        
        const tokens = await this.getTokens(user.id, user.email);
        this.updateRTHash(user.id, tokens.refresh_token);
        return tokens;
    }

    async getTokens(userId: number, email: string) {
        const payload = {
            sub: userId,
            email,
        };

        const at = await this.jwtService.signAsync(payload, {
            secret: this.config.get('AT_SECRET'),
            expiresIn: '15m',
        });

        const rt = await this.jwtService.signAsync(payload, {
            secret: this.config.get('RT_SECRET'),
            expiresIn: '7d',
        });

        return {
            access_token: at,
            refresh_token: rt
        };
    }

    async updateRTHash(userId: number, rt: string) {
        const rtHash = await argon.hash(rt);

        await this.repositoryService.user.update({
            where: {
                id: userId
            },
            data: {
                refreshToken: rtHash
            }
        });
    }

    async refreshTokens(userId: number, refreshToken: string) {
        try {
            const user = await this.repositoryService.user.findUnique({
                where: {
                    id: userId
                }
            });
    
            if (!user && !user.refreshToken) throw new ForbiddenException('Invalid User');
    
            const checkRTHash = argon.verify(refreshToken, user.refreshToken);
    
            if (!checkRTHash) throw new ForbiddenException('Invalid Token');
    
            const tokens = await this.getTokens(user.id, user.email);
            this.updateRTHash(user.id, tokens.refresh_token);
            return tokens;
        } catch (error) {
            throw error;
        }
    }
}