 

import axios, { AxiosInstance } from 'axios';
import { PlatformApi, GitLabApiParams } from './api';
// eslint-disable-next-line unicorn/prefer-module
const assert = require('node:assert');

export class GitLabApi implements PlatformApi {
  readonly authenticationToken: string

  projectId: string;
  pullRequestId: string;
  instance: AxiosInstance
  
  constructor(flags: GitLabApiParams) {  
    this.authenticationToken = flags?.authenticationToken || process.env.CI_JOB_TOKEN  || '';
    assert(this.authenticationToken, 'Authentication token was not provided');

    this.projectId = flags?.projectId || process.env.CI_PROJECT_ID || '3102828';
    assert(this.projectId, 'Gitlab project id was not provided');

    this.pullRequestId = flags.pullRequestId || process.env.CI_MERGE_REQUEST_IID || '1';
    assert(this.pullRequestId, 'Pull request id was not provided');

    this.instance = axios.create({
      baseURL: `https://gitlab.com/api/v4/projects/${this.projectId}`,
      headers: {
        common: {
          'PRIVATE-TOKEN': this.authenticationToken,
        },
      },
    });  
  }

  async getPullRequest() {
    // TODO type GitLabResp
    const { data } = await this.instance.get<any, { data: any }>(`/merge_requests/${this.pullRequestId}`);
    return { targetBranch: data.target_branch, sourceBranch: data.source_branch, user: data.author.id }
  }

  async createPullRequestComment(body: string) {
    // TODO https://docs.gitlab.com/ee/api/notes.html#create-new-merge-request-note
  }
}
  