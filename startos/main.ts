import { T } from '@start9labs/start-sdk'
import { primaryUrl } from './actions/setPrimaryUrl'
import { storeJson } from './fileModels/store.json'
import { i18n } from './i18n'
import { sdk } from './sdk'
import {
  activeEmailById,
  adminDefaultEmail,
  assetsPath,
  backendPort,
  createProfile,
  exporterPort,
  isUuid,
  pgdataSubpath,
  postgresDb,
  postgresPath,
  postgresUser,
  queryOne,
  sha256,
  uiPort,
  updateProfilePassword,
} from './utils'

const readyz = (port: number) =>
  fetch(`http://127.0.0.1:${port}/readyz`, {
    signal: AbortSignal.timeout(10_000),
  }).then(
    (res) => res.ok,
    () => false,
  )

// One failed check stops every dependent (start-technologies#3803), so fail only after three misses in a row.
const tolerant = async (probe: () => Promise<boolean>) => {
  for (let attempt = 0; attempt < 3; attempt++) {
    if (await probe()) return true
    await new Promise((resolve) => setTimeout(resolve, 2_000))
  }
  return false
}

export const main = sdk.setupMain(async ({ effects }) => {
  console.info(i18n('Starting Penpot!'))

  const store = await storeJson
    .read((s) => ({
      secretKey: s.secretKey,
      postgresPassword: s.postgresPassword,
      smtp: s.smtp,
      signups: s.signups,
      adminPassword: s.adminPassword,
    }))
    .const(effects)
  if (!store?.secretKey || !store.postgresPassword) {
    throw new Error(i18n('Generated secrets are missing from store.json'))
  }

  let smtp: T.SmtpValue | null = null
  if (store.smtp.selection === 'system') {
    smtp = await sdk.getSystemSmtp(effects).const()
    const customFrom = store.smtp.value.customFrom
    if (smtp && customFrom) smtp = { ...smtp, from: customFrom }
  } else if (store.smtp.selection === 'custom') {
    const { host, from, username, password, security } =
      store.smtp.value.provider.value
    smtp = {
      host,
      from,
      username,
      password: password ?? null,
      port: Number(security.value.port),
      security: security.selection,
    }
  }

  const PENPOT_FLAGS = [
    'enable-prepl-server',
    store.signups ? 'enable-registration' : 'disable-registration',
    smtp ? 'enable-smtp' : 'disable-smtp',
    smtp ? 'enable-email-verification' : 'disable-email-verification',
  ].join(' ')

  const publicUri = (await primaryUrl.bestUsable(effects).const())?.replace(
    /\/+$/,
    '',
  )
  const publicUriEnv = publicUri ? { PENPOT_PUBLIC_URI: publicUri } : {}
  const redisUri = 'redis://127.0.0.1:6379/0'

  const postgresSub = sdk.SubContainer.of(
    effects,
    { imageId: 'postgres' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'db',
      subpath: null,
      mountpoint: postgresPath,
      readonly: false,
    }),
    'postgres',
  )
  const backendSub = sdk.SubContainer.of(
    effects,
    { imageId: 'backend' },
    sdk.Mounts.of().mountVolume({
      volumeId: 'assets',
      subpath: null,
      mountpoint: assetsPath,
      readonly: false,
    }),
    'backend',
  )

  const valkeySub = sdk.SubContainer.of(
    effects,
    { imageId: 'valkey' },
    null,
    'valkey',
  )

  return sdk.Daemons.of(effects)
    .addOneshot('pg-recover', {
      subcontainer: postgresSub,
      exec: {
        // After an unclean stop the PID in postmaster.pid is often alive in the new namespace, and postgres refuses to start.
        command: ['rm', '-f', `${postgresPath}${pgdataSubpath}/postmaster.pid`],
        user: 'root',
      },
      requires: [],
    })
    .addDaemon('postgres', {
      subcontainer: postgresSub,
      exec: {
        command: sdk.useEntrypoint(['--listen_addresses=127.0.0.1']),
        env: {
          POSTGRES_USER: postgresUser,
          POSTGRES_DB: postgresDb,
          POSTGRES_PASSWORD: store.postgresPassword,
        },
      },
      ready: {
        display: null,
        fn: async () =>
          (await tolerant(
            async () =>
              (
                await postgresSub.exec(
                  [
                    'pg_isready',
                    '-U',
                    postgresUser,
                    '-h',
                    '127.0.0.1',
                    '-t',
                    '15',
                  ],
                  { timeout: 20_000 },
                )
              ).exitCode === 0,
          ))
            ? { result: 'success', message: null }
            : { result: 'starting', message: null },
      },
      requires: ['pg-recover'],
    })
    .addDaemon('valkey', {
      subcontainer: valkeySub,
      exec: {
        command: [
          'valkey-server',
          '--bind',
          '127.0.0.1',
          '--save',
          '',
          '--appendonly',
          'no',
          '--maxmemory',
          '128mb',
          '--maxmemory-policy',
          'volatile-lfu',
        ],
      },
      ready: {
        display: null,
        fn: async () =>
          (await tolerant(
            async () =>
              (
                await valkeySub.exec(['valkey-cli', 'ping'], {
                  timeout: 20_000,
                })
              ).stdout
                .toString()
                .trim() === 'PONG',
          ))
            ? { result: 'success', message: null }
            : { result: 'starting', message: null },
      },
      requires: [],
    })
    .addOneshot('assets-owner', {
      subcontainer: backendSub,
      exec: {
        command: ['chown', 'penpot:penpot', assetsPath],
        user: 'root',
      },
      requires: [],
    })
    .addDaemon('backend', {
      subcontainer: backendSub,
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          PENPOT_FLAGS,
          ...publicUriEnv,
          PENPOT_SECRET_KEY: store.secretKey,
          PENPOT_DATABASE_URI: `postgresql://127.0.0.1:5432/${postgresDb}`,
          PENPOT_DATABASE_USERNAME: postgresUser,
          PENPOT_DATABASE_PASSWORD: store.postgresPassword,
          PENPOT_REDIS_URI: redisUri,
          PENPOT_OBJECTS_STORAGE_BACKEND: 'fs',
          PENPOT_OBJECTS_STORAGE_FS_DIRECTORY: assetsPath,
          PENPOT_TELEMETRY_ENABLED: 'false',
          ...(smtp
            ? {
                PENPOT_SMTP_HOST: smtp.host,
                PENPOT_SMTP_PORT: String(smtp.port),
                PENPOT_SMTP_TLS: String(smtp.security === 'starttls'),
                PENPOT_SMTP_SSL: String(smtp.security === 'tls'),
                PENPOT_SMTP_DEFAULT_FROM: smtp.from,
                PENPOT_SMTP_DEFAULT_REPLY_TO: smtp.from,
                // Penpot turns on SMTP auth for any username, even an empty one.
                ...(smtp.username
                  ? { PENPOT_SMTP_USERNAME: smtp.username }
                  : {}),
                ...(smtp.password
                  ? { PENPOT_SMTP_PASSWORD: smtp.password }
                  : {}),
              }
            : {}),
        },
      },
      ready: {
        display: null,
        fn: async () =>
          (await tolerant(() => readyz(backendPort)))
            ? { result: 'success', message: null }
            : { result: 'starting', message: null },
        gracePeriod: 120_000,
      },
      requires: ['postgres', 'valkey', 'assets-owner'],
    })
    .addOneshot('admin-account', {
      subcontainer: null,
      exec: {
        fn: async () => {
          const password = store.adminPassword
          if (!password) return null
          const current = await storeJson.read().once()
          if (current?.adminApplied === sha256(password)) return null

          const storedId = current?.adminProfileId ?? ''
          let id = isUuid(storedId) ? storedId : null
          let email = id ? await activeEmailById(postgresSub, id) : null
          if (!email) {
            id = await queryOne(
              postgresSub,
              `SELECT id FROM profile WHERE email = '${adminDefaultEmail}' AND deleted_at IS NULL`,
            )
            email = id ? adminDefaultEmail : null
          }

          if (id && email) {
            if (!(await updateProfilePassword(backendSub, email, password))) {
              throw new Error(`No Penpot account found for ${email}`)
            }
          } else {
            id = await createProfile(
              backendSub,
              'Administrator',
              adminDefaultEmail,
              password,
            )
            email = adminDefaultEmail
          }

          await storeJson.merge(effects, {
            adminApplied: sha256(password),
            adminProfileId: id,
            adminEmail: email,
          })
          return null
        },
      },
      requires: ['backend'],
    })
    .addDaemon('exporter', {
      subcontainer: sdk.SubContainer.of(
        effects,
        { imageId: 'exporter' },
        null,
        'exporter',
      ),
      exec: {
        command: sdk.useEntrypoint(),
        env: {
          PENPOT_FLAGS,
          ...publicUriEnv,
          PENPOT_SECRET_KEY: store.secretKey,
          PENPOT_INTERNAL_URI: `http://127.0.0.1:${uiPort}`,
          PENPOT_REDIS_URI: redisUri,
        },
      },
      ready: {
        display: i18n('Exporter'),
        fn: async () =>
          (await tolerant(() => readyz(exporterPort)))
            ? { result: 'success', message: i18n('The exporter is ready') }
            : { result: 'starting', message: null },
        gracePeriod: 60_000,
      },
      requires: ['valkey'],
    })
    .addDaemon('frontend', {
      subcontainer: sdk.SubContainer.of(
        effects,
        { imageId: 'frontend' },
        sdk.Mounts.of().mountVolume({
          volumeId: 'assets',
          subpath: null,
          mountpoint: assetsPath,
          readonly: true,
        }),
        'frontend',
      ),
      exec: {
        command: sdk.useEntrypoint(),
        // No PENPOT_PUBLIC_URI: the app then works at whatever address the browser is on.
        env: {
          PENPOT_FLAGS,
          PENPOT_BACKEND_URI: `http://127.0.0.1:${backendPort}`,
          PENPOT_EXPORTER_URI: `http://127.0.0.1:${exporterPort}`,
        },
      },
      ready: {
        display: i18n('Web Interface'),
        // Through nginx to the backend, so a working UI means a working API.
        fn: async () =>
          (await tolerant(() => readyz(uiPort)))
            ? { result: 'success', message: i18n('The web interface is ready') }
            : {
                result: 'starting',
                message: i18n('The web interface is not ready'),
              },
        gracePeriod: 120_000,
      },
      requires: ['backend', 'admin-account'],
    })
})
