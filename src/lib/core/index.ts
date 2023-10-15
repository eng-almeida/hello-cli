import { PlatformApi } from "../apis/api";
import { localGetDiff } from "./git/diff";
import axios, { AxiosInstance } from 'axios';
// eslint-disable-next-line unicorn/prefer-module
const assert = require('node:assert');

export class CliCore {
  api: PlatformApi;
  instance: AxiosInstance
  organizationId: string | undefined
  secretKey: string | undefined
  projectId: string | undefined

  constructor(api: PlatformApi) {
    this.organizationId = process.env.ORGANIZATION_ID;
    this.secretKey = process.env.SECRET_KEY;
    this.projectId = process.env.PROJECT_ID;
    assert(this.organizationId, 'Organization id was not provided');
    assert(this.secretKey, 'Secret key was not provided');
    assert(this.projectId, 'Project id was not provided');

    this.api = api;
    this.instance = axios.create({
      baseURL: `http://localhost:3000`,
    });
  }

  async run() {
    const pullRequest = await this.api.getPullRequest();
    const diff = await localGetDiff(pullRequest.refs.source_branch, pullRequest.refs.target_branch);
    this.getCampaign(pullRequest.author_email)
  }

  async getCampaign(authorEmail: string | null) {
    const { data } = await this.instance.post('/api/public/campaigns', {
      "organizationId": this.organizationId, 
      "secretKey": this.secretKey, 
      "projectId": this.projectId, 
      "user": { 
        "email": authorEmail
      } 
    })
    this.api.createPullRequestComment(`Hey! Here is your survey: ${data.campaign_url}`)
  }

}