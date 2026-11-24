import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'penpot',
  title: 'Penpot',
  license: 'MPL-2.0',
  packageRepo: 'https://github.com/stupleb/penpot-startos',
  upstreamRepo: 'https://github.com/penpot/penpot',
  marketingUrl: 'https://penpot.app',
  donationUrl: null,
  description: { short, long },
  volumes: ['startos', 'assets', 'db'],
  images: {
    frontend: {
      source: { dockerTag: 'penpotapp/frontend:2.19.4' },
      arch: ['x86_64', 'aarch64'],
    },
    backend: {
      source: {
        dockerBuild: { buildArgs: { IMAGE: 'penpotapp/backend:2.19.4' } },
      },
      arch: ['x86_64', 'aarch64'],
    },
    exporter: {
      source: { dockerTag: 'penpotapp/exporter:2.19.4' },
      arch: ['x86_64', 'aarch64'],
    },
    postgres: {
      source: { dockerTag: 'postgres:18.7-alpine' },
      arch: ['x86_64', 'aarch64'],
    },
    valkey: {
      source: { dockerTag: 'valkey/valkey:8.1.12-alpine' },
      arch: ['x86_64', 'aarch64'],
    },
  },
})
