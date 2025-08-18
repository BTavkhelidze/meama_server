import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { SignInDto } from "./dto/SignIn.dto";
// import * as speakeasy from "speakeasy";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "src/users/schema/user.schema";

import { SignUpDto } from "./dto/sign-up.dto";
import { OtpService } from "src/otp/otp.service";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel("user") private userModel: Model<User>,

    private otpService: OtpService,
  ) {}

  async signUp(signUpdto: SignUpDto) {
    const user = await this.userModel.findOne({ number: signUpdto.number });
    if (user) throw new NotFoundException("user alrady exists");
    return await this.userModel.create({ ...signUpdto, active: true });
  }

  async signIn(signInDto: SignInDto) {
    const user = await this.userModel.findOne({ number: signInDto.number });
    if (!user) throw new BadRequestException("user not found");
    // const payload = { sub: user._id, username: user.email };
    // const secret = speakeasy.generateSecret({ length: 20 });
    // const token = speakeasy.totp({
    //   secret: secret.base32,
    //   encoding: "base32",
    // });

    // return token;
    // return { access_token: await this.jwtService.sign(payload) };
    return this.otpService.getOTP(user);
  }

  getUser(user) {
    return user;
  }
}
