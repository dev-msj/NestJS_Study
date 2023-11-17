interceptor에 대해 알아보자

> interceptor는 요청과 응답을 가로채서 변형을 가할 수 있는 컴포넌트다.

interceptor는 guard와 같이 ExcutionContext에 접근할 수 있다는 점에서 middleware와 다르다.<br>
또한 응답을 가로채서 변형할 할 수 있다는 점에서 guard와 다르다.

interceptor는 다음과 같은 기능을 수행한다.

* 메서드 실행 전/후 추가적으로 로직을 바인딩
* 함수에서 반환된 결과를 변환
* 함수에서 발생된 예외를 변환 -> filter에서 다루는 것을 권장
* 기본 기능의 동작을 확장
* 특정 조건에 따라 기능을 재정의(ex: 캐싱)