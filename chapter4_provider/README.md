Provider를 활용하여 서비스를 간단하게 구현하고, 각 Provider 간의 DI를 구현해보자.

> Provider는 비즈니스 로직을 수행하는 역할을 한다. service, repository, factory, helper 등 여러 가지 형태가 존재한다.

## Custom Provider

다음과 같은 상황에 Custom Provider를 사용한다.

1. Nest에게 맡기지 않고 `직접 Instance를 생성`하고 싶은 경우
2. 여러 클래스가 의존 관계에 있을 때, `이미 존재하는 클래스를 재사용`하고자 할 때
3. `테스트를 위해 모의 버전으로 Provider를 재정의`하려는 경우

### Value Provider

useValue 구문을 이용하여 외부 라이브러리에서 provider를 삽입하거나 실제 구현을 모의 객체로 대체할 수 있다.

```typescript
@Module({
  imports: [CatsModule],
  controllers: [AppController],
  providers: [
    {
      provide: CatsService,
      useValue: mockCatsService,
    },
    {
      provide: 'CONNECTION',
      useValue: connection,
    }
  ],
})
export class AppModule {}
```

위 코드는  CatsService를 provider로 지정하지만, 실제 value는 mockCatsService를 사용한다는 뜻이다.
아래 코드는 connection을 'CONNECTION' 문자열을 통해 제공한다는 뜻이다.

* provide: `string | symbol | Type<any> | Abstract<any> | Function` 값을 받을 수 있다.

### Class Provider

useClass 속성을 사용하여 provider로 사용해야 할 instance를 동적으로 구성한다.

```typescript
@Module({
  providers: [
    {
      provide: ConfigService,
      useClass: process.env.NODE_ENV === 'development' 
        ? DevelopmentConfigService 
        : ProductConfigService,
    },
  ],
})
export class AppModule {}
```

### Factory Provider

useFactory 속성을 사용해 provider instance를 동적으로 구성하고자 할 때 사용한다.<br>
주입받을 때는 주입받을 provider를 inject 속성에 선언해준다.

```typescript
@Module({
  controllers: [AppController],
  providers: [
    {
      provide: 'CUSTOM_CONFIG',
      useFactory: (optionsProvider: OptionsProvider) => {
        const options = optionsProvider.get();
        return new CustomConfig(options);
      },
    },
  ],
})
export class AppModule {}
```

```typescript
@Controller()
export class AppController {
  constructor(
    @Inject('CUSTOM_CONFIG') customConfig: CustomConfig,
  ) {}

  ...
}
```

### Export Provider

* 'CONNECTION'을 토큰으로 export

  ```typescript
  @Module({
    providers: [
      {
        provide: 'CONNECTION',
        useFactory: (optionsProvider: OptionsProvider) => {
          const options = optionsProvider.get();
          return new DatabaseConnection(options);
        },
        inject: [OptionsProvider],
      },
    ],
    exports: ['CONNECTION']
  })
  export class AppModule {}
  ```

* connectionFactory 객체를 그대로 export

  ```typescript
  const connectionFactory = {
    provide: 'CONNECTION',
    useFactory: (optionsProvider: OptionsProvider) => {
      const options = optionsProvider.get();
      return new DatabaseConnection(options);
    },
    inject: [OptionsProvider],
  };

  @Module({
    providers: [connectionFactory],
    exports: [connectionFactory]
  })
  export class AppModule {}
  ```