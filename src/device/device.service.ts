import { BadRequestException, Injectable, Patch } from '@nestjs/common';
import { DeviceStatus, DeviceType } from '@prisma/client';
import { PrismaService } from 'src/prisma.service';
import { JwtPayload } from 'src/types/jwtPayload';
import {
  registerDeviceDto,
  updateDeviceDto,
  updateDeviceHeartbeatDto,
} from 'src/zodSchemas/registerDevice';

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
    registerDeviceDto: registerDeviceDto,
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
    updateDeviceHeartbeatDto: updateDeviceHeartbeatDto,
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

  async update(deviceId: string, updateDeviceDto: updateDeviceDto) {
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
}
