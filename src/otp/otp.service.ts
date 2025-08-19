import { BadRequestException, Injectable, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { userInfo } from "os";
import * as speakeasy from "speakeasy";
import { authOTPToken } from "src/auth/guard/authOTPToken.guard";
@Injectable()
export class OtpService {
  constructor(private jwtService: JwtService) {}
  async getOTP(user) {
    const token = speakeasy.totp({
      secret: process.env.OTP_SECRET,
      encoding: "base32",
    });

    return { token, userNumber: user.number };
  }

  async verifyOTP({ token, userId }: { token: number; userId: string }) {
    const verified = speakeasy.totp.verify({
      secret: process.env.OTP_SECRET,
      encoding: "base32",
      token: token,
      window: 1,
    });
    console.log(token, userId);
    if (!verified) {
      throw new BadRequestException("Invalid or expired OTP");
    }
    const payload = {
      sub: userId,
    };

    return {
      accessToken: await this.jwtService.sign(payload, { expiresIn: "1h" }),
    };
  }

  // @UseGuards(authOTPToken)
  // async getToken(payload) {

  // }
}
