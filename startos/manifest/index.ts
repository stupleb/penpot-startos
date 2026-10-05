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
      source: { dockerTag: 'penpotapp/frontend:2.18.2' },
      arch: ['x86_64', 'aarch64'],
    },
    backend: {
      source: { dockerTag: 'penpotapp/backend:2.18.2' },
      arch: ['x86_64', 'aarch64'],
    },
    exporter: {
      source: { dockerTag: 'penpotapp/exporter:2.18.2' },
      arch: ['x86_64', 'aarch64'],
    },
    postgres: {
      source: { dockerTag: 'postgres:18.6-alpine' },
      arch: ['x86_64', 'aarch64'],
    },
    valkey: {
      source: { dockerTag: 'valkey/valkey:8.1.10-alpine' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})
