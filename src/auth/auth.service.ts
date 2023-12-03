import { JwtService } from "@nestjs/jwt";
import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

import { PrismaService } from "src/prisma/prisma.service";
import { AuthSignInDTO, AuthSignUpDTO } from "./dto";
import * as argon from 'argon2';
import { ConfigService } from "@nestjs/config";

@Injectable({})
class AuthService {

    constructor(private prisma: PrismaService, private jwt:JwtService, private config:ConfigService) { }

    async signin(dto: AuthSignInDTO) {
        const user = await this.prisma.user.findUnique({where: {email:dto.email}});

        if (!user) throw new ForbiddenException("Credentials Mismatch");

        const pwVerify = await argon.verify(user.hash, dto.password);

        if (!pwVerify) throw new ForbiddenException("Credentials Mismatch");

        return this.signToken(user.id, user.email);
    }

    async signup(dto: AuthSignUpDTO) {
        const hash = await argon.hash(dto.password);
        try {
            const user = await this.prisma.user.create({
                data: {
                    email: dto.email,
                    hash: hash,
                    firstName: dto.firstName,
                    lastName: dto.lastName
                }
            });
            return this.signToken(user.id, user.email);
        } catch (error) {
            
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new ForbiddenException("Client Exists with the given email");
            }

            throw error;
        }
    }

    async signToken(userId: number, emailId: string): Promise<{access_token: string}> {
        const payload = {
            userId,
            emailId
        };

        const secret = this.config.get('JWT_SECRET');

        const access_token = await this.jwt.signAsync(payload, {
            expiresIn: '15m',
            secret: secret
        });

        return {access_token,};
    }
}

export default AuthService;