/* eslint-disable unicorn/no-process-exit */
/* eslint-disable no-process-exit */
import { danger, message} from 'danger'
import { createNoctuaEngine } from './rules-engine';
import { getCampaignUrl, getCampaignsRulesFromProject } from './api';
import { dangerWrapper } from './pull-request';

// eslint-disable-next-line unicorn/prefer-top-level-await
(async function() {
  try {
    // Get campaigns from the server
    const campaignsRules = await getCampaignsRulesFromProject();  
    const engine = createNoctuaEngine(campaignsRules)

    const { extractPullRequestData, createComment } = dangerWrapper(danger, message);
    const pullRequestData = await extractPullRequestData();
    
    const { events } = await engine.run(pullRequestData);
    const campaignIds = events.map(({ params }) => params?.campaignId);

    if(campaignIds.length > 0) {
      try {
        const campaignUrl = await getCampaignUrl(campaignIds);
        createComment(campaignUrl ?? "Couldn't find any suitable campaign.");
      } catch {
        process.exit(2)
      }
    }

  } catch {
    process.exit(1)
  }
})()
