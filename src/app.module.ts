import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { DeviceModule } from './device/device.module';

@Module({
  imports: [AuthModule, DeviceModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
