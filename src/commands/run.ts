import { Command, Flags } from '@oclif/core'
import { CliCore } from '../lib/core';
import { getPlatform, platformAPI } from '../lib/apis/api';
import { DangerJSON } from 'danger'
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
    projectId: Flags.string({ description: 'GitLab project id' }),
    owner: Flags.string({ description: 'GitHub owner' }),
    repo: Flags.string({ char: 't', description: 'GitHub repo name' }),
    pullRequestId: Flags.string({ description: 'Pullrequest id' }),
  }

  public async run(): Promise<void> {
    const { flags } = await this.parse(Run)

    const platform = flags?.platform || getPlatform();

    if(!platform) {
      this.error("Platform not found or not supported")
    }

    // const Api = platformAPI[platform];
    // const core = new CliCore(new Api(flags));

    

    const dangerCommand = 'danger-pr';
    const dangerArgs = [
      'https://github.com/eng-almeida/gh-action/pull/2',
      '--json'
    ]
    const envVariables = {
      DANGER_GITHUB_API_TOKEN: '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',
      DANGER_FAKE_CI: 'true',
      DANGER_TEST_REPO: 'eng-almeida/gh-action',
    };

    let mergedOut = '';
    const danger = spawn(dangerCommand, dangerArgs, {
      env: { ...process.env, ...envVariables }
    });
    danger.stdout.setEncoding('utf8');
    danger.stdout.on('data', (data: string) => {
        mergedOut += data;
      })

    danger.on('close', (code) => {
      console.log(code)
      const dangerObj = JSON.parse(mergedOut) as DangerJSON;
      console.log(dangerObj.danger.github)
    });

    const core = new CliCore();
    await core.run();
    
    // this.exit(0)
  }
}
