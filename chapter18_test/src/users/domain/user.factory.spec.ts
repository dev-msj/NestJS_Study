import { Test } from '@nestjs/testing';
import { UserFactory } from './user.factory';
import { EventBus } from '@nestjs/cqrs';
import { User } from './user';
import { UserEntity } from '../infra/db/entities/user.entity';

describe('UserFactory', () => {
  let userFactory: UserFactory;
  let eventBus: jest.Mocked<EventBus>;

  beforeAll(async () => {
    // Test용 Module 객체 생성
    const module = await Test.createTestingModule({
      providers: [
        UserFactory,
        {
          provide: EventBus,
          useValue: {
            // 어떠한 동작도 하지 않는 껍데기 함수를 의미
            publish: jest.fn(),
          },
        },
      ],
    }).compile();

    userFactory = module.get(UserFactory);
    eventBus = module.get(EventBus);
  });

  describe('create', () => {
    it('should create user', () => {
      // Given
      // When
      const user = userFactory.create(
        'uid',
        'name',
        'email@gmail.com',
        'password',
        'signupVerifyToken',
      );

      // Then
      const expected = new User(
        'uid',
        'name',
        'email@gmail.com',
        'password',
        'signupVerifyToken',
      );
      expect(expected).toEqual(user);

      // toHaveBeenCalledTimes: eventBus의 publish 함수가 호출되었는지 검증한다.
      expect(eventBus.publish).toHaveBeenCalledTimes(1);
    });
  });

  describe('reconstitute', () => {
    it('should reconstitute user', () => {
      // Given
      const userEntity = new UserEntity();
      userEntity.uid = 'uid';
      userEntity.name = 'name';
      userEntity.email = 'email@gmail.com';
      userEntity.signupVerifyToken = 'signupVerifyToken';
      userEntity.password = 'password';

      // When
      const user = userFactory.reconstitute(userEntity);

      // Then
      const expected = new User(
        'uid',
        'name',
        'email@gmail.com',
        'password',
        'signupVerifyToken',
      );
      expect(expected).toEqual(user);
    });
  });
});
