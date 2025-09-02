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
import { SignUpWithNumberDto } from "./dto/SignUpWithNumber.dto";

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

  async SignUpWithPhone(signUpWithNumberDto: SignUpWithNumberDto) {
    const user = await this.userModel.findOne({
      number: +signUpWithNumberDto.number,
    });
    console.log(user);
    if (user) throw new NotFoundException("user alrady exists");
    const newUser = {
      firstName: signUpWithNumberDto.firstName,
      lastName: signUpWithNumberDto.lastName,
      email: `${signUpWithNumberDto.number}@otp.costumer.me`,
      number: +signUpWithNumberDto.number,
    };
    const otp = await this.otpService.getOTP({
      number: +signUpWithNumberDto.number,
    });

    const token = await this.otpService.verifyOTP(otp);
    if (!token)
      throw new BadRequestException("Sign Up With Number Somthing went wrong");
    await this.userModel.create(newUser);

    return { ...token, status: 200, message: "created successfully" };
  }

  async signInOTP(signInDto: SignInDto) {
    // const user = await this.userModel.findOne({ number: signInDto.number });

    // const payload = { sub: user._id, username: user.email };
    // const secret = speakeasy.generateSecret({ length: 20 });
    // const token = speakeasy.totp({
    //   secret: secret.base32,
    //   encoding: "base32",
    // });

    // return token;
    // return { access_token: await this.jwtService.sign(payload) };

    return this.otpService.getOTP({ number: signInDto.number });
  }

  async verifyOTP(verifyOtpDto) {
    const user = await this.userModel.findOne({ number: verifyOtpDto.number });
    if (!user) throw new UnauthorizedException("Please Register User");

    return this.otpService.verifyOTP(verifyOtpDto);
  }

  signIn() {
    return "yes";
  }

  async getUser(user) {
    console.log(user, "user");
    const activeUser = await this.userModel.find({ number: user });
    if (!activeUser)
      throw new UnauthorizedException(
        "Sorry,Somthing went wrong. User not found ",
      );

    return activeUser;
  }
}
