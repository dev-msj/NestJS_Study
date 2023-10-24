import * as uuid from 'uuid';
import { Inject, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from 'src/email/email.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './user-info.interface';

@Injectable()
export class UsersService {
  @Inject(EmailService) private readonly emailService: EmailService;

  async create(createUserDto: CreateUserDto) {
    await this.checkUserExists(createUserDto.email);

    const signupVerifyToken = uuid.v1();

    await this.save(createUserDto, signupVerifyToken);
    await this.sendMemberJoinEmail(createUserDto.email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    /**
     * 1. DB에서 signupVerifyToken으로 회원가입 처리 중인 유저가 있는지 조회하고 없다면 에러 처리
     * 2. 바로 로그인 상태가 되도록 JWT 발급
     */

    throw new Error('Method not implemented.');
  }

  async login(userLoginDto: UserLoginDto): Promise<string> {
    /**
     * 1. email, password를 가진 유저가 존재하는지 DB에서 확인하고 없다면 에러 처리
     * 2. JWT 발급
     */

    throw new Error('Method not implemented.');
  }

  async getUserInfo(uid: string): Promise<UserInfo> {
    /**
     * 1. uid를 가진 유저가 존재하는지 DB에서 확인하고 없으면 에러
     * 2. 조회된 데이터를 UserInfo 탕비으로 응답
     */

    throw new Error('Method not implemented.');
  }

  private checkUserExists(email: string) {
    // check User Exists from DB
    return false;
  }

  private save(createUserDto: CreateUserDto, signupVerifyToken: string) {
    // save new user info to DB
    return;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
