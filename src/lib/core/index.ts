import { PlatformApi } from "../apis/api";
import { localGetDiff } from "./git/diff";
import axios, { AxiosInstance } from 'axios';

export class CliCore {
  api: PlatformApi;
  instance: AxiosInstance

  constructor(api: PlatformApi) {
    this.api = api;
    this.instance = axios.create({
      baseURL: `https://cli-survey.io`,
    }); 
  }

  async init() {
    const pullRequest = await this.api.getPullRequest();
    const diff = await localGetDiff(pullRequest.sourceBranch, pullRequest.targetBranch);
    console.log(diff)
  }

  collectMetadata () {
    
  }

  getSurvey() {
    return this.instance.get('/survey')
  }

  postMetadata() {
    return this.instance.post('/survey/metadata')
  }

  waitForSurveyResponse() {

  }
}