import { spawnAsPromise } from '../../helpers';

export const localGetDiff = async (base: string, head: string) => {
  const args = [
    'diff',
    '--name-only',
    `${base}...${head}`,
  ]
  return spawnAsPromise('cd ../gh-action && git', args, { env: process.env, shell: true })
}
    
