import { GitHubApi } from "./github";
import { GitLabApi } from "./gitlab";

type PullRequestResponse = {
  targetBranch: string, 
  sourceBranch: string, 
  user: string | number 
}

export interface PlatformApi {
  pullRequestId: number | string;
  getPullRequest(): Promise<PullRequestResponse>,
  createPullRequestComment(body: string): Promise<any>
}

interface ApiParams {
  authenticationToken: string | undefined;
  owner: string | undefined;
  repo: string | undefined;
  pullRequestId: string | undefined;
  projectId: string | undefined;
}

export type GitHubApiParams = Omit<ApiParams, 'projectId'>;
export type GitLabApiParams = Omit<ApiParams, 'owner' | 'repo'>;

export function getPlatform() {
  if(process.env.GITLAB_CI) {
    return GitHubApi.displayName
  }

  if(process.env.GITHUB_ACTIONS) {
    return GitLabApi.displayName
  }
}

export const platformAPI = {
  [GitHubApi.displayName]: GitHubApi,
  [GitLabApi.displayName]: GitLabApi,
}