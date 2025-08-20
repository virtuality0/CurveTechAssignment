import { EventType } from '@prisma/client';
import { z } from 'zod';

export const createLogSchema = z.object({
  event: z.enum(EventType, { message: 'Please provide valid event type.' }),

  value: z.float32().min(0.1, { message: 'Value should not be negative.' }),
});
