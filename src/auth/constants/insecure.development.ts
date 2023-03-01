//For local test case
export const insecureDevelopment = getInsecureDevelopment();

function getInsecureDevelopment() {
  let insecureDevelopment;
  try {
    insecureDevelopment = require('../../../test/test-insecure-development');
  } catch (e) {}
  return insecureDevelopment;
}

console.log(
  'insecureDevelopment = ',
  insecureDevelopment && insecureDevelopment(),
);
