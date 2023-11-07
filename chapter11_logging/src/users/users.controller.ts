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
import {
  WINSTON_MODULE_NEST_PROVIDER,
  WINSTON_MODULE_PROVIDER,
} from 'nest-winston';
import { Logger as WinstonLogger } from 'winston';

interface User {
  name: string;
  email: string;
}

/**
 * Winston Logger를 활용하는 이유
 * - 구성하기 쉬운 로깅 포맷.
 * - 화면에 출력되는 로그를 파일이나 DB에 저장하여 활용.
 *
 * 추가적으로 winston-transport 라이브러리를 활용하면
 * TransportStream을 통해 지속적인 로그 전송이 가능하다.
 */

@Roles('user')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
    // @Inject(WINSTON_MODULE_PROVIDER)
    // private readonly logger: WinstonLogger,
    // @Inject(WINSTON_MODULE_NEST_PROVIDER)
    // private readonly loggerService: LoggerService,
    @Inject(Logger)
    private readonly loggerService: LoggerService,
  ) {}

  @Roles('admin')
  @Post()
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<void> {
    // this.printWinstonLog(createUserDto);
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

  @UseGuards(AuthGuard)
  @Get('/:uid')
  async getUserInfo(
    @Headers() headers: any,
    @Param('uid') uid: string,
  ): Promise<UserInfo> {
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

  // private printWinstonLog(dto) {
  //   // console.log(this.logger.name);

  //   this.logger.error('error: ', dto);
  //   this.logger.warn('warn: ', dto);
  //   this.logger.info('info: ', dto);
  //   this.logger.http('http: ', dto);
  //   this.logger.verbose('verbose: ', dto);
  //   this.logger.debug('debug: ', dto);
  //   this.logger.silly('silly: ', dto);
  // }

  private printLoggerServiceLog(dto) {
    try {
      throw new InternalServerErrorException('test');
    } catch (e) {
      /**
       * loggerService는 winstonLogger와 다르게 인수로 받은 객체를 메세지로 출력하지 않는다.
       * 그래서 객체를 string으로 변환하여 메세지 내에 포함시켜야 한다.
       * 또한 error 함수는 두번째 인수로 받은 객체를 stack 속성을 가진 객체로 출력한다.
       * 그래서 에러 콜 스택을 받아 디버깅 할 수 있다.ㄴ
       */
      this.loggerService.error(`error: ${JSON.stringify(dto)}`, e.stack);
    }

    this.loggerService.warn(`error: ${JSON.stringify(dto)}`);
    this.loggerService.log(`error: ${JSON.stringify(dto)}`);
    this.loggerService.verbose(`error: ${JSON.stringify(dto)}`);
    this.loggerService.debug(`error: ${JSON.stringify(dto)}`);
  }
}
