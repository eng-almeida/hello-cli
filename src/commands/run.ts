import { Command, Flags } from '@oclif/core'
import { CliCore } from '../lib/core';
import { getPlatform, platformAPI } from '../lib/apis/api';


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

    const Api = platformAPI[platform];
    const core = new CliCore(new Api(flags));
    core.init();
  }
}
