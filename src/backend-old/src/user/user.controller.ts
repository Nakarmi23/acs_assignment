import {
  Body,
  ConflictException,
  Controller,
  Param,
  Patch,
  Post,
  UnprocessableEntityException,
} from '@nestjs/common';
import axios from 'axios';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const reCaptchaRes = await axios.post(
      `https://www.google.com/recaptcha/api/siteverify?secret=6LdIJocgAAAAAPWNShL8hrq9noGqrwK2oy3j_1ev&response=${createUserDto.captcha}`,
      {},
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    if (reCaptchaRes.data.success !== true) {
      throw new UnprocessableEntityException(
        'Captcha is either expired, duplicate or invalid',
      );
    }

    return this.userService.create(createUserDto).catch((err) => {
      if (err.code === 11000) {
        throw new ConflictException({
          code: 11000,
          message: 'User already exists',
          dublicateKeys: Object.keys(err.keyPattern),
        });
      }
      throw err;
    });
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(+id, updateUserDto).catch((err) => {
      if (err.code === 11000) {
        throw new ConflictException({
          code: 11000,
          message: 'User already exists',
          dublicateKeys: Object.keys(err.keyPattern),
        });
      }
      throw err;
    });
  }
}
