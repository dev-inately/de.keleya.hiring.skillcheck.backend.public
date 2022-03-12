export interface IResponse {
  status: 'success' | 'fail';
  message: string;
  data?: any[] | object;
  error?: any;
}
