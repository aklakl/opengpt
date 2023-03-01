import { createStubInstance, createSandbox, SinonSandbox, spy } from 'sinon';
import * as sinon from 'sinon';
import * as typeorm from 'typeorm';
import assert from 'assert';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger, LoggerModule } from 'nestjs-pino';
import { ConfigService, ConfigModule } from '@nestjs/config';

import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmService } from '../../shared/typeorm/typeorm.service';

import { configurationServiceFactory } from '../../config/configuration.service.factory';
import databricks from '../../config/environmentConfig/databricks.json';
import { config } from '../../config/environmentConfig/default.config';
import deploymentConfig from '../../config/deploymentConfig/config';

import { DaoService } from './dao.service';

import { Repository, IsNull, Not } from 'typeorm';
import { BrazeCustomer } from '../entities/braze.customer.entity';
import { BrazeCustomAttribute } from '../entities/braze.custom.attribute.entity';
import { PartnerConfigurations } from '../entities/partner.configuration.entity';
import { PartnerConfigurationLogo } from '../entities/partner.configuration.logo.entity';
import { Journeys } from '../entities/journeys.entity';
import { Campaigns } from '../entities/campaigns.entity';
import { CampaignsPartner } from '../entities/campaigns.partner.entity';
import { CampaignAudience } from '../entities/campaign.audience.entity';
import { ScheduleTriggerLog } from '../entities/schedule.trigger.log.entity';
import { DatabricksDataService } from '../databricks-data/databricks-data.service';
import * as commonUtils from '../util/commonUtils';
import { CrusadeService } from '../crusade.service';
import { WarmupDaySchedule } from '../entities/warmup.day.schedule.entity';
import { ConfigurationModule } from '../../config/configuration.module';
import { ConfigurationService } from '../../config/configuration.service';
import { loggerParamsFactory } from '../../common/helpers/logger-params-factory';

