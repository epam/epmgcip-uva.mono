export enum Gender {
  Men = 'men',
  Women = 'women',
  Any = 'any',
}

export enum Language {
  Russian = 'russian',
  Uzbek = 'uzbek',
  English = 'english',
  Qoraqalpoq = 'qoraqalpoq',
}

export const languages: Language[] = [
  Language.Russian,
  Language.Uzbek,
  Language.English,
  Language.Qoraqalpoq,
];

export const languagesShort: Record<Language, string> = {
  [Language.Russian]: 'Рус',
  [Language.Uzbek]: 'Uzb',
  [Language.English]: 'Eng',
  [Language.Qoraqalpoq]: 'Kaa',
};

export enum ImageType {
  Webp = 'image/webp',
  Jpeg = 'image/jpeg',
  Jpg = 'image/jpg',
  Png = 'image/png',
}

export enum Month {
  January = 'january',
  February = 'february',
  March = 'march',
  April = 'april',
  May = 'may',
  June = 'june',
  July = 'july',
  August = 'august',
  September = 'september',
  October = 'october',
  November = 'november',
  December = 'december',
}
