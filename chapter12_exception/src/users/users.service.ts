import * as uuid from 'uuid';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from 'src/email/email.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './user-info.interface';
import { UserEntity } from './entities/user.entity';
import { ulid } from 'ulid';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    private authService: AuthService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkUserExists(createUserDto.email);

    const signupVerifyToken = uuid.v1();

    await this.save(createUserDto, signupVerifyToken);
    await this.sendMemberJoinEmail(createUserDto.email, signupVerifyToken);
  }

  async verifyEmail(signupVerifyToken: string): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { signupVerifyToken },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      uid: user.uid,
      name: user.name,
      email: user.email,
    });
  }

  async login(userLoginDto: UserLoginDto): Promise<string> {
    const user = await this.userRepository.findOne({
      where: { email: userLoginDto.email, password: userLoginDto.password },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return this.authService.login({
      uid: user.uid,
      name: user.name,
      email: user.email,
    });
  }

  async getUserInfo(uid: string): Promise<UserInfo> {
    const user = await this.userRepository.findOne({
      where: { uid: uid },
    });

    if (!user) {
      throw new NotFoundException('유저가 존재하지 않습니다.');
    }

    return {
      uid: user.uid,
      name: user.name,
      email: user.email,
    };
  }

  private async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    return user !== null;
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  private async save(createUserDto: CreateUserDto, signupVerifyToken: string) {
    await this.dataSource.transaction(async (manager) => {
      const user = new UserEntity();
      user.uid = ulid();
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = createUserDto.password;
      user.signupVerifyToken = signupVerifyToken;

      await manager.save(user);
    });
  }
}
