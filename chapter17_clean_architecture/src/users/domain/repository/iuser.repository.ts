import { User } from '../user';

/**
 * UserRepository는 Infra 레이어에 해당한다.
 * 하지만 이 것은 주로 application 레이어의 핸들러에서 사용된다.
 * 이 아키텍쳐에서 의존성은 infra -> interface -> application -> domain
 * 순서로 가져야 한다.
 * 하지만 위 상황은 application이 infra의 모듈을 가져다 쓰게 되므로
 * 의존성 관계의 방향이 반대로 되어 있다.
 * 이 상황을 바로 잡기 위해 domain 레벨에 이 레포지토리에 대한
 * 인터페이스를 정의하여 의존성 관계의 방향이 application -> domain이 되도록
 * 수정하였다.
 * 현재는 application 레이어의 핸들러에서만 활용하고 있지만
 * 어떤 레이어에서든 데이터를 다룰 일이 발생할 수 있으므로
 * domain 레이어에 인터페이스를 정의한다.
 */

export interface IUserRepository {
  findByEmail: (email: string) => Promise<User | null>;
  save: (
    uid: string,
    name: string,
    email: string,
    password: string,
    signupVerifyToken: string,
  ) => Promise<void>;
}
