import { danger, message} from 'danger'
import { createNoctuaEngine } from './rules-engine';
import { getCampaignUrl, getCampaignsRulesFromProject } from './api';
import { dangerWrapper } from './pull-request';

// eslint-disable-next-line unicorn/prefer-top-level-await
(async function() {
  // Get campaigns from the server
  const campaignsRules = await getCampaignsRulesFromProject();
  const engine = createNoctuaEngine(campaignsRules)

  const { getPullRequestData, createComment } = dangerWrapper(danger, message);
  const pullRequestData = await getPullRequestData();
  
  const { events } = await engine.run(pullRequestData);
  
  const campaignIds = [];
  for (const event of events) {
    if (event.type === 'rulesValidation') {
      campaignIds.push(event.params?.campaignId);
    }
  }

  try {
    const campaignUrl = await getCampaignUrl(campaignIds);
    createComment(campaignUrl ?? 'Could not find a campaign');
  } catch {
    console.log('Error finding a campaign');
  }
})()
