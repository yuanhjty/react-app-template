import { localCache, registerLocalCacheKey } from 'utils/cacheUtil';

const DEVELOPMENT = 'development';
const PRODUCTION = 'production';

const apiServers = {
  [DEVELOPMENT]: 'scheme://host1:port1',
  [PRODUCTION]: 'scheme://host2:port2',
};

const { NODE_ENV } = process;

const envCacheKey = registerLocalCacheKey('env');

export const API_ROOT = (function getApiRoot(env) {
  const targetEnv = env === PRODUCTION ? env : localCache.getItem(envCacheKey) || env;
  return apiServers[targetEnv] || apiServers[PRODUCTION];
})(NODE_ENV);

export const IS_PRODUCTION = NODE_ENV === PRODUCTION;
