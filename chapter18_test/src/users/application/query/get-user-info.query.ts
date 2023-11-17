import { IQuery } from '@nestjs/cqrs';

export class GetUserInfoQuery implements IQuery {
  constructor(readonly uid: string) {}

  static from(uid: string) {
    return new GetUserInfoQuery(uid);
  }
}
