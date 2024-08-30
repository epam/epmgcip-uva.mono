import { TG_PUBLISH_BOT_TOKEN } from '../constants/env.js';
import { TELEGRAM_API, TelegramBotCommands } from '../constants/telegram.js';

export const getHeaders = () => ({
  'Content-Type': 'application/json',
});

export const getTgCommandUrl = (command: TelegramBotCommands): string => `${TELEGRAM_API}${TG_PUBLISH_BOT_TOKEN}/${command}`;
