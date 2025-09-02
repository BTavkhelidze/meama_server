import { BadRequestException, Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as speakeasy from "speakeasy";
import { Response } from "express";
import { VerifyOtpDto } from "src/auth/dto/verifyOtpDto.dto";

@Injectable()
export class OtpService {
  constructor(private jwtService: JwtService) {}
  async getOTP({ number }) {
    const token = speakeasy.totp({
      secret: process.env.OTP_SECRET,
      encoding: "base32",
      digits: 4,
    });

    return { token, number };
  }

  async verifyOTP(verifyOtpDto: VerifyOtpDto) {
    const verified = speakeasy.totp.verify({
      secret: process.env.OTP_SECRET,
      encoding: "base32",
      token: verifyOtpDto.token,
      window: 1,
      digits: 4,
    });

    if (!verified) {
      throw new BadRequestException("Invalid or expired OTP");
    }

    const payload = {
      sub: verifyOtpDto.number,
    };
    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: "1h",
    });

    return { access_token };
  }
  // @UseGuards(authOTPToken)
  // async getToken(payload) {

  // }
}
