/* eslint-disable camelcase */

import axios, { AxiosInstance } from 'axios';
import { CiPlatformApi, GitLabApiParams } from './platform';
// eslint-disable-next-line unicorn/prefer-module
const assert = require('node:assert');

export class GitLabApi implements CiPlatformApi {
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
  
  mapToStatus({ new_file, renamed_file, deleted_file }: { new_file: boolean, renamed_file: boolean, deleted_file: boolean }) {
    if(new_file) {
      return 'added'
    }
 
    if(renamed_file) {
      return 'renamed'
    }

    if(deleted_file) {
      return 'removed'
    }

    return 'modified'
  }

  async listPullRequestDiff() {
    const { data } = await this.instance.get<string, { data: Array<any> }>(`/merge_requests/${this.pullRequestId}/diffs`);
    return data?.map(({ new_path, diff, new_file, renamed_file, deleted_file  }) => ({
        filename: new_path,
        patch: diff,
        status: this.mapToStatus({ new_file, renamed_file, deleted_file })
      }))
  }

  async createPullRequestComment(body: string) {
    // TODO https://docs.gitlab.com/ee/api/notes.html#create-new-merge-request-note
  }
}
  