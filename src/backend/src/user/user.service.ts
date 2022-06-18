import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User, UserDocument } from './schema/user.schema';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  create(createUserDto: CreateUserDto) {
    const createdUser = new this.userModel(createUserDto);

    createdUser.password = bcrypt.hashSync(createdUser.password, 14);

    return createdUser.save();
  }

  findOne(id: number) {
    return this.userModel.findOne({ _id: id });
  }

  findOneByEmail(email: string) {
    return this.userModel.findOne({ email: email.toLowerCase() });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    if (updateUserDto.password) {
      const oldPassword = updateUserDto.password;

      updateUserDto = Object.assign(updateUserDto, {
        password: bcrypt.hashSync(updateUserDto.password, 14),
        $push: { oldPasswords: oldPassword },
      });
    }

    return this.userModel.findByIdAndUpdate(id, updateUserDto, { new: true });
  }
}
