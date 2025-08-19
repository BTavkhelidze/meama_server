import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from "@nestjs/common";
import { SignInDto } from "./dto/SignIn.dto";
import { InjectModel } from "@nestjs/mongoose";
import { isValidObjectId, Model } from "mongoose";
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

  async signInOTP(signInDto: SignInDto) {
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

  verifyOTP(token) {
    return this.otpService.verifyOTP(token);
  }

  signIn() {
    return "yes";
  }

  async getUser(user) {
    if (!isValidObjectId(user))
      throw new BadRequestException("Invalid id Format");
    const activeUser = await this.userModel.findById(user);
    if (!activeUser)
      throw new UnauthorizedException(
        "Sorry,Somthing went wrong. User not found ",
      );

    return activeUser;
  }
}
