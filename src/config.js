import Conf from 'conf';

const config = new Conf({
  projectName: 'obpswiss-cli',
  schema: {
    accessToken: {
      type: 'string',
      default: ''
    },
    consentId: {
      type: 'string',
      default: ''
    }
  }
});

export function getConfig(key) {
  return config.get(key);
}

export function setConfig(key, value) {
  config.set(key, value);
}

export function getAllConfig() {
  return config.store;
}

export function clearConfig() {
  config.clear();
}

export function isConfigured() {
  const accessToken = config.get('accessToken');
  return !!accessToken;
}

export default config;
