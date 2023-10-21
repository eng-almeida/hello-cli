import { Command, Flags } from '@oclif/core'
// eslint-disable-next-line unicorn/prefer-node-protocol
import { spawn } from 'child_process';

export default class Run extends Command {
  static description = 'describe the command here'

  static examples = [
    '<%= config.bin %> <%= command.id %>',
  ]

  static flags = {
    authenticationToken: Flags.string({ char: 't', description: 'CI authentication token' }),
    platform: Flags.string({ char: 'p', description: 'CI platform', options: ['GitLab', 'GitHub'] }),
    organizationId: Flags.string({ char: 'o', description: 'Noctua organization id' }),
    projectId: Flags.string({ char: 'p', description: 'Noctua project id' }),
    secretKey: Flags.string({ char: 's', description: 'Noctua secret key' }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Run);

    const dangerCommand = 'danger';
    const dangerArgs = [
      'ci',
      '-d',
      'src/lib/core/index.ts'
    ]
    const envVariables = {
      DANGER_GITHUB_API_TOKEN: '',
      DANGER_FAKE_CI: 'true',
      DANGER_TEST_REPO: 'eng-almeida/gh-action',
      DANGER_TEST_PR: '2',
      NOCTUA_ORGANIZATION_ID: flags?.organizationId || process.env.NOCTUA_ORGANIZATION_ID || 'remote-123',
      NOCTUA_PROJECT_ID: flags?.projectId || process.env.NOCTUA_PROJECT_ID || 'dragon-project-123',
      NOCTUA_SECRET_KEY: flags?.organizationId || process.env.NOCTUA_SECRET_KEY || 'clnsvv1a80004k1pksa4l2a6n'
    };

    const danger = spawn(dangerCommand, dangerArgs, {
      env: { ...process.env, ...envVariables }
    });
    danger.stdout.on('data', (data: string) => {
      console.log(`${data}`);
    })

    danger.on('close', () => {
    });
    
    // this.exit(0)
  }
}
