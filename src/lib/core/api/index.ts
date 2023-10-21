import axios from 'axios';
import { CampaignRules } from '../rules-engine';

const organizationDetails = {
  organizationId: process.env.NOCTUA_ORGANIZATION_ID, 
  secretKey: process.env.NOCTUA_SECRET_KEY,
  projectId: process.env.NOCTUA_PROJECT_ID 
}

const axiosInstance = axios.create({
  baseURL: `http://localhost:3000`,
});

export async function getCampaignsRulesFromProject() {
  const { data } = await axiosInstance.post<CampaignRules[]>('/api/public/campaigns/rules', organizationDetails)
  return data;
}

type Campaign = {
  campaign_url: string
}

export async function getCampaignUrl(campaignIds: string[]) {
  try {
    const { data } = await axiosInstance.post<Campaign>('/api/public/campaigns', {
      ...organizationDetails,
      campaignIds
    })
    return data.campaign_url
  } catch {
    throw new Error("Couldn't get the campaign url");
  }
}