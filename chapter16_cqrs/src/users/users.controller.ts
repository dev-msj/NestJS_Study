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
import { CreateUserCommand } from './command/create-user.command';
import { GetUserInfoQuery } from './query/get-user-info.query';
import { VerifyEmailCommand } from './command/verify-email.command';
import { UserLoginCommand } from './command/user-login.command';

/**
 * CQRS(Command Query Responsibility Separation)
 *
 * 명령(command)와 조회(query)를 분리하여
 * 성능과 확장성 및 보안성을 높일 수 있도록 해주는
 * 아키텍쳐 패턴이다.
 * 이를 통해 명령과 조회를 각각 독립적으로 확장할 수 있다.
 *
 * - query: Read
 * - command: Create, Update, Delete
 *
 * 서비스가 커질수록 변경에 대한 영향도는 점차 커지게 되고,
 * 각각의 레이어가 주고 받는 데이터가 복잡해진다.
 * 결과적으로 컨텍스트가 상이한 곳에서도 동일한 모델을
 * 그대로 전달하고 사용하는 경우가 발생하게 될 것이다.
 * 그래서 CQRS에서는 DDD에서 말하는 Bounded Context 내에서만
 * 모델을 공유할 것을 권장한다.
 * 하지만 이는 복잡성이 추가되어 생산성이 감소하므로,
 * 모델을 공유하는 것이 도메인을 다루기 더 쉬운지
 * 면밀히 판단할 필요가 있다.
 */

@Controller('users')
export class UsersController {
  // controller는 UsersService에 직접 의존하지 않는다.
  constructor(
    @Inject(Logger)
    private readonly loggerService: LoggerService,
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  @Roles('admin')
  @Post()
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<void> {
    // this.printLoggerServiceLog(createUserDto);

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
