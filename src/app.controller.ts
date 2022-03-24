import { Controller, Get } from '@nestjs/common';
import { EndpointIsPublic } from './common/decorators';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('default')
@Controller()
export class AppController {
  @EndpointIsPublic()
  @ApiOkResponse({ status: 200, description: 'OK',  })
  @Get('/api/_health')
  health() {
    return 'OK';
  }
}
