export interface CiPlatformApi {
  /**
   * 
   */
  authenticationToken: string;
  /**
   * 
   */
  pullRequestId: number | string;
  /**
   * 
   */
  listPullRequestDiff(): Promise<any>,
  /**
   * 
   */
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