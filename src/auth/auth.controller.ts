import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { SignInDto } from "./dto/SignIn.dto";
import { SignUpDto } from "./dto/sign-up.dto";
import { AuthGuard } from "./guard/auth.guard";
import { authOTPToken } from "./guard/authOTPToken.guard";

@Controller("auth")
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post("sign-up")
  signUp(@Body() signUpdto: SignUpDto) {
    return this.authService.signUp(signUpdto);
  }

  @Post("sign-in-OTP")
  signInOTP(@Body() signInDto: SignInDto) {
    // return "ths";
    return this.authService.signInOTP(signInDto);
  }

  @Post("Verify-otp")
  verifyOtp(@Body() token: number) {
    return this.authService.verifyOTP(token);
  }

  @UseGuards(authOTPToken)
  @Post("signIn")
  signIn() {
    return this.authService.signIn();
  }

  @UseGuards(AuthGuard)
  @Get("profile")
  getUser(@Request() req) {
    return this.authService.getUser(req.user.sub);
  }
}
