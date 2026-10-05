import { SubContainer, T, utils } from '@start9labs/start-sdk'
import { createHash } from 'node:crypto'
import { manifest } from './manifest'
import { sdk } from './sdk'

export const uiPort = 8080
export const backendPort = 6060
export const exporterPort = 6061

export const uiHostId = 'ui-multi'
export const uiInterfaceId = 'ui'

export const assetsPath = '/opt/data/assets'
export const postgresPath = '/var/lib/postgresql'
// The postgres 18 image's default PGDATA, relative to postgresPath.
export const pgdataSubpath = '/18/docker'
export const postgresUser = 'penpot'
export const postgresDb = 'penpot'

export const backendDir = '/opt/penpot/backend'
export const adminDefaultEmail = 'admin@penpot.local'

export const getRandomPassword = () =>
  utils.getDefaultString({ charset: 'a-z,A-Z,0-9', len: 32 })

export const sha256 = (value: string) =>
  createHash('sha256').update(value).digest('hex')

export const uiUrls = (effects: T.Effects) =>
  sdk.host.getOwn(effects, uiHostId, (host) => {
    const ui = Object.values(host?.bindings ?? {})
      .flatMap((b) => Object.values(b.interfaces))
      .find((i) => i.id === uiInterfaceId)
    const all = ui?.addressInfo.nonLocal.format() ?? []
    const mdns =
      ui?.addressInfo.nonLocal.filter({ kind: 'mdns' }).format() ?? []
    return { all, preferred: mdns[0] ?? all[0] }
  })

type PenpotSub = SubContainer<typeof manifest>

// manage.py talks to the running backend's PREPL port (localhost:6063).
export async function managePy(sub: PenpotSub, args: string[]) {
  const res = await sub.exec(
    ['python3', 'manage.py', ...args],
    { cwd: backendDir },
    60_000,
  )
  const out = res.stdout.toString().trim()
  if (res.exitCode !== 0) {
    throw new Error(
      `manage.py ${args[0]} failed: ${out} ${res.stderr.toString()}`.trim(),
    )
  }
  return out
}

export async function createProfile(
  sub: PenpotSub,
  fullname: string,
  email: string,
  password: string,
) {
  const out = await managePy(sub, [
    'create-profile',
    '-n',
    fullname,
    '-e',
    email,
    '-p',
    password,
  ])
  const id = out.match(/^Created: .+ \/ ([0-9a-f-]{36})$/m)?.[1]
  if (!id)
    throw new Error(`manage.py create-profile: unexpected output: ${out}`)
  return id
}

export async function updateProfilePassword(
  sub: PenpotSub,
  email: string,
  password: string,
) {
  const out = await managePy(sub, [
    'update-profile',
    '-e',
    email,
    '-p',
    password,
  ])
  if (out === 'Updated') return true
  if (out.startsWith('No profile found')) return false
  throw new Error(`manage.py update-profile: unexpected output: ${out}`)
}

export async function queryOne(postgresSub: PenpotSub, sql: string) {
  const { stdout } = await postgresSub.execFail(
    [
      'psql',
      '-h',
      '127.0.0.1',
      '-U',
      postgresUser,
      '-d',
      postgresDb,
      '-tA',
      '-c',
      sql,
    ],
    {},
    30_000,
  )
  return stdout.toString().trim() || null
}

export const isUuid = (value: string) => /^[0-9a-f-]{36}$/.test(value)

export const activeEmailById = (postgresSub: PenpotSub, id: string) =>
  queryOne(
    postgresSub,
    `SELECT email FROM profile WHERE id = '${id}' AND deleted_at IS NULL`,
  )
