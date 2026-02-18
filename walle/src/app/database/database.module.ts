import { DynamicModule, Global, Module } from "@nestjs/common"
import { ConfigModule, ConfigService } from "@nestjs/config"
import { MongooseModule } from "@nestjs/mongoose"
import { TypeOrmModule } from "@nestjs/typeorm"
import { AUTHSOFTWARE_SERVER_DB_NAME, DELTA_DISPATCH_DB_NAME } from "src/common/constants/database.constant"
import { getPostgresDatabaseConfig } from "./config/database-postgresql.config"
import * as crypto from 'crypto'

// Make crypto globally available for TypeORM in Node.js v18
if (typeof (globalThis as any).crypto === 'undefined') {
    (globalThis as any).crypto = crypto
}

@Global()
@Module({
    imports: [
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: getPostgresDatabaseConfig,
        })
    ]
})
export class DatabaseModule {
    static forDeltaDispatchApplication(_uri: string): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [MongooseModule.forRoot(_uri, { connectionName: DELTA_DISPATCH_DB_NAME })],
            exports: [MongooseModule]
        }
    };

    static forAuthSoftwareApplication(_uri: string): DynamicModule {
        return {
            module: DatabaseModule,
            imports: [MongooseModule.forRoot(_uri, { connectionName: AUTHSOFTWARE_SERVER_DB_NAME })],
            exports: [MongooseModule]
        }
    }

    // static forRobinApplication(_uri: string): DynamicModule {
    //     return {
    //         module: DatabaseModule,
    //         imports: [MongooseModule.forRoot(_uri, { connectionName: ROBIN_SERVER_DB_NAME })],
    //         exports: [MongooseModule]
    //     }
    // };
}