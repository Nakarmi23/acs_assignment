export class CreateUserDto {
  name: string;
  email: string;
  password: string;
  termsCondition: boolean;
  captcha: string;
}
