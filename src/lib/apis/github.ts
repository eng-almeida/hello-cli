/* eslint-disable camelcase */
import { context, getOctokit } from "@actions/github";
import type { PlatformApi, GitHubApiParams } from "./api";
// eslint-disable-next-line unicorn/prefer-module
const assert = require('node:assert');

export class GitHubApi implements PlatformApi {
  static displayName = 'GitHub'

  readonly authenticationToken: string
  repo: {
    owner: string;
    repo: string;
  };

  pullRequestId: number;

  constructor(flags: GitHubApiParams) {
    this.authenticationToken = flags.authenticationToken || process.env.GITHUB_TOKEN || '';
    assert(this.authenticationToken, 'Authentication token was not provided');
    this.repo = {
      owner: flags.owner || context.repo.owner || 'eng-almeida',
      repo: flags.repo || context.repo.repo ||  'gh-action'
    } 
    assert(this.repo.owner, 'GitHub owner was not provided');
    assert(this.repo.repo, 'GitHub repository name was not provided');

    this.pullRequestId = Number(flags.pullRequestId) || context.payload.pull_request?.number || 2
    assert(this.pullRequestId, 'Pull request id was not provided');
  }
  
  async getPullRequest() {
    const octokit = getOctokit(this.authenticationToken);
    const { data: pullRequestData } = await  octokit.rest.pulls.get({ 
      ...this.repo,
      pull_number: this.pullRequestId,
    });

    if(pullRequestData.user) {
      const { data: userData } = await octokit.rest.users.getByUsername({ username: pullRequestData.user?.login})
      return { 
        refs: {
          target_branch: pullRequestData.head.ref, 
          source_branch: pullRequestData.base.ref, 
        },
        author_email: userData.email 
      }
    }

    return { 
      refs: {
        target_branch: pullRequestData.head.ref, 
        source_branch: pullRequestData.base.ref, 
      },
      author_email: null
    }
  }

  async createPullRequestComment(body: string) {
    const octokit = getOctokit(this.authenticationToken);

    return octokit.rest.issues.createComment({
      ...this.repo,
      issue_number: this.pullRequestId,
      body,
    })
  }
}
  