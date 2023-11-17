import * as uuid from 'uuid';
import * as ulid from 'ulid';
import { CreateUserHandler } from './create-user.handler';
import { UserRepository } from 'src/users/infra/db/repository/user.repository';
import { Test } from '@nestjs/testing';
import { CreateUserCommand } from './create-user.command';
import { UnprocessableEntityException } from '@nestjs/common';
import { UserFactory } from '../../domain/user.factory';

jest.mock('uuid');
jest.mock('ulid');
jest.spyOn(uuid, 'v1').mockReturnValue('0000-0000-0000-0000');
jest.spyOn(ulid, 'ulid').mockReturnValue('ulid');

describe('CreateUserHandler', () => {
  let createUserHandler: CreateUserHandler;
  let userFactory: UserFactory;
  let userRepository: UserRepository;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      providers: [
        CreateUserHandler,
        {
          provide: UserFactory,
          useValue: {
            create: jest.fn(),
          },
        },
        {
          provide: 'UserRepository',
          useValue: {
            save: jest.fn(),
          },
        },
      ],
    }).compile();

    createUserHandler = module.get(CreateUserHandler);
    userFactory = module.get(UserFactory);
    userRepository = module.get('UserRepository');
  });

  const id = ulid.ulid();
  const name = 'name';
  const email = 'email@gmail.com';
  const password = 'password';
  const signupVerifyToken = uuid.v1();

  describe('execute', () => {
    it('should execute CreateUserCommand', async () => {
      // Given
      userRepository.findByEmail = jest.fn().mockResolvedValue(null);

      // When
      await createUserHandler.execute(
        new CreateUserCommand(name, email, password),
      );

      // Then
      // toHaveBeenCalledWith: 함수의 호출과 인수가 정확하게 전달되었는지 검증한다.
      expect(userRepository.save).toHaveBeenCalledWith(
        id,
        name,
        email,
        password,
        signupVerifyToken,
      );
      expect(userFactory.create).toHaveBeenCalledWith(
        id,
        name,
        email,
        password,
        signupVerifyToken,
      );
    });

    it('should throw UnprocesableEntityException when user exists', async () => {
      // Given
      userRepository.findByEmail = jest
        .fn()
        .mockResolvedValue({ id, name, email, password, signupVerifyToken });

      // When

      // Then
      // 원하는 예외가 발생했는지 검증한다.
      await expect(
        createUserHandler.execute(new CreateUserCommand(name, email, password)),
      ).rejects.toThrow(UnprocessableEntityException);
    });
  });
});
