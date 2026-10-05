import { storeJson } from '../fileModels/store.json'
import { i18n } from '../i18n'
import { sdk } from '../sdk'
import { uiUrls } from '../utils'

const { InputSpec, Value } = sdk

const inputSpec = InputSpec.of({
  primaryUrl: Value.dynamicSelect(async ({ effects }) => {
    const { all, preferred } = await uiUrls(effects).once()

    return {
      name: i18n('Primary URL'),
      description: i18n(
        'Pick the address you and your collaborators normally open Penpot at.',
      ),
      values: Object.fromEntries(all.map((url) => [url, url])),
      default: preferred ?? '',
    }
  }),
})

export const setPrimaryUrl = sdk.Action.withInput(
  'set-primary-url',

  async ({ effects }) => ({
    name: i18n('Set Primary URL'),
    description: i18n(
      'Choose the address Penpot uses for export downloads, file downloads and links in emails. Those downloads work only while you use Penpot at this address. A running Penpot restarts to apply it.',
    ),
    warning: null,
    allowedStatuses: 'any',
    group: null,
    visibility: 'enabled',
  }),

  inputSpec,

  async ({ effects }) => {
    const stored = await storeJson.read((s) => s.primaryUrl).once()
    const { all } = await uiUrls(effects).once()
    return { primaryUrl: stored && all.includes(stored) ? stored : undefined }
  },

  async ({ effects, input }) =>
    storeJson.merge(effects, { primaryUrl: input.primaryUrl }),
)