describe('######### testing DaoService ', async () => {
  let sandbox: SinonSandbox; //const sandbox = sinon.createSandbox();
  let instanceService: DaoService;
  let fakePartnerConfigurationLogoRepo: any; //sinon.SinonStubbedInstance<Repository<PartnerConfigurationLogo>>;
  let typeOrmService: sinon.SinonStubbedInstance<TypeOrmService>;
  const configService: ConfigService = configurationServiceFactory();
  //let crusadeService = sinon.createStubInstance(CrusadeService);
  let moduleRef: TestingModule;

  //================================================== should me make in to a common utils file==================================================

  config.postgresql.migrationsRun = false;
  const testPartnerId = 'testPartnerId';
  const testCampaignIsntId = 'testCampaignIsntId';

  //================================================== should me make in to a common utils file==================================================

  before(async () => {
    moduleRef = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          load: [() => config, deploymentConfig],
        }),
        ConfigurationModule,
        LoggerModule.forRootAsync({
          useFactory: loggerParamsFactory,
        }),
        // TypeOrmModule.forRootAsync({
        //   useFactory: (configService: ConfigurationService) => {
        //     const dbconfig = configService.getTypeOrmConfig();
        //     //console.log('dbconfig=>' + JSON.stringify(dbconfig));
        //     return {
        //       ...dbconfig,
        //       logging: true,
        //     };
        //   },
        //   inject: [ConfigurationService],
        //   useClass: typeOrmService,
        // }),
        // TypeOrmModule.forFeature([
        //   Journeys,
        //   Campaigns,
        //   CampaignsPartner,
        //   BrazeCustomer,
        //   BrazeCustomAttribute,
        //   PartnerConfigurations,
        //   CampaignAudience,
        //   PartnerConfigurationLogo,
        //   ScheduleTriggerLog,
        //   WarmupDaySchedule
        // ]),
        LoggerModule.forRootAsync({
          inject: [ConfigurationService],
          useFactory: loggerParamsFactory,
        }),
      ],
      providers: [
        {
          provide: getRepositoryToken(CampaignsPartner, 'default'),
          useValue: sinon.createStubInstance(Repository),
        },
        {
          provide: getRepositoryToken(Campaigns, 'default'),
          useValue: sinon.createStubInstance(Repository),
        },
        {
          provide: getRepositoryToken(Journeys, 'default'),
          useValue: sinon.createStubInstance(Repository),
        },
        {
          provide: getRepositoryToken(BrazeCustomer, 'default'),
          useValue: sinon.createStubInstance(Repository),
        },
        {
          provide: getRepositoryToken(PartnerConfigurations, 'default'),
          useValue: sinon.createStubInstance(Repository),
        },
        {
          provide: getRepositoryToken(CampaignAudience, 'default'),
          useValue: sinon.createStubInstance(Repository),
        },
        {
          provide: getRepositoryToken(ScheduleTriggerLog, 'default'),
          useValue: sinon.createStubInstance(Repository),
        },
        {
          provide: getRepositoryToken(PartnerConfigurationLogo, 'default'),
          useValue: sinon.createStubInstance(Repository),
        },
        {
          provide: getRepositoryToken(WarmupDaySchedule, 'default'),
          useValue: sinon.createStubInstance(Repository),
        },
        {
          provide: CrusadeService,
          useValue: sinon.createStubInstance(CrusadeService),
        },
        {
          provide: ConfigService,
          useValue: configService,
        },
        {
          provide: DatabricksDataService,
          useValue: sinon.createStubInstance(DatabricksDataService),
        },
        DaoService,
      ],
    }).compile();

    /*
     ,{
          provide: DaoService,
          useValue: sinon.createStubInstance(DaoService),
        }
        */

    instanceService = moduleRef.get<DaoService>(DaoService);
    //fakePartnerConfigurationLogoRepo = moduleRef.get(Repository<PartnerConfigurationLogo>);
    instanceService.onModuleInit();
    //console.log('######### testing DaoService | instanceService =>' + JSON.stringify(instanceService, commonUtils.getCircularReplacer()));
    console.log('testing DaoService done');
  });

  beforeEach(() => {
    sandbox = createSandbox();
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('>>>>>> testing DaoService.getJourneys', async () => {
    // const fake =
    // const fakeRepository = createStubInstance(Repository<Journeys>)
    // const fakeQueryBuilder = createStubInstance(typeorm.SelectQueryBuilder)
    // const fakeConnection = createStubInstance(typeorm.Connection)
    // fakeQueryBuilder.leftJoinAndSelect.withArgs('post.images', 'image').returnsThis()
    // fakeQueryBuilder.orderBy.withArgs({ post: 'ASC', image: 'ASC' }).returnsThis()
    // fakeQueryBuilder.getMany.resolves(['0x0'])
    // const spyOnSave = spy(() => Promise.resolve(post))
    // sandbox.stub(typeorm, 'getRepository').returns({ save: spyOnSave } as any)
    // // @ts-ignore @docs Yeah, it's disaster, but I have already done tests for _findPostById() method (getById())
    // sandbox.stub(postService, '_findPostById').resolves('0x0')
    // const dataToCreate: PostServiceDataToCreate = { ...post, images }
    // const result = await postService.create(dataToCreate)
    // assert.equal(result, '0x0')
    // assert.deepEqual(spyOnSave.callCount, 3)
    // assert.deepEqual(spyOnSave.getCall(0).args, [post])
    // assert.deepEqual(spyOnSave.getCall(1).args, [{ ...images[0], post }])
    // assert.deepEqual(spyOnSave.getCall(2).args, [{ ...images[1], post }])
    // const result = "";
    // assert.equal(result, '0x0')
  });

  it('>>>>>> testing DaoService.getPartnersCustomFooteByPartnerId', async () => {
    //instanceService = createStubInstance(DaoService);
    //const fakePartnerConfigurationLogoRepo = createStubInstance(Repository<PartnerConfigurationLogo>)
    const testPartnerId = 'testPartnerId';

    const spyFindOne = spy(() => Promise.resolve({ test: 'test' }));
    //sandbox.stub(fakePartnerConfigurationLogoRepo, 'findOne').returns({ save: spyFindOne } as any);

    // fakePartnerConfigurationLogoRepo.findOne.withArgs({
    //   where: {
    //     partnerId: testPartnerId
    //   }
    // }).returns({ findOne: spyFindOne } as any);

    const parameters = {
      where: {
        partnerId: testPartnerId,
      },
    };
    //fakePartnerConfigurationLogoRepo.findOne.withArgs(parameters).resolves(['0x0']);

    //fakePartnerConfigurationLogoRepo.expects('findOne').withArgs(parameters).returns(0);
    //fakePartnerConfigurationLogoRepo.expects('findOne').withArgs(parameters).resolves(['0x0']);

    const result = await instanceService.getPartnersCustomFooteByPartnerId(
      testPartnerId,
    );
    console.log(
      'instanceService.getPartnersCustomFooteByPartnerId =>' +
        JSON.stringify(result),
    );
    //assert.equal(result, '0x0');

    console.log(
      'testing DaoService.getPartnersCustomFooteByPartnerId Finished',
    );
  });
});
