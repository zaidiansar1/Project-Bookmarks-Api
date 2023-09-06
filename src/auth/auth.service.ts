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

            const {hash, ...result} = user;

            // Return the saved user
            return result;
        } catch (error) {
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new ForbiddenException("User already registered");
            }
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
        
        return this.signToken(user.id, user.email);
    }

    async signToken(userId: number, email: string) {
        const payload = {
            sub: userId,
            email,
        };

        const token = await this.jwtService.signAsync(payload, {
            secret: this.config.get('JWT_SECRET'),
            expiresIn: '15m',
        });

        return {
            access_token: token,
        };
    }
}