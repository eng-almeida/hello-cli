import '@total-typescript/ts-reset'
import { Engine } from 'json-rules-engine'
import { getCondition } from './conditions';

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

export const engine = new Engine();
// custom operator to support content diff
engine.addOperator<string, string>('includes', (factValue, jsonValue) => {
  if (factValue.length === 0) {
    return false;
  }

  return factValue[0].includes(jsonValue);
})  

export function mapToRuleProperties(rules: CampaignRules[]) {
  return rules.map(({ rules: andRule }) => ({
    all: andRule.map((orRule) => ({
      any: orRule.map((rule) => getCondition(rule)).filter(Boolean)
    }))
  }))
}