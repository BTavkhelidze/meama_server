import { IsNotEmpty, IsNumber } from "class-validator";

export class SignInDto {
  @IsNotEmpty()
  @IsNumber()
  number: number;
}
