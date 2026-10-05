import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import {
  activeEmailById,
  adminDefaultEmail,
  getRandomPassword,
  isUuid,
} from '../utils'

export const setAdminPassword = sdk.Action.withoutInput(
  'set-admin-password',

  async ({ effects }) => ({
    name: i18n('Set Admin Password'),
    description: i18n(
      'Generate a new random password for the Penpot administrator account, creating the account the first time. Penpot applies it when it starts; a running Penpot restarts to apply it.',
    ),
    warning: (await storeJson.read((s) => s.adminPassword).const(effects))
      ? i18n('Replaces the current administrator password.')
      : null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  async ({ effects }) => {
    const { adminProfileId = '', adminEmail = '' } =
      (await storeJson.read().once()) ?? {}
    // Read before the store write below restarts Penpot; null while it is stopped.
    const currentEmail = isUuid(adminProfileId)
      ? await sdk.SubContainer.withTemp(
          effects,
          { imageId: 'postgres' },
          null,
          'admin-email',
          (sub) => activeEmailById(sub, adminProfileId).catch(() => null),
        )
      : null

    const adminPassword = getRandomPassword()
    await storeJson.merge(effects, { adminPassword })

    return {
      version: '1',
      title: i18n('Penpot Administrator'),
      message: i18n(
        'Sign in to Penpot with these credentials once it has started.',
      ),
      result: {
        type: 'group',
        value: [
          {
            type: 'single',
            name: i18n('Email'),
            description: null,
            value: currentEmail || adminEmail || adminDefaultEmail,
            masked: false,
            copyable: true,
            qr: false,
          },
          {
            type: 'single',
            name: i18n('Password'),
            description: null,
            value: adminPassword,
            masked: true,
            copyable: true,
            qr: false,
          },
        ],
      },
    }
  },
)
