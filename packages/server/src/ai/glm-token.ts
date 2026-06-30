/**
 * 智谱 GLM 鉴权令牌生成
 * 约束：API Key 拆 id.key 两段，key 作为 HS256 密钥；exp 用秒，timestamp 用毫秒
 *       Key 仅从 env 读取，禁止硬编码
 */
import jwt, { JwtHeader } from 'jsonwebtoken';
import { GLM_CONFIG } from '../config/constants';

/**
 * 生成智谱 GLM 调用所需的 JWT
 * @param apiKey 智谱 API Key，格式 `id.key`
 * @returns Bearer 令牌字符串
 */
export function generateGlmToken(apiKey: string): string {
  const [id, key] = apiKey.split('.');
  if (!id || !key) {
    throw new Error('GLM_API_KEY 格式非法（期望 `id.key`）');
  }
  const nowMs = Date.now();
  const payload = {
    api_key: id,
    exp: Math.floor(nowMs / 1000) + GLM_CONFIG.tokenExpSeconds,
    timestamp: nowMs,
  };
  // GLM 要求 header 携带 sign_type: 'SIGN'（jsonwebtoken 类型未声明该字段，运行时会保留）
  const header = { alg: 'HS256', sign_type: 'SIGN' } as unknown as JwtHeader;
  const token = jwt.sign(payload, key, {
    algorithm: 'HS256',
    header,
  });
  return token;
}
