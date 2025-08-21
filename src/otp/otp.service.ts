import { BadRequestException, Injectable, UseGuards } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";

import * as speakeasy from "speakeasy";
import { Response } from "express";

@Injectable()
export class OtpService {
  constructor(private jwtService: JwtService) {}
  async getOTP(user) {
    const token = speakeasy.totp({
      secret: process.env.OTP_SECRET,
      encoding: "base32",
      digits: 4,
    });

    return { token, userNumber: user.number };
  }

  async verifyOTP(
    {
      token,
      number,
    }: {
      token: number;
      number: number;
    },
    res: Response,
  ) {
    const verified = speakeasy.totp.verify({
      secret: process.env.OTP_SECRET,
      encoding: "base32",
      token: token,
      window: 1,
    });

    if (!verified) {
      throw new BadRequestException("Invalid or expired OTP");
    }

    const payload = {
      sub: number,
    };

    const access_token = await this.jwtService.signAsync(payload, {
      expiresIn: "1h",
    });
    res.cookie("access_token", access_token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 1000 * 60 * 30,
      path: "/",
    });

    return res.json({ message: "succesfull" });
  }
  // @UseGuards(authOTPToken)
  // async getToken(payload) {

  // }
}
