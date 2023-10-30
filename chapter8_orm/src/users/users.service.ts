import * as uuid from 'uuid';
import { Injectable, UnprocessableEntityException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { EmailService } from 'src/email/email.service';
import { UserLoginDto } from './dto/user-login.dto';
import { UserInfo } from './user-info.interface';
import { UserEntity } from './entities/user.entity';
import { ulid } from 'ulid';

@Injectable()
export class UsersService {
  constructor(
    private readonly emailService: EmailService,
    @InjectRepository(UserEntity)
    private userRepository: Repository<UserEntity>,
    private dataSource: DataSource,
  ) {}

  async create(createUserDto: CreateUserDto) {
    await this.checkUserExists(createUserDto.email);

    const signupVerifyToken = uuid.v1();

    // await this.save(createUserDto, signupVerifyToken);
    // await this.saveUserUsingQueryRunnerTryCatch(createUserDto, signupVerifyToken);
    await this.saveUserUsingQueryRunnerDirect(createUserDto, signupVerifyToken);
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

  private async checkUserExists(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email },
    });

    return user !== undefined;
  }

  // transaction 없이 저장
  private async save(createUserDto: CreateUserDto, signupVerifyToken: string) {
    const userExist = await this.checkUserExists(createUserDto.email);
    if (userExist) {
      throw new UnprocessableEntityException(
        '해당 이메일로는 가입할 수 없습니다.',
      );
    }

    const user = new UserEntity();
    user.uid = ulid();
    user.name = createUserDto.name;
    user.email = createUserDto.email;
    user.password = createUserDto.password;
    user.signupVerifyToken = signupVerifyToken;

    await this.userRepository.save(user);
  }

  private async sendMemberJoinEmail(email: string, signupVerifyToken: string) {
    await this.emailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }

  // QueryRunner를 활용해 Transaction을 제어 - try/catch 구문 활용
  private async saveUserUsingQueryRunnerTryCatch(
    createUserDto: CreateUserDto,
    signupVerifyToken: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const user = new UserEntity();
      user.uid = ulid();
      user.name = createUserDto.name;
      user.email = createUserDto.email;
      user.password = createUserDto.password;
      user.signupVerifyToken = signupVerifyToken;

      await queryRunner.manager.save(user);

      await queryRunner.commitTransaction();
    } catch(e) {
      await queryRunner.rollbackTransaction();
    } finally {
      await queryRunner.release();
    }
  }

  // QueryRunner를 활용해 Transaction을 제어 - transaction을 직접 제어
  private async saveUserUsingQueryRunnerDirect(
    createUserDto: CreateUserDto,
    signupVerifyToken: string,
  ) {
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
