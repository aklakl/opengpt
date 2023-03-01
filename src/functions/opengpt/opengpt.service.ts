import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import * as commonUtils from '../util/commonUtils';
import { throwHttpExceptionWithBadRequest } from '../util/exceptionUtils';
const OpenAI = require('openai-api');
const { Configuration, OpenAIApi } = require("openai");



@Injectable()
export class OpengptService implements OnModuleInit {
  private readonly logger = new Logger(OpengptService.name);
  public opengptInstance: any;  // not good for run
  public openai: any;

  constructor(private moduleRef: ModuleRef) { }

  onModuleInit() {
    // this.daoService = this.moduleRef.get(DaoService, { strict: false });
    // this.warmupService = this.moduleRef.get(WarmupService, { strict: false });
    // Load your key from an environment variable or secret management service
    // (do not include your key directly in your code)

    // OpenGPT Key：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
    // OpenGPT Key（sidan’s work email-not working）： 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
    // OpenGPT Key（sidan’s qq email）： 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
    const OPENAI_API_KEY = "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";

    this.opengptInstance = new OpenAI(OPENAI_API_KEY);
    const configuration = new Configuration({
      apiKey: OPENAI_API_KEY,
    });
    this.openai = new OpenAIApi(configuration);

  }

  async test() {
    console.log("test");
  }
  async convertOpenaiResult(teststr: string) {
    var arrayStr = teststr.split("data:");
    let textRes = "";
    for (let i = 0; i < arrayStr.length; i++) {
      //console.log("arrayStr["+i+"]=>"+arrayStr[i]);
      let tmpStr = "";
      if (commonUtils.isJsonString(arrayStr[i])) {
        let curObj = JSON.parse(arrayStr[i]);
        if (curObj.choices !== undefined && curObj.choices[0].text !== undefined) {
          tmpStr = curObj.choices[0].text;
        }
      }
      //console.log("tmpStr["+i+"]=>"+tmpStr);
      textRes = textRes + tmpStr;
    }
    console.log("convertOpenaiResult | arrayStr.length =" + arrayStr.length + " | textRes= " + textRes);
    return textRes;
  }
  async testOpengpt(content: string, engine: string) {
    this.logger.debug('testOpengpt | start | engine=>' + engine + '|content=' + content);
    try {
      /*
      const gptResponse = await this.opengptInstance.complete({
        engine: 'davinci',
        prompt: 'who is the president?',
        maxTokens: 5,
        temperature: 0.9,
        topP: 1,
        presencePenalty: 0,
        frequencyPenalty: 0,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ['\n', "testing"]
      });
  
        const gptResponse = await this.opengptInstance.complete({
        engine: "text-davinci-003",
        prompt: "who is the president in USA",
        temperature: 0,
        maxTokens: 100,
        topP: 1,
        presencePenalty: 0.2,
        frequencyPenalty: 0.0,
        bestOf: 1,
        n: 1,
        stream: false,
        stop: ['\n']
      });
      */
      //refer: https://www.npmjs.com/package/openai
      // const gptResponse = await this.openai.createCompletion({
      //   model: "text-davinci-002",
      //   prompt: "who is the president in USA",
      //   temperature: 0,
      //   max_tokens: 100,
      //   top_p: 1.0,
      //   frequency_penalty: 0.2,
      //   presence_penalty: 0.0,
      //   stop: ["\n"],
      // });
      if (commonUtils.isNullOrUndefined(engine)) {
        engine = "text-davinci-003";  // text-davinci-003
      }
      if (commonUtils.isNullOrUndefined(content)) {
        content = "who is the president in USA";
      }
      this.logger.debug("gptResponse | engine=>" + engine + "|content=" + content);
      const gptResponse = await this.openai.createCompletion({
        model: engine,
        prompt: content,
        echo: true,
        best_of: 1,
        temperature: 0,
        frequency_penalty: 0.2,
        logprobs: 0,
        max_tokens: 2048,
        presence_penalty: 0,
        stream: true
      });
      //max_tokens is 4096，but currently for this version, we can only make maxtoke as 2046, please refer:https://platform.openai.com/docs/api-reference/completions
      let result = gptResponse.data;
      console.log("result=>" + JSON.stringify(result));
      return await this.convertOpenaiResult(result);
    } catch (e) {
      throwHttpExceptionWithBadRequest(e.message);
    }
  }
}
