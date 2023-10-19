import { PlatformApi } from "../apis/api";
import { localGetDiff } from "./git/diff";
import axios, { AxiosInstance } from 'axios';

const { spawn } = require('node:child_process');


// eslint-disable-next-line unicorn/prefer-module
const assert = require('node:assert');

export class CliCore {
  instance: AxiosInstance
  organizationId: string | undefined
  secretKey: string | undefined
  projectId: string | undefined

  constructor() {
    this.organizationId = process.env.ORGANIZATION_ID;
    this.secretKey = process.env.SECRET_KEY;
    this.projectId = process.env.PROJECT_ID;
    // assert(this.organizationId, 'Organization id was not provided');
    // assert(this.secretKey, 'Secret key was not provided');
    // assert(this.projectId, 'Project id was not provided');

    
    // this.api = api;
    this.instance = axios.create({
      baseURL: `http://localhost:3000`,
    });
  }

  async run() {
    // const pullRequest = await this.api.getPullRequest();
    // const diff = await localGetDiff(pullRequest.refs.source_branch, pullRequest.refs.target_branch);
    // this.getCampaign(pullRequest.author_email)


    // // Spawn a new process for danger-js
    // const dangerProcess = spawn(dangerCommand, dangerArgs, {
    //   env: { ...process.env, ...envVariables }
    // });

    // // Handle output from the danger process
    // dangerProcess.stdout.on('data', (data: any) => {
    //   console.log(`danger stdout: ${data}`);
    // });

    // dangerProcess.stderr.on('data', (data: any) => {
    //   console.error(`stderr: ${data}`);
    // });

    // // Handle the danger process exit event
    // dangerProcess.on('close', (code: any) => {
    //   console.log(`danger-js process exited with code ${code}`);
    // });
    
  }

  async getCampaign(authorEmail: string | null) {
    // const { data } = await this.instance.post('/api/public/campaigns', {
    //   "organizationId": this.organizationId, 
    //   "secretKey": this.secretKey, 
    //   "projectId": this.projectId, 
    //   "user": { 
    //     "email": authorEmail
    //   } 
    // })
    // this.api.createPullRequestComment(`Hey! Here is your survey: ${data.campaign_url}`)
  }

}