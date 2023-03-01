import usw2MochaConfig from './usw2/mocha/conf.json';
import usw2DevConfig from './usw2/dev/conf.json';
import usw2StgConfig from './usw2/stg/conf.json';
import usw2ProdConfig from './usw2/prod/conf.json';
import euc1ProdConfig from './euc1/prod/conf.json';

export default () => ({
  'usw2/mocha': usw2MochaConfig,
  'usw2/dev': usw2DevConfig,
  'usw2/stg': usw2StgConfig,
  'usw2/prod': usw2ProdConfig,
  'euc1/prod': euc1ProdConfig,
});
