import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.18.6:0',
  releaseNotes: {
    en_US:
      'Updated Penpot to 2.18.6, which fixes a security flaw that let any signed-in user read files from the server. Requires StartOS 0.4.1 or later. Full release notes: https://github.com/penpot/penpot/releases/tag/2.18.6',
    es_ES:
      'Penpot actualizado a 2.18.6, que corrige un fallo de seguridad que permitía a cualquier usuario con sesión iniciada leer archivos del servidor. Requiere StartOS 0.4.1 o posterior. Notas de la versión completas: https://github.com/penpot/penpot/releases/tag/2.18.6',
    de_DE:
      'Penpot auf 2.18.6 aktualisiert. Behebt eine Sicherheitslücke, durch die jeder angemeldete Benutzer Dateien vom Server lesen konnte. Erfordert StartOS 0.4.1 oder neuer. Vollständige Versionshinweise: https://github.com/penpot/penpot/releases/tag/2.18.6',
    pl_PL:
      'Zaktualizowano Penpot do 2.18.6, który naprawia lukę bezpieczeństwa pozwalającą każdemu zalogowanemu użytkownikowi odczytywać pliki z serwera. Wymaga StartOS 0.4.1 lub nowszego. Pełne informacje o wydaniu: https://github.com/penpot/penpot/releases/tag/2.18.6',
    fr_FR: `Penpot mis à jour vers 2.18.6, qui corrige une faille de sécurité permettant à tout utilisateur connecté de lire des fichiers du serveur. Nécessite StartOS 0.4.1 ou une version ultérieure. Notes de version complètes : https://github.com/penpot/penpot/releases/tag/2.18.6`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
