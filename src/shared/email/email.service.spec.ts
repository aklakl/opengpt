import { TestingModule } from '@nestjs/testing';
import { expect } from 'chai';
import * as sinon from 'sinon';
import { ConfigurationService } from '../../config/configuration.service';
import { Email, EmailService } from './email.service';

describe('email service spec', () => {
  let emailService: EmailService;
  let configurationService: sinon.SinonStubbedInstance<ConfigurationService>;
  const sandbox = sinon.createSandbox();

  before(async () => {
    const module: TestingModule = global.moduleFixture;
    emailService = module.get<EmailService>(EmailService);
    configurationService = module.get(ConfigurationService);

    sandbox.stub(configurationService, 'getConfigValue').returns({
      outgoingHost: 'smtp.yandex.com',
      outgoingPort: 465,
      outgoingSecure: true,
      username: 'mingjie.shang@yandex.com',
      password: 'hnkxyovqeyjrgkee',
      nickname: 'mario',
      address: 'mingjie.shang@yandex.com',
    });
    await emailService.onModuleInit();
  });

  after(async () => {
    sandbox.restore();
    await emailService.onModuleInit();
  });

  it('test send email', async () => {
    const email: Email = {
      receivers: ['mingjie.shang@proton.me', 'mingjie.shang@hotmail.com'],
      subject: 'This is a test from opengpt crusade unit test',
      text: 'This is a test from opengpt crusade unit test',
    };
    const previewUrl = await emailService.send(email);
    expect(previewUrl).to.not.undefined;
  });
});
