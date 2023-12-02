import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthSignInDTO, AuthSignUpDTO } from "./dto";
import * as argon from 'argon2';
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable({})
class AuthService {

    constructor(private prisma: PrismaService) { }

    async signin(dto: AuthSignInDTO) {
        const user = await this.prisma.user.findUnique({where: {email:dto.email}});

        if (!user) throw new ForbiddenException("Credentials Mismatch");

        const pwVerify = await argon.verify(user.hash, dto.password);

        if (!pwVerify) throw new ForbiddenException("Credentials Mismatch");

        delete user.hash;
        return user;
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
            delete user.hash;
            return user;
        } catch (error) {
            
            if (error instanceof PrismaClientKnownRequestError) {
                if (error.code === 'P2002')
                    throw new ForbiddenException("Client Exists with the given email");
            }

            throw error;
        }
    }

}

export default AuthService;