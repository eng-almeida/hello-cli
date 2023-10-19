import { spawnAsPromise } from '../../helpers';
import { simpleGit, SimpleGit, CleanOptions } from 'simple-git';

const git: SimpleGit = simpleGit().clean(CleanOptions.FORCE);

export const localGetDiff = async (base: string, head: string) => {
  console.log('diff')
  const args = [
    'diff',
    '--name-only',
    `${base}...${head}`,
  ]
  return spawnAsPromise('cd ../gh-action && git', args, { env: process.env, shell: true })
  // return git.diff({ '--name-only': null, [`${base}...${head}`]: null })
  // return spawnAsPromise('cd ../gh-action && git fetch origin && git', args, { env: process.env, shell: true })
}
    
