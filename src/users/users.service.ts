import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectModel } from "@nestjs/mongoose";
import { UsersModule } from "./users.module";
import { isValidObjectId, Model } from "mongoose";
import { User } from "./schema/user.schema";

@Injectable()
export class UsersService {
  constructor(@InjectModel("user") private readonly userModel: Model<User>) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existUser) throw new BadRequestException("User already exist");
    const user = await this.userModel.create(createUserDto);
    return user;
  }

  async findAll() {
    const user = await this.userModel.find();
    return user;
  }

  async findOne(id: string) {
    const user = await this.userModel.findById(id);
    if (!user) throw new NotFoundException("User not Found");
    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    if (!isValidObjectId(id)) throw new BadRequestException("Id not found");
    const existUser = await this.userModel.findById(id);

    if (!existUser) throw new BadRequestException("User not found");

    const res = await this.userModel.findByIdAndUpdate(id, updateUserDto, {
      new: true,
    });
    return `This action updates a ${res} user`;
  }

  async remove(id) {
    if (!isValidObjectId(id)) throw new BadRequestException("Id not found");
    const res = await this.userModel.findByIdAndDelete(id);
    return `This action removes a ${res} user`;
  }
}
