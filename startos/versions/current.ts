import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.19.0:0',
  releaseNotes: {
    en_US:
      'Updated Penpot to 2.19.0, with configurable keyboard shortcuts and many fixes. Requires StartOS 0.4.2 or later. Full release notes: https://github.com/penpot/penpot/releases/tag/2.19.0',
    es_ES:
      'Penpot actualizado a 2.19.0, con atajos de teclado configurables y muchas correcciones. Requiere StartOS 0.4.2 o posterior. Notas de la versión completas: https://github.com/penpot/penpot/releases/tag/2.19.0',
    de_DE:
      'Penpot auf 2.19.0 aktualisiert, mit konfigurierbaren Tastenkürzeln und vielen Fehlerbehebungen. Erfordert StartOS 0.4.2 oder neuer. Vollständige Versionshinweise: https://github.com/penpot/penpot/releases/tag/2.19.0',
    pl_PL:
      'Zaktualizowano Penpot do 2.19.0, z konfigurowalnymi skrótami klawiszowymi i wieloma poprawkami. Wymaga StartOS 0.4.2 lub nowszego. Pełne informacje o wydaniu: https://github.com/penpot/penpot/releases/tag/2.19.0',
    fr_FR: `Penpot mis à jour vers 2.19.0, avec des raccourcis clavier configurables et de nombreux correctifs. Nécessite StartOS 0.4.2 ou une version ultérieure. Notes de version complètes : https://github.com/penpot/penpot/releases/tag/2.19.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
