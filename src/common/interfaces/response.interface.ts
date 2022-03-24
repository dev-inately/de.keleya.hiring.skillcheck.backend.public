export interface IResponse {
  status: 'success' | 'fail';
  message: string;
  data?: any[] | object;
  error?: any;
}

export interface DeletedResponse {
  deleted: boolean;
}
export interface AuthenticateJWTResponse {
  token: string;
}
