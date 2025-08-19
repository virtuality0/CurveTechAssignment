import {
  Controller,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Patch,
  Delete,
  Query,
  Get,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import {
  type updateDeviceDto,
  type updateDeviceHeartbeatDto,
  type registerDeviceDto,
  registerDeviceSchema,
} from 'src/zodSchemas/registerDevice';
import { DeviceService } from './device.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DeviceStatus, DeviceType } from '@prisma/client';

@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  register(
    @Req() req,
    @Body(new ZodValidationPipe(registerDeviceSchema))
    registerDeviceDto: registerDeviceDto,
  ) {
    return this.deviceService.register(req.user, registerDeviceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/heartbeat')
  udpateHeartbeat(
    @Param('id') deviceId: string,
    @Body() updateDeviceHeartbeatDto: updateDeviceHeartbeatDto,
  ) {
    return this.deviceService.updateHeartbeat(
      deviceId,
      updateDeviceHeartbeatDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') deviceId: string) {
    return this.deviceService.delete(deviceId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') deviceId: string,
    @Body() updateDeviceDto: updateDeviceDto,
  ) {
    return this.deviceService.update(deviceId, updateDeviceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  getByFilter(
    @Req() req,
    @Query('status') status?: DeviceStatus,
    @Query('type') type?: DeviceType,
  ) {
    return this.deviceService.getByFilter(status, type, req.user.id);
  }
}
