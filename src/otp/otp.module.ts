import { Module } from "@nestjs/common";
import { OtpService } from "./otp.service";
import { JwtModule } from "@nestjs/jwt";
import { ConfigModule } from "@nestjs/config";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: "60m" },
    }),
  ],
  providers: [OtpService],
  exports: [OtpService],
})
export class OtpModule {}
