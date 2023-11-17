/**
 * IUserRepository와 동일하게 의존성의 방향을 잡기 위해
 * 인터페이스를 정의해준다.
 */

export interface IEmailService {
  sendMemberJoinVerification: (
    email: string,
    signupVerifyToken: string,
  ) => Promise<void>;
}
