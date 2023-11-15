// UserModule의 핵심 도메인 객체
export class User {
  constructor(
    private uid: string,
    private name: string,
    private email: string,
    private password: string,
    private signupVerifyToken: string,
  ) {}
}
