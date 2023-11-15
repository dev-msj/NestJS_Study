import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { GetUserInfoQuery } from './get-user-info.query';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { UserInfo } from '../user-info.interface';

@QueryHandler(GetUserInfoQuery)
export class GetUserInfoQueryHandler
  implements IQueryHandler<GetUserInfoQuery>
{
  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
  ) {}

  async execute(query: GetUserInfoQuery): Promise<UserInfo> {
    const user = await this.userRepository.findOne({
      where: { uid: query.uid },
    });

    if (!user) {
      throw new NotFoundException('User does not exist!');
    }

    return user.toUserInfo();
  }
}
