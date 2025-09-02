import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/SignIn.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { AuthGuard } from "./guard/auth.guard";
import { authOTPToken } from "./guard/authOTPToken.guard";
import { VerifyOtpDto } from "./dto/verifyOtpDto.dto";
import { SignUpWithNumberDto } from "./dto/SignUpWithNumber.dto";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  signUp(@Body() signUpdto: SignUpDto) {
    return this.authService.signUp(signUpdto);
  }

  @Post("sign-up-mob")
  SignUpWithPhone(@Body() signUpWithNumberDto: SignUpWithNumberDto) {
    return this.authService.SignUpWithPhone(signUpWithNumberDto);
  }

  @Post("sign-in-OTP")
  signInOTP(@Body() signInDto: SignInDto) {
    // return "ths";
    return this.authService.signInOTP(signInDto);
  }

  @Post("Verify-otp")
  verifyOtp(@Body() verifyOtpDto: VerifyOtpDto) {
    console.log(verifyOtpDto);
    return this.authService.verifyOTP(verifyOtpDto);
  }

  @UseGuards(authOTPToken)
  @Post("signIn")
  signIn() {
    return this.authService.signIn();
  }

  @UseGuards(AuthGuard)
  @Get("currentUser")
  getUser(@Request() req) {
    console.log(req);
    return this.authService.getUser(req.user.sub);
  }
}
