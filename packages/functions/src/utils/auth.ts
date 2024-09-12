import { createHash, createHmac } from 'crypto';
import { TG_AUTH_BOT_TOKEN } from '../constants/env.js';
import { IAuthPayload } from '../types/auth';

const secret = createHash('sha256').update(TG_AUTH_BOT_TOKEN).digest();

export function checkSignature({ hash, ...data }: IAuthPayload) {
  const checkString = Object.keys(data)
    .sort()
    .filter(k => data[k])
    .map(k => `${k}=${data[k]}`)
    .join('\n');
  const hmac = createHmac('sha256', secret).update(checkString).digest('hex');
  return hmac === hash;
}
