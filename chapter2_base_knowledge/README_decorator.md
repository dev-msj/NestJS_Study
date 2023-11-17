## Decorator

> 회단 관심사(cross-cutting concern)를 분리하여 AOP(Aspected-Oriented Programming, 관점 지향 프로그래밍)을 적용한 코드를 작성할 수 있다.
> 
> * `@{expression}` 형식으로 사용

### Decorator의 합성

Decorator의 합성 결과는 수학적으로 `f(g(x))`와 동일하다.

1. 각 decorator의 표현은 위에서 아래로 `평가`된다.
2. 결과는 아래에서 위로 함수로 `호출`된다.

합성 decorator의 동작 순서는 다음과 같다.

1. `f()` decorator에 진입한다.
2. `g(x)` decorator에 진입한다.
3. `g(x)` decorator를 완료한다.
4. `f()` decorator를 완료한다.

### Decorator Type

| Decorator | 역할 | 호출 시 전달되는 인수 | 선언 불가능한 위치 |
| :---: | :---: | :---: | :---: |
| Class Decorator | Class의 정의를 읽거나 수정 | constructor | d.ts 파일, declare class |
| Method Decorator | Method의 정의를 읽거나 수정 | target, propertyKey, propertyDescriptor | d.ts 파일, declare class, overload method |
| Accessor Decorator | Accessor의 정의를 읽거나 수정 | target, propertyKey, propertyDescriptor | d.ts 파일, declare class |
| Property Decorator | Property의 정의를 읽거나 수정 | target, propertyKey | d.ts 파일, declare class |
| Parametor Decorator | Parametor의 정의를 읽거나 수정 | target, propertyKey, parametorIndex | d.ts 파일, declare class |

* target: decorator가 선언된 멤버의 class constructor 또는 instance 멤버에 대한 class의 prototype
* propertyKey: decorator가 선언된 멤버의 이름