/**
 * 环境动态参数（第二层）- 接口域名/环境开关/Mock开关/小程序AppID
 * 约束：AppID 与真实 Key 不入仓，由 manifest 注入或环境变量读取
 */
export type EnvName = 'development' | 'staging' | 'production';

/** 环境配置映射 */
export const ENV_CONFIG_MAP: Record<EnvName, {
  apiBaseUrl: string;
  useMock: boolean;
  debug: boolean;
  enableTrack: boolean;
}> = {
  development: {
    apiBaseUrl: 'http://localhost:3000',
    useMock: true,
    debug: true,
    enableTrack: false,
  },
  staging: {
    apiBaseUrl: 'https://staging-api.semo.example.com',
    useMock: false,
    debug: false,
    enableTrack: true,
  },
  production: {
    apiBaseUrl: 'https://api.semo.example.com',
    useMock: false,
    debug: false,
    enableTrack: true,
  },
};

/** 当前环境（构建时由 process.env 注入，默认 development） */
export const CURRENT_ENV: EnvName = (process.env.NODE_ENV as EnvName) || 'development';

/** 当前环境配置 */
export const CURRENT_ENV_CONFIG = ENV_CONFIG_MAP[CURRENT_ENV];

/** 小程序 AppID 占位（真实值由 manifest.json 配置或 CI 注入） */
export const MP_APP_ID = 'PLACEHOLDER_MP_APPID';
