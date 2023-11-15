import { Injectable } from '@nestjs/common';
import { IUserRepository } from '../../../domain/repository/iuser.repository';
import { User } from '../../../domain/user';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { UserFactory } from '../../../domain/user.factory';

@Injectable()
export class UserRepository implements IUserRepository {
  constructor(
    private readonly dataSource: DataSource,
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private readonly userFactory: UserFactory,
  ) {}
  async findByEmail(email: string): Promise<User | null> {
    const userEntity = await this.userRepository.findOne({
      where: { email },
    });

    if (!userEntity) {
      return null;
    }

    return this.userFactory.reconstitute(userEntity);
  }

  async save(
    uid: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ): Promise<void> {
    await this.dataSource.transaction(async (manager) => {
      const userEntity = new UserEntity();
      uid = uid;
      name = name;
      email = email;
      password = password;
      signupVerifyToken = signupVerifyToken;

      await manager.save(userEntity);
    });
  }
}
