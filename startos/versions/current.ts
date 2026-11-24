import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.19.4:0',
  releaseNotes: {
    en_US:
      'Updated Penpot to 2.19.4, which fixes importing large .penpot files in Chrome. Full release notes: https://github.com/penpot/penpot/releases/tag/2.19.4',
    es_ES:
      'Penpot actualizado a 2.19.4, que corrige la importación de archivos .penpot grandes en Chrome. Notas de la versión completas: https://github.com/penpot/penpot/releases/tag/2.19.4',
    de_DE:
      'Penpot auf 2.19.4 aktualisiert. Behebt den Import großer .penpot-Dateien in Chrome. Vollständige Versionshinweise: https://github.com/penpot/penpot/releases/tag/2.19.4',
    pl_PL:
      'Zaktualizowano Penpot do 2.19.4, który naprawia import dużych plików .penpot w Chrome. Pełne informacje o wydaniu: https://github.com/penpot/penpot/releases/tag/2.19.4',
    fr_FR: `Penpot mis à jour vers 2.19.4, qui corrige l'import de gros fichiers .penpot dans Chrome. Notes de version complètes : https://github.com/penpot/penpot/releases/tag/2.19.4`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
