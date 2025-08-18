import { Injectable } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
@Injectable()
export class OtpService {
  constructor(private jwtService: JwtService) {
    console.log(process.env.JWT_SECRET);
  }
  async getOTP(user) {
    const payload = {
      user: user._id,
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}
