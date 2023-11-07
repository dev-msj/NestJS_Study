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
  Inject,
  LoggerService,
  InternalServerErrorException,
  Logger,
  UseFilters,
  BadRequestException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './user-info.interface';
import { UsersService } from './users.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { User } from 'src/custom_decorator/user.decorator';
import { UserData } from 'src/custom_decorator/user-data.decorator';
import { AuthorizedUserDto } from './dto/authorized-user.dto';
import { Roles } from 'src/custom_decorator/roles.decorator';
import { HttpExceptionFilter } from 'src/filter/http-exception.filter';

interface User {
  name: string;
  email: string;
}

// 특정 컨트롤러에 필터를 적용
// @UseFilters(HttpExceptionFilter)
// @Roles('user')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  // 특정 엔드포인트에 필터를 적용
  // @UseFilters(HttpExceptionFilter)
  @Roles('admin')
  @Post()
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<void> {
    this.printLoggerServiceLog(createUserDto);
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

    return this.usersService.getUserInfo(uid);
  }

  @UseGuards(AuthGuard)
  @Get('/decorator/user')
  getUserFromJwt(@User() user: User) {
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

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      this.loggerService.error(`error: ${JSON.stringify(dto)}`, e.stack);
    }

    this.loggerService.warn(`error: ${JSON.stringify(dto)}`);
    this.loggerService.log(`error: ${JSON.stringify(dto)}`);
    this.loggerService.verbose(`error: ${JSON.stringify(dto)}`);
    this.loggerService.debug(`error: ${JSON.stringify(dto)}`);
  }
}
