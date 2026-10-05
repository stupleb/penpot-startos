import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.18.2:0',
  releaseNotes: {
    en_US: 'Initial release of Penpot 2.18.2 for StartOS.',
    es_ES: 'Primera versión de Penpot 2.18.2 para StartOS.',
    de_DE: 'Erste Veröffentlichung von Penpot 2.18.2 für StartOS.',
    pl_PL: 'Pierwsze wydanie Penpot 2.18.2 dla StartOS.',
    fr_FR: 'Première version de Penpot 2.18.2 pour StartOS.',
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
