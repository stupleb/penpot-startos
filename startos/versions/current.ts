import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.19.5:0',
  releaseNotes: {
    en_US:
      'Updated Penpot to 2.19.5. Large .penpot files may fail to import in Chrome again until Penpot 2.20; Firefox imports them. Full release notes: https://github.com/penpot/penpot/releases/tag/2.19.5',
    es_ES:
      'Penpot actualizado a 2.19.5. Es posible que los archivos .penpot grandes vuelvan a fallar al importarse en Chrome hasta Penpot 2.20; Firefox los importa. Notas de la versión completas: https://github.com/penpot/penpot/releases/tag/2.19.5',
    de_DE:
      'Penpot auf 2.19.5 aktualisiert. Der Import großer .penpot-Dateien kann in Chrome bis Penpot 2.20 wieder fehlschlagen; Firefox importiert sie. Vollständige Versionshinweise: https://github.com/penpot/penpot/releases/tag/2.19.5',
    pl_PL:
      'Zaktualizowano Penpot do 2.19.5. Import dużych plików .penpot w Chrome może znów kończyć się błędem aż do Penpot 2.20; Firefox je importuje. Pełne informacje o wydaniu: https://github.com/penpot/penpot/releases/tag/2.19.5',
    fr_FR: `Penpot mis à jour vers 2.19.5. L'import de gros fichiers .penpot peut de nouveau échouer dans Chrome jusqu'à Penpot 2.20 ; Firefox les importe. Notes de version complètes : https://github.com/penpot/penpot/releases/tag/2.19.5`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
