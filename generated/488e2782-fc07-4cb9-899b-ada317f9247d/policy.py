# -*- coding: utf-8 -*-
# bot: 488e2782-fc07-4cb9-899b-ada317f9247d | user: 6faa39f4-86fa-4ada-a92e-6a52d929b941 | symbol: PTT | version: 10
# generated at: 2025-10-08T06:00:04.776Z

from typing import List, Dict, Any

def evaluate_policy(candles: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    candles: [{'time': ..., 'open': ..., 'high': ..., 'low': ..., 'close': ...}, ...]
    return: {'action': 'BUY'|'SELL'|'HOLD', 'debug': {...}}
    """
    debug = {}
    action = 'HOLD'

    # ------- rules from DB -------
    rules = [
  {
    "priority": 1,
    "indicator": "RSI",
    "period": 14,
    "op": "CROSS_ABOVE",
    "right_type": "VALUE",
    "right_value": 30,
    "action": "BUY"
  }
]
    # -----------------------------

    # ตัวอย่าง logic mock: ถ้า indicator == 'RSI' และ op == 'CROSS_ABOVE' ให้ BUY
    for r in rules:
        if r.get('indicator') == 'RSI' and r.get('op') == 'CROSS_ABOVE':
            action = r.get('action', 'BUY')

    debug['applied_rules'] = rules
    return {'action': action, 'debug': debug}
