/* eslint-disable camelcase */
import { context, getOctokit } from "@actions/github";
import type { PlatformApi, GitHubApiParams } from "./api";
// eslint-disable-next-line unicorn/prefer-module
const assert = require('node:assert');

export class GitHubApi implements PlatformApi {
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

    this.pullRequestId = Number(flags.pullRequestId) || context.payload.pull_request?.number || 1
    assert(this.pullRequestId, 'Pull request id was not provided');
  }
  
  async getPullRequest() {
    const octokit = getOctokit(this.authenticationToken);
    const { data } = await  octokit.rest.pulls.get({ 
      ...this.repo,
      pull_number: this.pullRequestId,
    });
    return { targetBranch: data.head.ref, sourceBranch: data.base.ref, user: data.user?.id || '' }
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
  