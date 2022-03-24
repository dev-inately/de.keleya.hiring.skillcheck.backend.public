import { Controller, Get } from '@nestjs/common';
import { EndpointIsPublic } from './common/decorators';

@Controller()
export class AppController {
  @EndpointIsPublic()
  @Get('/api/_health')
  health() {
    return 'OK';
  }
}
