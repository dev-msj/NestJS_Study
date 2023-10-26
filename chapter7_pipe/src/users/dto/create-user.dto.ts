import { Transform } from 'class-transformer';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';
import { NotIn } from 'src/custom_decorator/not-in.decorator';

export class CreateUserDto {
  // class-validator가 제공하는 Transform 데코레이터를 통해
  // 속성의 값 또는 이 속성을 가진 객체 등을 받아 변형할 수 있다.
  @Transform((params) => params.value.trim())
  // Transform 내에서 예외를 던지지 않고 커스텀 데코레이터를 만들어서 처리하게 할 수 있다.
  @NotIn('password', {
    message: 'password는 name과 같은 문자열을 포함할 수 없습니다.',
  })
  // class-validator를 활용해 데코레이터를 선언하여 유효성 검사가 가능하다
  @IsString()
  @MinLength(2)
  @MaxLength(30)
  readonly name: string;

  @IsString()
  @IsEmail()
  @MaxLength(60)
  readonly email: string;

  // obj는 현재 속성(password)을 가지고 있는 객체(CreateUserDto의 인스턴스)다.
  // @Transform(({ value, obj }) => {
  //   if (obj.password.includes(obj.name.trim())) {
  //     throw new BadRequestException(
  //       'password는 name과 같은 문자열을 포함할 수 없습니다.',
  //     );
  //   }

  //   return value.trim();
  // })
  @IsString()
  @Matches(/^[A-Za-z\d!@#$%^&*()]{8,30}$/)
  readonly password: string;
}
