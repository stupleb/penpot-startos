import { FileHelper, smtpShape, z } from '@start9labs/start-sdk'
import { sdk } from '../sdk'

const shape = z.object({
  secretKey: z.string().catch(''),
  postgresPassword: z.string().catch(''),
  primaryUrl: z.string().catch(''),
  smtp: smtpShape,
  signups: z.boolean().catch(false),
  adminPassword: z.string().catch(''),
  // Written by the admin-account oneshot; main must not read these reactively.
  adminApplied: z.string().catch(''),
  adminProfileId: z.string().catch(''),
  adminEmail: z.string().catch(''),
})

export const storeJson = FileHelper.json(
  { base: sdk.volumes.startos, subpath: 'store.json' },
  shape,
)
