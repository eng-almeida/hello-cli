import { Rule, RuleType } from ".";

export function getCondition(rule: Rule) {
  const { type, value } = rule;
  switch (type) {
    case RuleType.MATCH_PATH: {
      return {
        fact: "paths",
        operator: "contains",
        value
      }  
    }

    case RuleType.PROGRAMMING_LANGUAGE:  {
      return {
        fact: "languages",
        operator: "contains",
        value
      }
    }

    case RuleType.MATCH_CONTENT:  {
      return {
        fact: "content",
        operator: "includes", // custom operator
        value
      }
    }

    default: {
      return null
    }
  }
}