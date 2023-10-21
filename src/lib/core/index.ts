import { danger, message} from 'danger'
import { engine, mapToRuleProperties } from './rules-engine';
import { getCampaignUrl, getCampaignsRulesFromProject } from './api';
import { dangerWrapper } from './pull-request';

// eslint-disable-next-line unicorn/prefer-top-level-await
(async function() {
  // Get campaigns from the server
  const campaignsRules = await getCampaignsRulesFromProject();
  const rulesProperties =  mapToRuleProperties(campaignsRules);
  const rulesWithConditions = campaignsRules.map((rule, index) => ({
    ...rule,
    conditions: rulesProperties[index]
  }))

  for (const [index] of rulesWithConditions.entries()) {
    if(rulesWithConditions[index].rules.length > 0) {
      engine.addRule({
        conditions: rulesWithConditions[index].conditions,
        event: { 
          type: 'rulesValidation',
          params: {
            campaignId: rulesWithConditions[index].id
          }
        }
      })
    }
  }

  const { getPullRequestData, createComment } = dangerWrapper(danger, message);
  const pullRequestData = await getPullRequestData();

  const { events } = await engine.run(pullRequestData);
  
  const campaignIds = [];
  for (const event of events) {
    if (event.type === 'rulesValidation') {
      campaignIds.push(event.params?.campaignId);
    }
  }

  const campaignUrl = await getCampaignUrl(campaignIds)
  createComment(campaignUrl);
})()
