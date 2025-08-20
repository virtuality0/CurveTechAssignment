import { BadRequestException, Injectable } from '@nestjs/common';
import { DeviceStatus, DeviceType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { JwtPayload } from 'src/types/jwtPayload';
import { RegisterDeviceRequestDto } from './dtos/Request/registerDeviceRequest.dto';
import { UpdateHeartbeatRequestDto } from './dtos/Request/heartbeatRequest.dto';
import { UpdateDeviceRequestDto } from './dtos/Request/updateDeviceRequest.dto';
import { CreateLogRequestDto } from './dtos/Request/createLogRequest.dto';

type deviceFilterType = {
  owner_id: string;
  status?: DeviceStatus;
  type?: DeviceType;
};

@Injectable()
export class DeviceService {
  constructor(private readonly prisma: PrismaService) {}

  async register(
    validatedUser: JwtPayload,
    registerDeviceDto: RegisterDeviceRequestDto,
  ) {
    const device = await this.prisma.device.findFirst({
      where: {
        type: registerDeviceDto.type,
        name: registerDeviceDto.name,
        owner_id: validatedUser.id,
      },
    });

    if (device) {
      throw new BadRequestException('Device already exists.');
    }

    const newDevice = await this.prisma.device.create({
      data: {
        type: registerDeviceDto.type,
        name: registerDeviceDto.name,
        owner_id: validatedUser.id,
        status: registerDeviceDto.status,
      },
    });

    return {
      success: 'true',
      device: {
        id: newDevice.id,
        name: newDevice.name,
        type: newDevice.type,
        status: newDevice.status,
        last_active_at: newDevice.last_active_at,
        ownerId: newDevice.owner_id,
      },
    };
  }

  async updateHeartbeat(
    deviceId: string,
    updateDeviceHeartbeatDto: UpdateHeartbeatRequestDto,
  ) {
    const existingDevice = await this.prisma.device.findFirst({
      where: {
        id: deviceId,
      },
    });

    if (!existingDevice) {
      throw new BadRequestException(`No device with id ${deviceId} exists`);
    }

    const updatedDevice = await this.prisma.device.update({
      where: {
        id: deviceId,
      },
      data: {
        status: updateDeviceHeartbeatDto.status,
        last_active_at: new Date(),
      },
    });

    return {
      success: 'true',
      message: 'Device heartbeat recorded',
      last_active_at: updatedDevice.last_active_at,
    };
  }

  async delete(deviceId: string) {
    const existingDevice = await this.prisma.device.findFirst({
      where: {
        id: deviceId,
      },
    });

    if (!existingDevice) {
      throw new BadRequestException(`No device with id ${deviceId} exists`);
    }

    await this.prisma.device.delete({
      where: {
        id: deviceId,
      },
    });

    return {
      success: 'true',
      message: 'Device deleted successfully.',
    };
  }

  async update(deviceId: string, updateDeviceDto: UpdateDeviceRequestDto) {
    const existingDevice = await this.prisma.device.findFirst({
      where: {
        id: deviceId,
      },
    });

    if (!existingDevice) {
      throw new BadRequestException(`No device with id ${deviceId} exists`);
    }

    await this.prisma.device.update({
      where: {
        id: deviceId,
      },
      data: {
        status: updateDeviceDto.status ?? existingDevice.status,

        type: updateDeviceDto.type ?? existingDevice.type,
        name: updateDeviceDto.name ?? existingDevice.name,
      },
    });

    return {
      success: 'true',
      message: 'Device updated successfully.',
    };
  }

  async getByFilter(
    status: DeviceStatus | undefined,
    type: DeviceType | undefined,
    userId: string,
  ) {
    const filters: deviceFilterType = {
      owner_id: userId,
    };

    if (status) filters.status = status;
    if (type) filters.type = type;

    const devices = await this.prisma.device.findMany({
      where: {
        ...filters,
      },
    });

    return {
      success: 'true',
      devices: devices,
    };
  }

  async createLog(deviceId: string, createLogDto: CreateLogRequestDto) {
    const existingDevice = await this.prisma.device.findFirst({
      where: {
        id: deviceId,
      },
    });

    if (!existingDevice) {
      throw new BadRequestException(`No device with id ${deviceId} exists`);
    }

    await this.prisma.log.create({
      data: {
        event: createLogDto.event,
        value: createLogDto.value,
        deviceId: deviceId,
      },
    });

    return {
      success: 'true',
      message: 'Log created successfully.',
    };
  }

  async getLogsByLimit(deviceId: string, limit?: number) {
    const existingDevice = await this.prisma.device.findFirst({
      where: {
        id: deviceId,
      },
    });

    if (!existingDevice) {
      throw new BadRequestException(`No device with id ${deviceId} exists`);
    }

    const logs = await this.prisma.log.findMany({
      where: {
        deviceId: deviceId,
      },
      orderBy: {
        timestamp: 'desc',
      },
      select: {
        id: true,
        value: true,
        event: true,
        timestamp: true,
      },
      take: limit ?? 10,
    });

    return {
      success: 'true',
      logs: logs,
    };
  }

  async getAggregatedUsage(deviceId: string) {
    const existingDevice = await this.prisma.device.findFirst({
      where: {
        id: deviceId,
      },
    });

    if (!existingDevice) {
      throw new BadRequestException(`No device with id ${deviceId} exists`);
    }
    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    currentTime.setHours(currentHour - 24);

    const logs = await this.prisma.log.findMany({
      where: {
        deviceId: deviceId,
        timestamp: {
          gt: currentTime,
        },
      },
      select: {
        value: true,
      },
    });

    const totalUnits = logs.reduce((acc: number, curr) => {
      return (acc += curr.value ?? 0);
    }, 0.0);

    return {
      success: 'true',
      device_id: deviceId,
      total_units_last_24h: totalUnits,
    };
  }
}
