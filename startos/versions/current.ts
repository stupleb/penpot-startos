import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.18.4:0',
  releaseNotes: {
    en_US:
      'Updated Penpot to 2.18.4. Includes the October 2026 Node.js security fixes and the Brotli security fix (CVE-2026-111497). Fixes storage cleanup that deleted nothing or left files behind, and saving a version taking seconds. Full release notes: https://github.com/penpot/penpot/releases/tag/2.18.4',
    es_ES:
      'Penpot actualizado a 2.18.4. Incluye las correcciones de seguridad de Node.js de octubre de 2026 y la corrección de seguridad de Brotli (CVE-2026-111497). Corrige la limpieza del almacenamiento que no borraba nada o dejaba archivos sin borrar, y que guardar una versión tardara segundos. Notas de la versión completas: https://github.com/penpot/penpot/releases/tag/2.18.4',
    de_DE:
      'Penpot auf 2.18.4 aktualisiert. Enthält die Node.js-Sicherheitskorrekturen vom Oktober 2026 und die Brotli-Sicherheitskorrektur (CVE-2026-111497). Behebt eine Speicherbereinigung, die nichts löschte oder Dateien zurückließ, sowie das sekundenlange Speichern einer Version. Vollständige Versionshinweise: https://github.com/penpot/penpot/releases/tag/2.18.4',
    pl_PL:
      'Zaktualizowano Penpot do 2.18.4. Zawiera poprawki bezpieczeństwa Node.js z października 2026 oraz poprawkę bezpieczeństwa Brotli (CVE-2026-111497). Naprawiono czyszczenie magazynu, które niczego nie usuwało lub zostawiało pliki, oraz zapisywanie wersji trwające kilka sekund. Pełne informacje o wydaniu: https://github.com/penpot/penpot/releases/tag/2.18.4',
    fr_FR: `Penpot mis à jour vers 2.18.4. Inclut les correctifs de sécurité Node.js d'octobre 2026 et le correctif de sécurité de Brotli (CVE-2026-111497). Corrige le nettoyage du stockage qui ne supprimait rien ou laissait des fichiers, et l'enregistrement d'une version qui prenait plusieurs secondes. Notes de version complètes : https://github.com/penpot/penpot/releases/tag/2.18.4`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
