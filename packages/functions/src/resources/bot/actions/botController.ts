import { Telegraf } from 'telegraf';
import * as functions from 'firebase-functions/v1';

const bot = new Telegraf(functions.config().telegram.bot_token, {
  telegram: { webhookReply: true },
});

const registrationUrl = 'https://core.telegram.org/bots/webapps';

bot.command('register', async ctx => {
  await ctx.reply('Click the button below to register:', {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Register',
            web_app: { url: registrationUrl },
          },
        ],
      ],
    },
  });
});

export default bot;
