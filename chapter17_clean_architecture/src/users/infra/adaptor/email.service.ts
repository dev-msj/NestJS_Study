import { Injectable } from '@nestjs/common';
import { IEmailService } from '../../application/adaptor/iemail.service';
import { EmailService as ExternalEmailService } from 'src/email/email.service';

/**
 * 유저 모듈의 외부에 존재하는 이메일 서비스와 연동하기 때문에
 * Infra 레이어에서 이에 대한 구현체를 가진다.
 */

@Injectable()
export class EmailService implements IEmailService {
  constructor(private readonly externalEmailService: ExternalEmailService) {}

  async sendMemberJoinVerification(
    email: string,
    signupVerifyToken: string,
  ): Promise<void> {
    this.externalEmailService.sendMemberJoinVerification(
      email,
      signupVerifyToken,
    );
  }
}
