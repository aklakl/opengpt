/* eslint-disable prefer-const */
import { expect } from 'chai';
import * as sinon from 'sinon';
import { v4 as uuidv4 } from 'uuid';
import { Test, TestingModule } from '@nestjs/testing';
import { Logger, LoggerModule } from 'nestjs-pino';
import { loggerParamsFactory } from '../../common/helpers';
import { ConfigurationService } from '../../config/configuration.service';
import { HttpExceptionFilter } from './app.http.exception';
import { AbstractHttpAdapter, HttpAdapterHost } from '@nestjs/core';
import {
  HttpException,
  HttpStatus,
  ArgumentsHost,
  InternalServerErrorException,
} from '@nestjs/common';
import { HttpArgumentsHost } from '@nestjs/common/interfaces';
import { setTimeout } from 'timers/promises';
import { random } from 'lodash';
import moment from 'moment';
import { beforeEach } from 'mocha';

describe('HttpExceptionFilter spec', () => {
  let sandbox: sinon.SinonSandbox;
  let moduleRef: TestingModule;
  let httpExceptionFilter: HttpExceptionFilter;
  let httpAdapterHost; //= sinon.createStubInstance(HttpAdapterHost);
  let configurationService: ConfigurationService;

  beforeEach(async () => {
    sandbox = sinon.createSandbox();
    moduleRef = await Test.createTestingModule({
      imports: [LoggerModule.forRootAsync({ useFactory: loggerParamsFactory })],
      providers: [
        HttpExceptionFilter,
        {
          provide: ConfigurationService,
          useValue: sinon.createStubInstance(ConfigurationService),
        },
        // {
        //   provide: HttpAdapterHost,
        //   useValue: sinon.createStubInstance(HttpAdapterHost),
        // },
        // {
        //   provide: <HttpArgumentsHost>{},
        //   useValue: sinon.createStubInstance(),
        // },
      ],
    }).compile();

    moduleRef.useLogger(moduleRef.get(Logger));
    httpExceptionFilter =
      moduleRef.get<HttpExceptionFilter>(HttpExceptionFilter);
    configurationService = moduleRef.get(ConfigurationService);
    httpAdapterHost = moduleRef.get<HttpAdapterHost>(HttpAdapterHost);
    console.log('======beforeEach Done ======');
  });

  afterEach(() => {
    sandbox.restore();
  });

  it('test HttpExceptionFilter get exception without trace', async () => {
    //prepare the input and mock the behavior
    const exceptionMessage = 'exceptionMessage';

    /*
    const callStub0 = sinon.stub(HttpAdapterHost.prototype, "httpAdapter");
    sinon.assert.calledWithExactly(callStub0, { name: "foobar" });
    console.log('callStub0');
    const callStub = sinon.stub(AbstractHttpAdapter.prototype, "reply");
    sinon.assert.calledWithExactly(callStub, { name: "foobar" });
    //const httpExceptionFilter = moduleRef.get<HttpExceptionFilter>(HttpExceptionFilter);
    */
    /*
    const argumentsHost: ArgumentsHost = sinon.createStubInstance();
    const argumentsHostDependencyStub = <ArgumentsHost>{};  //refer: https://stackoverflow.com/questions/37027776/how-to-stub-a-typescript-interface-type-definition
    const httpArgumentsHostDependencyStub = <HttpArgumentsHost>{};
    //let stub = sinon.stub(argumentsHostDependencyStub, "method");
    //Set stubs for every method used in your code 
    argumentsHostDependencyStub.getType = sinon.stub(); //If not used, you won't need to define it here
    argumentsHostDependencyStub.switchToHttp = sinon.stub().returns(true); //Specific behavior for the test
    */
    const exception = new HttpException(
      exceptionMessage,
      HttpStatus.BAD_REQUEST,
    );

    const httpArgumentsHost: HttpArgumentsHost = {
      getNext: () => undefined,
      getRequest: () => undefined,
      getResponse: (): any => {
        return {
          status: status => {
            return {
              json: () => ({
                success: false,
                status: 'error',
                message: exceptionMessage,
                statusCode: exception.getStatus(),
              }),
            };
          },
        };
      },
    };

    const argumentsHost: ArgumentsHost = {
      getArgByIndex: () => undefined,
      getArgs: () => undefined,
      getType: () => undefined,
      switchToHttp: () => httpArgumentsHost,
      switchToRpc: () => undefined,
      switchToWs: () => undefined,
    };

    //httpAdapterHost.getRequestUrl.returns("http://localhost:3000/");
    //httpAdapterHost.getRequestUrl = sinon.stub().returns({});

    // sinon.replace(
    //   httpExceptionFilter,
    //   'getCampaignsMessageByCampaignId',
    //   sinon.fake.resolves(testCampaignsMessage),
    // );

    // In certain situations `httpAdapter` might not be available in the constructor method, thus we should resolve it here.
    //console.log('====================>' + JSON.stringify(argumentsHost));
    const response = httpExceptionFilter.catch(exception, argumentsHost);
    const responseStr = JSON.stringify(response);
    console.log('======responseStr=>' + responseStr);

    expect(response.statusCode).equals(exception.getStatus());
    expect(response.status).equals('error');
    expect(responseStr).not.contain('stackTrace');
    expect(responseStr).not.contain('requestTrace');
    expect(responseStr).not.contain('responseTrace');
  });

  it('test HttpExceptionFilter with general exception', async () => {
    const httpExceptionFilter = new HttpExceptionFilter(httpAdapterHost);
    const generalExceptionMessage = 'InternalServerErrorExceptionMessage';
    const httpArgumentsHost: HttpArgumentsHost = {
      getNext: () => undefined,
      getRequest: () => undefined,
      getResponse: (): any => {
        return {
          status: status => {
            return {
              json: () => ({ success: false, status }),
            };
          },
        };
      },
    };

    const argumentsHost: ArgumentsHost = {
      getArgByIndex: () => undefined,
      getArgs: () => undefined,
      getType: () => undefined,
      switchToHttp: () => httpArgumentsHost,
      switchToRpc: () => undefined,
      switchToWs: () => undefined,
    };

    const result = httpExceptionFilter.catch(
      new InternalServerErrorException(generalExceptionMessage),
      argumentsHost,
    );
    const responseStr = JSON.stringify(result);

    expect(result.message).to.equal(generalExceptionMessage);
    expect(result.statusCode).to.equal(HttpStatus.INTERNAL_SERVER_ERROR);
    expect(responseStr).not.contain('stackTrace');
    expect(responseStr).not.contain('requestTrace');
    expect(responseStr).not.contain('responseTrace');
  });
});
