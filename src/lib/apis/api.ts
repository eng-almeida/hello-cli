import { GitHubApi } from "./github";
import { GitLabApi } from "./gitlab";

type NormalizedPullRequestData = { 
  author_email: string | null, 
  refs: { 
    target_branch: string, 
    source_branch: string 
  } 
}

export interface PlatformApi {
  pullRequestId: number | string;
  getPullRequest(): Promise<NormalizedPullRequestData>,
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

export const platformAPI = {
  [GitHubApi.displayName]: GitHubApi,
  [GitLabApi.displayName]: GitLabApi,
}