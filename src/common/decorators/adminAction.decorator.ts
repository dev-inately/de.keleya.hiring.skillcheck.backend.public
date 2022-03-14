import { SetMetadata } from '@nestjs/common';

export const IS_ADMIN_ACTION = 'isAdmin';

export const adminAction = () => SetMetadata(IS_ADMIN_ACTION, true);
