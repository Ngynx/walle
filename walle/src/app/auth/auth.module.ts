import { Module } from "@nestjs/common";
import { JwtStrategy } from "./strategies/jwt.strategy";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JWT_SECRET } from "src/common/constants/settings.contant";
import { PassportModule } from "@nestjs/passport";
import { UserModule } from "../user/user.module";

@Module({
    imports: [
        PassportModule, ConfigModule, UserModule,
        JwtModule.registerAsync({
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.get<string>(JWT_SECRET),
                signOptions: {
                    expiresIn: '8h'
                }
            })
        })
    ],
    providers: [JwtStrategy]
})
export class AuthModule { }