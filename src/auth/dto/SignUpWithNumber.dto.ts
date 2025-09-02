import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SignUpWithNumberDto {
  @IsNotEmpty()
  @IsString()
  number: number;

  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsNotEmpty()
  @IsString()
  lastName: string;
}
