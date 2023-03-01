import { expect } from 'chai';
import deploymentConfigSchema from '../deploymentConfigSchema/schema.json';
import { schemaValidation } from '../../common/helpers/schema-validator-helper';
import configs from './config';

describe('deployment config', function () {
  Object.entries(configs()).forEach(([deployment, jsonFileContents]) => {
    describe(`${deployment} deployment`, function () {
      it('should have valid configuration', function () {
        const result = schemaValidation({
          schemaFile: deploymentConfigSchema,
          jsonFile: jsonFileContents,
        });
        expect(result, JSON.stringify(result, null, 2)).to.be.null;
      });
    });
  });
});
