import { Test, TestingModule } from '@nestjs/testing';
import { ApiVersionController } from './api-version.controller';

describe('ApiVersionController', () => {
  let controller: ApiVersionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApiVersionController],
    }).compile();

    controller = module.get<ApiVersionController>(ApiVersionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
