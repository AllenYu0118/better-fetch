import { createFetch } from './fetch'

export const bfetch = createFetch({
  credentials: 'omit',
  headers: {
    'Token': 'better-fetch',
  },
})