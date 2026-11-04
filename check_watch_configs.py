import json
import re

with open('parsed_whitelist.json', 'r', encoding='utf-8') as f:
    whitelist = json.load(f)

for c in whitelist:
    if c['section'] == 'APPLE WATCHES':
        print(c['config_name'], '->', [v['raw_color'] for v in c['variants']])
