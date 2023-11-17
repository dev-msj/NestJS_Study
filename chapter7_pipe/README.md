pipe를 활용하여 컨트롤러의 라우트 핸들러에 들어오는 인수의 유효성을 검사해보자.

> Pipe는 요청이 라우터 핸들러로 전달되기 전에 요청 객체를 검사하고 변환하는 역할 수행한다.

* 변환: 입력 데이터를 원하는 형식으로 변환
* 유효성 검사: 사용자가 정한 기준에 부합하지 않은 경우 예외 처리

`@nest/common` 패키지는 다음과 같은 내장 Pipe를 제공한다.

* ValidationPipe
* ParseIntPipe
* ParseBoolPip
* ParseArrayPipe
* ParseUUIDPipe
* DefaultValuePipe

### Pipe의 내부 구현

다음은 Pipe의 원형인 PipeTransform의 interface다.

```typescript
export interface PipeTransform<T = any, R = any> {
  transform(value: T, metadataL ArgumentMetadata): R;
}
```

* value: 현재 pipe에 전달된 이수
* metadata: 현재 pipe에 전달된 인수의 metadata

그리고 ArgumentMetaData는 다음과 같은 정보를 가진다.

* type: pipe에 전달된 인수의 종류를 나타낸다. `'body' | 'query' | 'param' | 'custom'`
* metatype: 라우트 핸들러에 정의된 인수의 타입을 알려준다.
* data: decorator에 전달된 매개변수의 이름을 알려준다.