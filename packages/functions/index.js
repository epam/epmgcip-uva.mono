const axios = require('axios');
const admin = require('firebase-admin');
const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const translation = require('../frontend/src/translations/Russian.json')

admin.initializeApp();

const getFormatDate = date => {
  if (typeof date === 'string') {
    const formatedDate = new Date(date);
    return `${String(formatedDate.getDate()).padStart(2, '0')}-${String(
      formatedDate.getMonth() + 1
    ).padStart(2, '0')}-${formatedDate.getFullYear()}`;
  }
  let day = '' + date.getDate();
  let month = '' + (date.getMonth() + 1);
  const year = date.getFullYear();

  if (day.length < 2) {
    day = '0' + day;
  }

  if (month.length < 2) {
    month = '0' + month;
  }

  return [year, month, day].join('-');
};

const createMessage = (eventData, description, title, eventPlace, languageKeys) => {
  return `
    <b>${eventData.status === 'active' ? `${translation.openedRecruitment}` : `${translation.closeRecruitment}`}</b>

    <b>${title}</b>

    📍 ${eventPlace}
    📆 ${getFormatDate(eventData.startDate)} - ${getFormatDate(eventData.endDate)}
    🕒 ${eventData.startTime} - ${eventData.endTime}
    ${translation.eventHours}: ${eventData.duration}

    ${translation.gender}
    🚻 ${eventData.gender}

    ${translation.age}
    🔢 ${eventData.ageMin} - ${eventData.ageMax}

    ${translation.languages}
    🔠 ${languageKeys}

    ${translation.people}
    🙌 ${eventData.volunteersQuantity}

    ${description}

    Telegram | Instagram | Facebook | web
    `;
};

const formatLanguageSpecificData = languageSpecificData => {
  const description = Object.entries(languageSpecificData)
    .map(([language, data]) => `${data.description}`)
    .join(' / ');
  const title = Object.entries(languageSpecificData)
    .map(([language, data]) => `${data.name}`)
    .join(' / ');
  const eventPlace = Object.entries(languageSpecificData)
    .map(([language, data]) => `${data.place}`)
    .join(' / ');
  const languageKeys = Object.keys(languageSpecificData).join(', ');
  return {
    description: description,
    title: title,
    eventPlace: eventPlace,
    languageKeys: languageKeys,
  };
};

const sendToChannel = async eventData => {
    if (!eventData) {
        console.log('No event data found');
        return;
    } else {
    const formattedLanguageData = formatLanguageSpecificData(eventData.languageSpecificData.data);
    const message = createMessage(
      eventData,
      formattedLanguageData.description,
      formattedLanguageData.title,
      formattedLanguageData.eventPlace,
      formattedLanguageData.languageKeys
    );
    try {
      const response = await axios.post(
        `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendPhoto`,
        {
          chat_id: process.env.TELEGRAM_CHANNEL_ID,
          caption: message,
          photo: eventData.imageUrl,
          parse_mode: 'HTML',
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.data.ok) {
        throw new Error(response.data.description || 'Failed to send message');
      }

      await admin.firestore().collection('events').doc(eventData.id).update({
        telegramMessageId: response.data.result.message_id,
      });

      console.log('Event published to Telegram:', response.data);
    } catch (error) {
      console.error('Error sending message to Telegram:', error);
    }
  }
};

const updatePublishedEvent = async(eventData) => {
    const formattedLangData = formatLanguageSpecificData(eventData.languageSpecificData.data)
    const msg = createMessage(eventData, formattedLangData.description, formattedLangData.title, formattedLangData.eventPlace, formattedLangData.languageKeys)

    try {
        const response = await axios.post(
          `https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/editMessageCaption`,
          {
            chat_id: process.env.TELEGRAM_CHANNEL_ID,
            message_id: eventData.telegramMessageId,
            caption: msg,
            parse_mode: 'HTML',
          },
          {
            headers: {
              'Content-Type': 'application/json',
            },
          }
        );
    
        if (!response.data.ok) {
          throw new Error(response.data.description || 'Failed to update message');
        }
    
        console.log('Event updated on Telegram:', response.data);
      } catch (error) {
        console.error('Error updating message on Telegram:', error);
      }
}

const publishToTelegram = onDocumentCreated('events/{eventId}', event => {
  const snapshot = event.data;
  if (!snapshot) {
    console.log('No data associated with the event');
    return;
  }
  const data = snapshot.data();
  sendToChannel(data);
});

const updatePublishedEventTrigger = onDocumentUpdated('events/{eventId}', event => {
    const beforeData = event.data.before.data();
    const afterData = event.data.after.data();
  
    // Check if there are any significant changes
    if (JSON.stringify(beforeData) !== JSON.stringify(afterData)) {
      updatePublishedEvent(afterData);
    }
  });

module.exports = { publishToTelegram, updatePublishedEventTrigger };
