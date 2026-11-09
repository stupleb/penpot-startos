import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.18.7:0',
  releaseNotes: {
    en_US:
      'Updated Penpot to 2.18.7, which fixes a security flaw that let an imported file link to a library from another team. Existing links between a file and a library in another team are removed. Full release notes: https://github.com/penpot/penpot/releases/tag/2.18.7',
    es_ES:
      'Penpot actualizado a 2.18.7, que corrige un fallo de seguridad que permitía que un archivo importado se vinculara a una biblioteca de otro equipo. Se eliminan los vínculos existentes entre un archivo y una biblioteca de otro equipo. Notas de la versión completas: https://github.com/penpot/penpot/releases/tag/2.18.7',
    de_DE:
      'Penpot auf 2.18.7 aktualisiert. Behebt eine Sicherheitslücke, durch die eine importierte Datei mit einer Bibliothek eines anderen Teams verknüpft werden konnte. Bestehende Verknüpfungen zwischen einer Datei und einer Bibliothek eines anderen Teams werden entfernt. Vollständige Versionshinweise: https://github.com/penpot/penpot/releases/tag/2.18.7',
    pl_PL:
      'Zaktualizowano Penpot do 2.18.7, który naprawia lukę bezpieczeństwa pozwalającą powiązać zaimportowany plik z biblioteką innego zespołu. Istniejące powiązania między plikiem a biblioteką innego zespołu zostają usunięte. Pełne informacje o wydaniu: https://github.com/penpot/penpot/releases/tag/2.18.7',
    fr_FR: `Penpot mis à jour vers 2.18.7, qui corrige une faille de sécurité permettant de lier un fichier importé à une bibliothèque d'une autre équipe. Les liens existants entre un fichier et une bibliothèque d'une autre équipe sont supprimés. Notes de version complètes : https://github.com/penpot/penpot/releases/tag/2.18.7`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
