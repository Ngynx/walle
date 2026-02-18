import { Module } from "@nestjs/common";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "./schema/user.schema";
import { UserService } from "./user.service";
import { DELTA_DISPATCH_DB_NAME } from "src/common/constants/database.constant";

@Module({
    imports: [MongooseModule.forFeature([{ name: User.name, schema: UserSchema }], DELTA_DISPATCH_DB_NAME)],
    providers: [UserService],
    exports: [UserService]
})
export class UserModule { }