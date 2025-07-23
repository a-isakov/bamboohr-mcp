import { envSchema } from './types.js';

const env = envSchema.parse(process.env);

export default {
  server: {
    name: 'bamboohr-mcp-server',
    version: '1.0.0',
  },
  bambooHRApi: {
    subdomain: env.BAMBOOHR_SUBDOMAIN,
    apiKey: env.BAMBOOHR_API_KEY,
    baseUrl: `https://api.bamboohr.com/api/gateway.php/${env.BAMBOOHR_SUBDOMAIN}/v1`,
  },
};
