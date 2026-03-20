import type { Condition, Recommendation } from './types';
import { fishingRules } from './rules';

export function getRecommendations(condition: Condition, maxResults: number = 5): Recommendation[] {
  const scored = fishingRules
    .map((rule) => {
      const confidence = rule.match(condition.derived, condition.weather);
      return { rule, confidence };
    })
    .filter(({ confidence }) => confidence > 0)
    .sort((a, b) => b.confidence - a.confidence)
    .slice(0, maxResults);

  return scored.map(({ rule, confidence }) => ({
    id: rule.id,
    title: rule.title,
    lureType: rule.lureType,
    color: rule.color,
    retrieve: rule.retrieve,
    depth: rule.depth,
    confidence: Math.round(confidence),
    reasoning: rule.reasoning,
  }));
}
