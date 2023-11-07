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
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

interface User {
  name: string;
  email: string;
}

@Roles('user')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private authService: AuthService,
    @Inject(WINSTON_MODULE_PROVIDER)
    private readonly logger: Logger,
  ) {}

  @Roles('admin')
  @Post()
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<void> {
    this.printWinstonLog(createUserDto);
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

  private printWinstonLog(dto) {
    // console.log(this.logger.name);

    this.logger.error('error: ', dto);
    this.logger.warn('warn: ', dto);
    this.logger.info('info: ', dto);
    this.logger.http('http: ', dto);
    this.logger.verbose('verbose: ', dto);
    this.logger.debug('debug: ', dto);
    this.logger.silly('silly: ', dto);
  }
}
