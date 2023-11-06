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
import { SetMetadata } from '@nestjs/common';
import { Roles } from 'src/custom_decorator/roles.decorator';

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
  ) {}

  /**
   * SetMetadata는 메타데이터를 키와 값으로 받아
   * CustomDecorator 타입으로 돌려주는 데코레이터다.
   * 이 것을 통해 클래스나 라우트 핸들러에 필요한 정보를
   * 정의해줄 수 있다.
   * 아래의 경우 라우트 핸들러의 접근권한이 admin이라는 것을
   * SetMetadata를 통해 알려주고 있다.
   * 하지만 이렇게 직접 메타데이터에 대해 정의해주는 것보다
   * 커스텀 데커게이터로 한번 더 감싸서 그 의미를
   * 명확하게 드러내주는 것이 더 좋다.
   */
  // @SetMetadata('roles', ['admin']) // 직접 메타데이터를 정의
  @Roles('admin') // 커스텀 데코레이터로 감싸서 의미를 더 명확하게 드러냄
  @Post()
  async create(
    @Body(ValidationPipe) createUserDto: CreateUserDto,
  ): Promise<void> {
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

  /**
   * AuthGuard에서 생성한 user 객체를 User 데코레이터를 통해 가져온다.
   * 만약 @Req() 데코레이터를 활용해 req.user로 가져온다면
   * req.user가 any 타입을 가지게 되지만
   * 아래와 같이 하게 되면 user가 User라는 타입을 가지게 된다.
   * 이로써 타입 시스템의 장점을 가져갈 수 있다.
   */
  @UseGuards(AuthGuard)
  @Get('/decorator/user')
  getUserFromJwt(@User() user: User) {
    console.log(user);
  }

  // UserData 데코레이터에 User 인터페이스의 필드명을 전달하여 해당 값을 반환
  @UseGuards(AuthGuard)
  @Get('/decorator/userData')
  getUserDataFromJwt(@UserData('name') name: string) {
    console.log(name);
  }

  // validationPipe를 적용하여 User 프로퍼티 값을 검증
  @UseGuards(AuthGuard)
  @Get('/decorator/validate')
  getUserFromJwtWithValidationPipe(
    @User(new ValidationPipe({ validateCustomDecorators: true }))
    user: AuthorizedUserDto,
  ) {
    console.log(user);
  }
}
