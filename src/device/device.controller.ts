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
  ParseIntPipe,
} from '@nestjs/common';
import { ZodValidationPipe } from 'src/pipes/validation.pipe';
import { registerDeviceSchema } from 'src/zodSchemas/registerDevice';
import { DeviceService } from './device.service';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { DeviceStatus, DeviceType } from '@prisma/client';
import { createLogSchema } from 'src/zodSchemas/createLog';
import { RegisterDeviceRequestDto } from './dtos/Request/registerDeviceRequest.dto';
import { RegisterDeviceResponseDto } from './dtos/Response/registerDeviceResponse.dto';
import { UpdateHeartbeatRequestDto } from './dtos/Request/heartbeatRequest.dto';
import { HeartbeatResponseDto } from './dtos/Response/heartbeatResponse.dto';
import { DeleteDeviceResponseDto } from './dtos/Response/deleteDeviceResponse.dto';
import { UpdateDeviceRequestDto } from './dtos/Request/updateDeviceRequest.dto';
import { UpdateDeviceResponseDto } from './dtos/Response/updateDeviceResponse.dto';
import { DeviceByFilterResponseDto } from './dtos/Response/devicesByFilterResponse.dto';
import { CreateLogRequestDto } from './dtos/Request/createLogRequest.dto';
import { CreateLogResponseDto } from './dtos/Response/createLogResponse.dto';
import { GetLogByLimitResponseDto } from './dtos/Response/getLogsByLimitResponse.dto';
import { AggregatedUsageResponseDto } from './dtos/Response/getAggregatedUsageResponse.dto';
import { ApiBearerAuth, ApiQuery } from '@nestjs/swagger';
import { float32, number } from 'zod';

@ApiBearerAuth('access-token')
@Controller('devices')
export class DeviceController {
  constructor(private readonly deviceService: DeviceService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  register(
    @Req() req,
    @Body(new ZodValidationPipe(registerDeviceSchema))
    registerDeviceDto: RegisterDeviceRequestDto,
  ): Promise<RegisterDeviceResponseDto> {
    return this.deviceService.register(req.user, registerDeviceDto);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id/heartbeat')
  udpateHeartbeat(
    @Param('id') deviceId: string,
    @Body() updateDeviceHeartbeatDto: UpdateHeartbeatRequestDto,
  ): Promise<HeartbeatResponseDto> {
    return this.deviceService.updateHeartbeat(
      deviceId,
      updateDeviceHeartbeatDto,
    );
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  delete(@Param('id') deviceId: string): Promise<DeleteDeviceResponseDto> {
    return this.deviceService.delete(deviceId);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') deviceId: string,
    @Body() updateDeviceDto: UpdateDeviceRequestDto,
  ): Promise<UpdateDeviceResponseDto> {
    return this.deviceService.update(deviceId, updateDeviceDto);
  }
  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiQuery({ name: 'status', required: false, enum: DeviceStatus })
  @ApiQuery({ name: 'type', required: false, enum: DeviceType })
  getByFilter(
    @Req() req,
    @Query('status') status?: DeviceStatus,
    @Query('type') type?: DeviceType,
  ): Promise<DeviceByFilterResponseDto> {
    return this.deviceService.getByFilter(status, type, req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post(':id/logs')
  log(
    @Param('id') deviceId: string,
    @Body(new ZodValidationPipe(createLogSchema))
    createLogDto: CreateLogRequestDto,
  ): Promise<CreateLogResponseDto> {
    return this.deviceService.createLog(deviceId, createLogDto);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/logs')
  @ApiQuery({ name: 'limit', required: false, type: Number, default: 10 })
  getLogsByLimit(
    @Param('id') deviceId: string,
    @Query('limit', new ParseIntPipe()) limit?: number,
  ): Promise<GetLogByLimitResponseDto> {
    return this.deviceService.getLogsByLimit(deviceId, limit);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id/usage')
  getAggregatedUsage(
    @Param('id') deviceId: string,
  ): Promise<AggregatedUsageResponseDto> {
    return this.deviceService.getAggregatedUsage(deviceId);
  }
}
