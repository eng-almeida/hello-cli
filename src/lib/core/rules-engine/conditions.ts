import { Rule, RuleType } from ".";

/**
 * Converts a Rule object into a corresponding Condition object based on the rule type.
 *
 * @param {Rule} rule - The input rule object with properties 'type' and 'value'.
 * @returns {Condition | null} - The generated Condition object or null if the rule type is unrecognized.
 */
export function getCondition(rule: Rule) {
  const { type, value } = rule;
  switch (type) {
    case RuleType.MATCH_PATH: {
      return {
        fact: "paths",
        operator: "glob",
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