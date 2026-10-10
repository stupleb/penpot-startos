import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.18.3:0',
  releaseNotes: {
    en_US:
      'Penpot 2.18.3, with security fixes for SVG imports and team access (https://github.com/penpot/penpot/releases/tag/2.18.3). StartOS opens Penpot at its primary URL, and backups and restores of large databases run to completion.',
    es_ES:
      'Penpot 2.18.3, con correcciones de seguridad en la importación de SVG y el acceso a los equipos (https://github.com/penpot/penpot/releases/tag/2.18.3). StartOS abre Penpot en su URL principal, y las copias de seguridad y restauraciones de bases de datos grandes se completan.',
    de_DE:
      'Penpot 2.18.3 mit Sicherheitskorrekturen für SVG-Importe und den Teamzugriff (https://github.com/penpot/penpot/releases/tag/2.18.3). StartOS öffnet Penpot unter seiner primären URL, und Sicherungen und Wiederherstellungen großer Datenbanken laufen vollständig durch.',
    pl_PL:
      'Penpot 2.18.3 z poprawkami bezpieczeństwa dotyczącymi importu SVG i dostępu do zespołów (https://github.com/penpot/penpot/releases/tag/2.18.3). StartOS otwiera Penpot pod jego głównym URL, a kopie zapasowe i przywracanie dużych baz danych kończą się w całości.',
    fr_FR:
      "Penpot 2.18.3, avec des correctifs de sécurité pour l'import de SVG et l'accès aux équipes (https://github.com/penpot/penpot/releases/tag/2.18.3). StartOS ouvre Penpot à son URL principale, et les sauvegardes et restaurations de grandes bases de données vont jusqu'au bout.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
