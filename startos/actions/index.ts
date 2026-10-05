import { sdk } from '../sdk'
import { createOrResetAccount } from './createOrResetAccount'
import { manageSmtp } from './manageSmtp'
import { setAdminPassword } from './setAdminPassword'
import { setPrimaryUrl } from './setPrimaryUrl'
import { toggleSignups } from './toggleSignups'

export const actions = sdk.Actions.of()
  .addAction(setAdminPassword)
  .addAction(createOrResetAccount)
  .addAction(toggleSignups)
  .addAction(setPrimaryUrl)
  .addAction(manageSmtp)
