export interface IAuthPayload {
  readonly id: string;
  readonly first_name: string;
  readonly last_name: string;
  readonly username: string;
  readonly photo_url: string;
  readonly auth_date: string;
  readonly hash: string;
  [key: string]: string;
}
