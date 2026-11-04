import json

with open('parsed_whitelist.json', 'r', encoding='utf-8') as f:
    whitelist = json.load(f)

print("ALL 143 CONFIGURATIONS:")
for i, c in enumerate(whitelist):
    print(f"[{i+1}] ({c['section']}) {c['config_name']} -> {len(c['variants'])} variants")
