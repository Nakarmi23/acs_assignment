import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthService {
  constructor(private userService: UserService) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);

    if (user && bcrypt.compareSync(password, user.password)) {
      // extracting password and old password from user object
      const { password, oldPasswords, ...result } = user.toObject();
      return result;
    }

    return null;
  }
}
