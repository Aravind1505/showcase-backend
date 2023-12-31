import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import AuthModule from './auth/auth.module';

@Module({
  imports: [
    AuthModule, 
    UserModule, 
    PrismaModule, 
    ConfigModule.forRoot({
      isGlobal: true
    })
  ]
})
export class AppModule {}
