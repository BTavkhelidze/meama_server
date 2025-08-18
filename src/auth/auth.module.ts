import { Module } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthController } from "./auth.controller";
import { MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "src/users/schema/user.schema";

import { OtpService } from "src/otp/otp.service";

@Module({
  imports: [MongooseModule.forFeature([{ name: "user", schema: UserSchema }])],
  controllers: [AuthController],
  providers: [AuthService, OtpService],
})
export class AuthModule {}
