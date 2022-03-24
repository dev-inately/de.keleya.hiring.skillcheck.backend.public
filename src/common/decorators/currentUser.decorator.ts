import { SetMetadata } from '@nestjs/common';

export const IS_CURENT_USER = 'currentUser';

export const CurrentUser = () => SetMetadata(IS_CURENT_USER, true);
