import { expect } from 'chai';
import chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
chai.use(chaiAsPromised);

import { JwtGuard } from './jwt-guard';
import { Test } from '@nestjs/testing';
import { ConfigurationService } from '../../config/configuration.service';
import * as sinon from 'sinon';
import JwtVerifier from '@okta/jwt-verifier';

const sandbox = sinon.createSandbox();

describe('JWT Guard', () => {
  let jwtGuard: JwtGuard;
  let configurationService: sinon.SinonStubbedInstance<ConfigurationService>;

  const deploymentConfigs = {
    oktaSso: {
      authServer: 'https://dev-741674.oktapreview.com/oauth2/default',
      allowedClients: ['0oa15gowr3x9H7qHn0h8'],
    },
  };

  beforeEach(async () => {
    sandbox
      .stub(JwtVerifier.prototype, 'verifyAccessToken')
      .resolves({ ok: true });
    const module = await Test.createTestingModule({
      imports: [],
      providers: [
        JwtGuard,
        {
          provide: ConfigurationService,
          useValue: sinon.createStubInstance(ConfigurationService),
        },
      ],
    }).compile();
    jwtGuard = module.get<JwtGuard>(JwtGuard);
    configurationService = module.get(ConfigurationService);
    configurationService.getDeploymentConfigs.returns(deploymentConfigs);
    await jwtGuard.onModuleInit();
  });

  afterEach(() => {
    sandbox.restore();
  });

  describe('verifyToken', () => {
    it('should verify sso okta domain token', async () => {
      const token =
        'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2Rldi03NDE2NzQub2t0YXByZXZpZXcuY29tL29hdXRoMi9kZWZhdWx0IiwiaWF0IjoxNjM0Mjg2OTE3LCJleHAiOjE2NjU4MjI5MTcsImF1ZCI6Ind3dy5leGFtcGxlLmNvbSIsInN1YiI6Impyb2NrZXRAZXhhbXBsZS5jb20ifQ.bvEOpFeYuWplBoUqnOOlaJhUyWGCOcJCedP-TzZzrmQ';
      const user = await jwtGuard.verifyToken(token);
      expect(user).to.deep.eq({ ok: true });
    });

    it('should reject if issuer is unsupported', async () => {
      await expect(
        jwtGuard.verifyToken(
          'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL2V4YW1wbGUuY29tLyIsImlhdCI6MTYzNDI4OTMwNSwiZXhwIjoxNjY1ODI1MzA1LCJhdWQiOiJ3d3cuZXhhbXBsZS5jb20iLCJzdWIiOiJqcm9ja2V0QGV4YW1wbGUuY29tIn0.-7oNpAycofMZTzas-yzZuUotj46h7byFYmzJ49KSIkg',
        ),
      ).to.be.rejectedWith('Unauthorized');
    });
  });
});
