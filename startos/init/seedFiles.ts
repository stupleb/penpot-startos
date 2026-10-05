import { utils } from '@start9labs/start-sdk'
import { storeJson } from '../fileModels/store.json'
import { sdk } from '../sdk'
import { getRandomPassword } from '../utils'

export const seedFiles = sdk.setupOnInit(async (effects, kind) => {
  if (kind === 'install') {
    await storeJson.merge(effects, {
      // About 512 bits, as Penpot recommends. Never rotate it: sessions and tokens derive from it.
      secretKey: utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 86 }),
      postgresPassword: getRandomPassword(),
    })
  } else {
    await storeJson.merge(effects, {})
  }
})
