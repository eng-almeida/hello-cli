import '@total-typescript/ts-reset'
import { Engine } from 'json-rules-engine'
import { getCondition } from './conditions';
import { minimatch } from 'minimatch'

export enum RuleType {
  MATCH_PATH = 'matchpath',
  MATCH_CONTENT = 'matchcontent',
  PROGRAMMING_LANGUAGE = 'programming_language'
} 

export type Rule = {
  type: RuleType;
  value: string
}

export type CampaignRules = {
  id: string
  rules: Array<Rule[]>
}

const engine = new Engine();

/**
 * "includes" operator: looks for a string in a diff
 */
engine.addOperator<string, string>('includes', (factValue, jsonValue) => {
  if (factValue.length === 0) {
    return false;
  }

  return factValue[0].includes(jsonValue);
});

/**
 * "glob" operator: checks if any file in the given array matches the specified glob pattern.
 */
engine.addOperator<string[], string>('glob', (factValue, jsonValue) => {
  if (factValue.length === 0) {
    return false;
  }

  return factValue.some(fact => minimatch(fact, jsonValue));
});

function mapToRuleProperties(rules: CampaignRules[]) {
  return rules.map(({ rules: andRule }) => ({
    all: andRule.map((orRule) => ({
      any: orRule.map((rule) => getCondition(rule)).filter(Boolean)
    }))
  }))
}

export function createNoctuaEngine(campaignsRules: CampaignRules[]) {
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

  return engine
}