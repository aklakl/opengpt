import Ajv from 'ajv';

const ajv = new Ajv({
  allErrors: true,
});
export const schemaValidation = (args: {
  schemaFile: any;
  jsonFile: any;
}): any[] => {
  const { schemaFile, jsonFile } = args;
  const validator = ajv.compile(schemaFile.schema);
  if (validator(jsonFile)) {
    return null;
  }
  return validator.errors;
};
