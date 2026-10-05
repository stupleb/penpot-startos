export const DEFAULT_LANG = 'en_US'

const dict = {
  // main.ts
  'Starting Penpot!': 0,
  'Generated secrets are missing from store.json': 1,
  Exporter: 2,
  'The exporter is ready': 3,
  'Web Interface': 4,
  'The web interface is ready': 5,
  'The web interface is not ready': 6,

  // interfaces.ts
  'Web UI': 7,
  'The Penpot design editor, viewer and dashboard': 8,

  // actions/setAdminPassword.ts
  'Set Admin Password': 9,
  'Generate a new random password for the Penpot administrator account, creating the account the first time. Penpot applies it when it starts; a running Penpot restarts to apply it.': 10,
  'Replaces the current administrator password.': 11,
  'Penpot Administrator': 12,
  'Sign in to Penpot with these credentials once it has started.': 13,
  Email: 14,
  Password: 15,

  // actions/createOrResetAccount.ts
  'The email address the person signs in with. If no account uses it yet, one is created.': 16,
  Name: 17,
  'The name other Penpot users see. Only used when a new account is created.': 18,
  'Create or Reset Account': 19,
  'Create a Penpot account for someone, or give an existing account a new random password. Works while signups are disabled.': 20,
  'Account Created': 21,
  'Password Reset': 22,
  'Send these credentials to the person. They can change the password in their Penpot account settings.': 23,
  'The account now signs in with this password.': 24,
  'Enter a valid email address.': 38,

  // actions/toggleSignups.ts
  'Disable Signups': 25,
  'Enable Signups': 26,
  'Signups are enabled: anyone who can reach Penpot can create an account. Run this action to stop new signups; existing accounts keep working. Penpot restarts to apply it.': 27,
  'Signups are disabled: new accounts are made with Create or Reset Account. Run this action to let people sign up from the Penpot login page. Penpot restarts to apply it.': 28,
  'Anyone who can reach your Penpot address will be able to create an account until you disable signups again.': 29,

  // actions/setPrimaryUrl.ts
  'Primary URL': 30,
  'Pick the address you and your collaborators normally open Penpot at.': 31,
  'Set Primary URL': 32,
  'Choose the address Penpot uses for export downloads, file downloads and links in emails. Those downloads work only while you use Penpot at this address. A running Penpot restarts to apply it.': 33,

  // actions/manageSmtp.ts
  'Configure SMTP': 34,
  'Let Penpot send email: team invitations, comment notifications, password resets and signup verification. Penpot restarts to apply it.': 35,

  // init/watchAdminPassword.ts
  'Create the Penpot administrator account so you can sign in for the first time.': 36,

  // init/watchPrimaryUrl.ts
  'The address Penpot uses for downloads and email links is no longer available. Choose a new primary URL.': 37,
} as const

/**
 * Plumbing. DO NOT EDIT.
 */
export type I18nKey = keyof typeof dict
export type LangDict = Record<(typeof dict)[I18nKey], string>
export default dict
