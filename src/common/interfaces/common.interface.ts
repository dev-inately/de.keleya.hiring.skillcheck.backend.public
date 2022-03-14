import { User } from "@prisma/client";

export interface DeletedResponse {
  deleted: boolean;
}
export interface AuthenticateJWTResponse {
  token: string;
}
export interface IResponse {
  status: 'success' | 'fail';
  message: string;
  data?: any[] | object;
  error?: any;
}
