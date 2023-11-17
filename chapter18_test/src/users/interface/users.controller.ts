import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Headers,
  UseGuards,
  ValidationPipe,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './user-info.interface';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/custom_decorator/user.decorator';
import { UserData } from 'src/custom_decorator/user-data.decorator';
import { AuthorizedUserDto } from './dto/authorized-user.dto';
import { Roles } from 'src/custom_decorator/roles.decorator';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { CreateUserCommand } from '../application/command/create-user.command';
import { GetUserInfoQuery } from '../application/query/get-user-info.query';
import { VerifyEmailCommand } from '../application/command/verify-email.command';
import { UserLoginCommand } from '../application/command/user-login.command';

@Controller('users')
export class UsersController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles('admin')
  @Post()
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<void> {
    return this.commandBus.execute(CreateUserCommand.from(createUserDto));
  }

  @Post('/email-verify')
  async verifyEmail(@Query() verifyEmailDto: VerifyEmailDto): Promise<string> {
    const { signupVerifyToken } = verifyEmailDto;

    return this.commandBus.execute(VerifyEmailCommand.from(signupVerifyToken));
  }

  @Post('/login')
  async login(@Body() userLoginDto: UserLoginDto): Promise<string> {
    return this.commandBus.execute(UserLoginCommand.from(userLoginDto));
  }

  @Get()
  getUser() {
    return 'This action is returns all users';
  }

  // @UseGuards(AuthGuard)
  @Get('/:uid')
  async getUserInfo(
    @Headers() headers: any,
    @Param('uid') uid: string,
  ): Promise<UserInfo> {
    if (uid === '0') {
      throw new BadRequestException('0은 적절한 인수가 아닙니다.');
    }

    return this.queryBus.execute(GetUserInfoQuery.from(uid));
  }

  @UseGuards(AuthGuard)
  @Get('/decorator/user')
  getUserFromJwt(@User() user: UserInfo) {
    console.log(user);
  }

  @UseGuards(AuthGuard)
  @Get('/decorator/userData')
  getUserDataFromJwt(@UserData('name') name: string) {
    console.log(name);
  }
  @UseGuards(AuthGuard)
  @Get('/decorator/validate')
  getUserFromJwtWithValidationPipe(
    @User(new ValidationPipe({ validateCustomDecorators: true }))
    user: AuthorizedUserDto,
  ) {
    console.log(user);
  }
}
