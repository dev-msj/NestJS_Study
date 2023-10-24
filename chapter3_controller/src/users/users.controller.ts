import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  HttpCode,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './user-info.interface';

@Controller('users')
export class UsersController {
  // nest에서 Post는 기본적으로 201을 반환한다.
  @Post()
  async create(@Body() createUserDto: CreateUserDto): Promise<void> {
    // Body 데코레이터로 Request Body의 json 값을 객체로 가져올 수 있다.
    console.log(createUserDto);
  }

  // HttpCode 데코레이터를 통해 응답 상태 코드를 변경할 수 있다.
  @HttpCode(200)
  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<string> {
    // Query 데코레이터로 query string 값을 가져올 수 있다.
    console.log(verifyEmailDto);

    return;
  }

  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<string> {
    console.log(userLoginDto);

    return;
  }

  // 경로명 앞에 ':'를 붙여 라우트 매개변수로 지정할 수 있다.
  @Get('/:id')
  async getUserInfo(@Param('id') id: string): Promise<UserInfo> {
    // Param 데코레이터로 라우트 매개변수를 가져올 수 있다.
    console.log(id);

    return;
  }
}
