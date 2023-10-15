/* eslint-disable unicorn/no-array-reduce */
/* eslint-disable camelcase */
import { PlatformApi, GitLabApiParams } from './api';
import { Gitlab } from '@gitbeaker/rest';

// eslint-disable-next-line unicorn/prefer-module
const assert = require('node:assert');

function getMostFrequentEmail(arr: Array<any>) {  
  const hashmap = arr.reduce((acc, { author_email }: { author_email: string }) => {
    acc[author_email] = (acc[author_email] || 0 ) + 1
    return acc
  },{})
  return Object.keys(hashmap).reduce((a, b) => hashmap[a] > hashmap[b] ? a : b)
}

export class GitLabApi implements PlatformApi {
  static displayName = 'GitLab'

  readonly authenticationToken: string

  projectId: string;
  pullRequestId: string;
  api: InstanceType<typeof Gitlab>
  
  constructor(flags: GitLabApiParams) {  
    this.authenticationToken = flags?.authenticationToken || process.env.CI_JOB_TOKEN  || '';
    assert(this.authenticationToken, 'Authentication token was not provided');

    this.projectId = flags?.projectId || process.env.CI_PROJECT_ID || '3102828';
    assert(this.projectId, 'Gitlab project id was not provided');

    this.pullRequestId = flags.pullRequestId || process.env.CI_MERGE_REQUEST_IID || '1';
    assert(this.pullRequestId, 'Pull request id was not provided');

    this.api = new Gitlab({
      token: this.authenticationToken,
    });
  }

  async getPullRequest() {
    const pullRequestData = await this.api.MergeRequests.show(this.projectId, Number(this.pullRequestId))
    const commitsData = await this.api.MergeRequests.allCommits(this.projectId, Number(this.pullRequestId))
    return { 
      refs: { 
        target_branch: pullRequestData.target_branch as string, 
        source_branch: pullRequestData.source_branch as string
      }, 
      author_email: getMostFrequentEmail(commitsData) 
    };
  }

  async createPullRequestComment(body: string) {
    return this.api.MergeRequestNotes.create(this.projectId, Number(this.pullRequestId), body);
  }
}
  