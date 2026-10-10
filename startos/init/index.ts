import { sdk } from '../sdk'
import { dependencies } from '../dependencies'
import { setInterfaces } from '../interfaces'
import { versionGraph } from '../versions'
import { actions } from '../actions'
import { primaryUrl } from '../actions/setPrimaryUrl'
import { restoreInit } from '../backups'
import { i18n } from '../i18n'
import { seedFiles } from './seedFiles'
import { watchAdminPassword } from './watchAdminPassword'

export const init = sdk.setupInit(
  restoreInit,
  versionGraph,
  seedFiles,
  setInterfaces,
  actions,
  dependencies,
  watchAdminPassword,
  primaryUrl.setupTask('important', {
    reason: i18n(
      'Choose the address Penpot uses for downloads and email links.',
    ),
  }),
)

export const uninit = sdk.setupUninit(versionGraph)
