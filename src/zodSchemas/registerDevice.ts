import { DeviceStatus, DeviceType } from '@prisma/client';
import { z } from 'zod';

export const registerDeviceSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: 'Device name should be atleast 1 character long.' })
    .max(100, { message: 'Device should be maximum 100 characters long.' }),

  status: z.enum(DeviceStatus, {
    message: 'Please enter a valid device status',
  }),

  type: z.enum(DeviceType, { message: 'Please enter a valid device type' }),
});
