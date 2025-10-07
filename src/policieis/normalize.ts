// src/policies/normalize.ts
import { RuleDto } from '../common/types/policy.types';

export function normalizeRules(rules: RuleDto[]) {
  const toOp = (op: string) => op.toUpperCase().trim();

  const norm = (r: RuleDto) => ({
    priority: r.priority ?? 1,
    indicator: r.indicator.toUpperCase(),
    period: r.period ?? 14,
    op: toOp(r.op),
    right: {
      type: r.right_type,
      value: r.right_value,
      indicator: r.right_ref?.toUpperCase(),
      period: r.right_period ?? 14,
    },
    action: r.action.toUpperCase(),
    and: r.and?.map(norm),
    or: r.or?.map(norm),
  });

  return rules.map(norm).sort((a, b) => a.priority - b.priority);
}
