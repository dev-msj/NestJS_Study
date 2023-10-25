import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Inject,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './user-info.interface';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    await this.usersService.create(createUserDto);
  }

  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = verifyEmailDto;

    return await this.usersService.verifyEmail(signupVerifyToken);
  }

  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<string> {
    return this.usersService.login(userLoginDto);
  }

  @Get('/:uid')
  async getUserInfo(@Param('uid') uid: string): Promise<UserInfo> {
    return this.usersService.getUserInfo(uid);
  }
}
