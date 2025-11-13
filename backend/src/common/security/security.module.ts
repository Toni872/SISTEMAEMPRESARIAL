import { Module, Global } from '@nestjs/common';
import { SecurityService } from './security.service';

@Global()
@Module({
  providers: [SecurityService],
  exports: [SecurityService],
})
export class SecurityModule {}
