import {
  ValidationOptions,
  registerDecorator,
  ValidationArguments,
} from 'class-validator';

// 데코레이터를 통해 전달받은 속성의 이름과 validationOptions.
export function NotIn(property: string, validationOptions?: ValidationOptions) {
  return (object: object, propertyName: string) => {
    // registerDecorator가 데코레이터가 선언될 객체와 해당 객체의 속성 이름을 받음.
    registerDecorator({
      name: 'NotIn',
      // 객체가 생성될 때 적용함.
      target: object.constructor,
      // 객체에 정의된 속성들의 이름.
      propertyName,
      // 유효성 옵션은 데코레이터의 인수로 받은 것을 사용.
      options: validationOptions,
      // 데코레이터를 통해 전달받은 속성에만 적용되도록 제약.
      constraints: [property],
      // 유효성 검사의 규칙 정의.
      validator: {
        // value는 데코레이터가 선언된 속성의 값, args는 바로 위에서 정의한 옵션들
        validate(value: any, args: ValidationArguments) {
          // 데코레이터를 통해 전달받은 속성의 이름
          const [relatedPropertyName] = args.constraints;
          // 데코레이터를 통해 전달받은 속성의 이름으로 객체에서 값을 가져옴.
          const relatedValue = (args.object as any)[relatedPropertyName];

          return (
            // 데코레이터가 선언된 속성의 값이 string이어야 한다.
            typeof value === 'string' &&
            // 데코레이터를 통해 전달받은 속성의 값이 string이어야 한다.
            typeof relatedValue === 'string' &&
            // 데코레이터를 통해 전달받은 속성의 값에 데코레이터가 선언된 속성의 값이 포함되면 안된다.
            !relatedValue.includes(value)
          );
        },
      },
    });
  };
}
