import { Command, Flags } from '@oclif/core'
// eslint-disable-next-line unicorn/prefer-node-protocol
import { spawn } from 'child_process';

const assert = require('node:assert');

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

    const organizationId = flags?.organizationId || process.env.NOCTUA_ORGANIZATION_ID;
    assert(organizationId, 'Organization id was not provided');
    
    const projectId = flags?.projectId || process.env.NOCTUA_PROJECT_ID;
    assert(projectId, 'Project id was not provided');

    const secretKey = flags?.organizationId || process.env.NOCTUA_SECRET_KEY;
    assert(secretKey, 'Secret key was not provided. Read docs about to get your Noctua secret');


    const dangerCommand = 'danger';
    const dangerArgs = [
      'ci',
      '-d',
      'src/lib/core/index.ts'
    ]
    const envVariables = {
      // ------- TO REMOVE START ------------
      DANGER_GITHUB_API_TOKEN: '',
      DANGER_FAKE_CI: 'true',
      DANGER_TEST_REPO: '',
      DANGER_TEST_PR: '',
      // ------- TO REMOVE END ------------
      NOCTUA_ORGANIZATION_ID: organizationId,
      NOCTUA_PROJECT_ID: projectId,
      NOCTUA_SECRET_KEY: secretKey
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
