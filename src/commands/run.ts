import {Args, Command, Flags} from '@oclif/core'
import { context } from "@actions/github";
import { GitHubApi } from '../lib/platforms/github-api';
import { GitLabApi } from '../lib/platforms/gitlab-api';

function getPlatform() {
  if(process.env.GITLAB_CI) {
    return GitLabApi.name
  }

  if(process.env.GITHUB_ACTIONS) {
    return GitHubApi.name
  }
}

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

  static args = {
    file: Args.string({description: 'file to read'}),
  }

  public async run(): Promise<void> {
    const { args, flags } = await this.parse(Run)

    const platform = flags?.platform || getPlatform();
      
    if(platform === 'GitLab') {
      const gitlabApi = new GitLabApi(flags)
      const pull = await gitlabApi.listPullRequestDiff();
      this.log(JSON.stringify(pull))
    } else if(platform === 'GitHub') {
      const githubApi = new GitHubApi(flags);
      // const pull = await githubApi.listPullRequestDiff();
      // this.log(JSON.stringify(pull))
    }
    
  }
}
