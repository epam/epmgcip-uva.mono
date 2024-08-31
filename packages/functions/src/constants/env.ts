export const TG_PUBLISH_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN ?? '';
export const TG_CHANNEL_ID = process.env.TELEGRAM_CHANNEL_ID ?? '';
export const TG_AUTH_BOT_TOKEN = process.env.AUTH_BOT_TOKEN ?? 'not-set';

export const AUTH_SPECIAL_USER_USERNAMES = process.env.AUTH_SPECIAL_USER_USERNAMES?.split(',') ?? [];

// export const FIREBASE_SECRET = process.env.FIREBASE_SECRET ? JSON.parse(process.env.FIREBASE_SECRET) : {};

export const DEV_MODE = process.env.DEV_MODE === 'true';
