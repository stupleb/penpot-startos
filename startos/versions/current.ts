import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.19.2:0',
  releaseNotes: {
    en_US:
      'Updated Penpot to 2.19.2, which fixes some older files that would not open, autosave failing after an SVG is uploaded as a component, errors copying component variants between libraries, and slow variant switching in large files. Full release notes: https://github.com/penpot/penpot/releases/tag/2.19.2',
    es_ES:
      'Penpot actualizado a 2.19.2, que corrige algunos archivos antiguos que no se abrían, el guardado automático que fallaba tras subir un SVG como componente, los errores al copiar variantes de componentes entre bibliotecas y la lentitud al cambiar de variante en archivos grandes. Notas de la versión completas: https://github.com/penpot/penpot/releases/tag/2.19.2',
    de_DE:
      'Penpot auf 2.19.2 aktualisiert. Behebt ältere Dateien, die sich nicht öffnen ließen, fehlschlagendes automatisches Speichern nach dem Hochladen eines SVG als Komponente, Fehler beim Kopieren von Komponentenvarianten zwischen Bibliotheken und langsames Wechseln von Varianten in großen Dateien. Vollständige Versionshinweise: https://github.com/penpot/penpot/releases/tag/2.19.2',
    pl_PL:
      'Zaktualizowano Penpot do 2.19.2, który naprawia niektóre starsze pliki, których nie dało się otworzyć, nieudany autozapis po przesłaniu pliku SVG jako komponentu, błędy kopiowania wariantów komponentów między bibliotekami oraz powolne przełączanie wariantów w dużych plikach. Pełne informacje o wydaniu: https://github.com/penpot/penpot/releases/tag/2.19.2',
    fr_FR: `Penpot mis à jour vers 2.19.2, qui corrige certains anciens fichiers qui ne s'ouvraient pas, l'enregistrement automatique qui échouait après l'import d'un SVG comme composant, les erreurs lors de la copie de variantes de composants entre bibliothèques et la lenteur du changement de variante dans les gros fichiers. Notes de version complètes : https://github.com/penpot/penpot/releases/tag/2.19.2`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
