import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'

export const toggleSignups = sdk.Action.withoutInput(
  'toggle-signups',

  async ({ effects }) => {
    const enabled = await storeJson.read((s) => s.signups).const(effects)

    return {
      name: enabled ? i18n('Disable Signups') : i18n('Enable Signups'),
      description: enabled
        ? i18n(
            'Signups are enabled: anyone who can reach Penpot can create an account. Run this action to stop new signups; existing accounts keep working. Penpot restarts to apply it.',
          )
        : i18n(
            'Signups are disabled: new accounts are made with Create or Reset Account. Run this action to let people sign up from the Penpot login page. Penpot restarts to apply it.',
          ),
      warning: enabled
        ? null
        : i18n(
            'Anyone who can reach your Penpot address will be able to create an account until you disable signups again.',
          ),
      allowedStatuses: 'any',
      group: null,
      visibility: 'enabled',
    }
  },

  async ({ effects }) => {
    const enabled = await storeJson.read((s) => s.signups).once()
    await storeJson.merge(effects, { signups: !enabled })
  },
)
