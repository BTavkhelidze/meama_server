import { IsNotEmpty, IsNumber, IsString } from "class-validator";

export class SignUpDto {
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsNumber()
  @IsNotEmpty()
  number: number;
}
