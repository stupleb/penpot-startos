import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '2.19.1:0',
  releaseNotes: {
    en_US:
      'Updated Penpot to 2.19.1, which fixes four security flaws: a team editor could get the link of any pending invitation, a share link could reveal who commented on pages it leaves out, any signed-in user could mark comment threads in other teams as read, and an uploaded SVG could run a script. Full release notes: https://github.com/penpot/penpot/releases/tag/2.19.1',
    es_ES:
      'Penpot actualizado a 2.19.1, que corrige cuatro fallos de seguridad: un editor de un equipo podía obtener el enlace de cualquier invitación pendiente, un enlace compartido podía revelar quién comentó en páginas que no incluye, cualquier usuario con sesión iniciada podía marcar como leídos hilos de comentarios de otros equipos y un SVG subido podía ejecutar un script. Notas de la versión completas: https://github.com/penpot/penpot/releases/tag/2.19.1',
    de_DE:
      'Penpot auf 2.19.1 aktualisiert. Behebt vier Sicherheitslücken: Ein Team-Editor konnte den Link jeder ausstehenden Einladung abrufen, ein Freigabelink konnte verraten, wer auf nicht freigegebenen Seiten kommentiert hat, jeder angemeldete Benutzer konnte Kommentar-Threads anderer Teams als gelesen markieren, und ein hochgeladenes SVG konnte ein Skript ausführen. Vollständige Versionshinweise: https://github.com/penpot/penpot/releases/tag/2.19.1',
    pl_PL:
      'Zaktualizowano Penpot do 2.19.1, który naprawia cztery luki bezpieczeństwa: edytor zespołu mógł pobrać link dowolnego oczekującego zaproszenia, link udostępniania mógł ujawnić autorów komentarzy na stronach, których nie obejmuje, każdy zalogowany użytkownik mógł oznaczać wątki komentarzy innych zespołów jako przeczytane, a przesłany plik SVG mógł uruchomić skrypt. Pełne informacje o wydaniu: https://github.com/penpot/penpot/releases/tag/2.19.1',
    fr_FR: `Penpot mis à jour vers 2.19.1, qui corrige quatre failles de sécurité : un éditeur d'équipe pouvait obtenir le lien de n'importe quelle invitation en attente, un lien de partage pouvait révéler qui a commenté des pages qu'il n'inclut pas, tout utilisateur connecté pouvait marquer comme lus les fils de commentaires d'autres équipes, et un SVG importé pouvait exécuter un script. Notes de version complètes : https://github.com/penpot/penpot/releases/tag/2.19.1`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})
