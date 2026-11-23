import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.19.3:0',
  releaseNotes: {
    en_US:
      'Updated Penpot to 2.19.3, which fixes duplicating files that contain deleted components, and a blank page at startup when a browser extension prevents plugins from running. The web server also uses less memory. Full release notes: https://github.com/penpot/penpot/releases/tag/2.19.3',
    es_ES:
      'Penpot actualizado a 2.19.3, que corrige la duplicación de archivos que contienen componentes eliminados y la página en blanco al iniciar cuando una extensión del navegador impide que se ejecuten los plugins. El servidor web también usa menos memoria. Notas de la versión completas: https://github.com/penpot/penpot/releases/tag/2.19.3',
    de_DE:
      'Penpot auf 2.19.3 aktualisiert. Behebt das Duplizieren von Dateien mit gelöschten Komponenten und eine leere Seite beim Start, wenn eine Browsererweiterung die Ausführung von Plugins verhindert. Der Webserver benötigt außerdem weniger Speicher. Vollständige Versionshinweise: https://github.com/penpot/penpot/releases/tag/2.19.3',
    pl_PL:
      'Zaktualizowano Penpot do 2.19.3, który naprawia duplikowanie plików zawierających usunięte komponenty oraz pustą stronę przy uruchomieniu, gdy rozszerzenie przeglądarki uniemożliwia działanie wtyczek. Serwer WWW zużywa też mniej pamięci. Pełne informacje o wydaniu: https://github.com/penpot/penpot/releases/tag/2.19.3',
    fr_FR: `Penpot mis à jour vers 2.19.3, qui corrige la duplication des fichiers contenant des composants supprimés et la page blanche au démarrage lorsqu'une extension du navigateur empêche l'exécution des plugins. Le serveur web utilise aussi moins de mémoire. Notes de version complètes : https://github.com/penpot/penpot/releases/tag/2.19.3`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
