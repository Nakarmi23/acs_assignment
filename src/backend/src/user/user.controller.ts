import {
  Body,
  ConflictException,
  Controller,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  create(@Body() createUserDto: CreateUserDto) {
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
