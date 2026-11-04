import json

with open('src/data/products.backup.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('parsed_whitelist.json', 'r', encoding='utf-8') as f:
    whitelist = json.load(f)

existing_ids = {p['id']: p for p in products}

print("Comparing whitelist with existing products:\n")

# Let's map how each of the 143 configs aligns with existing product IDs
# We will check if there are configs that don't match any existing product
unmatched_configs = []
for c in whitelist:
    cfg = c['config_name']
    sec = c['section']
    # test simple heuristic
    matched = None
    for pid, p in existing_ids.items():
        # normalize
        p_name = p['name'].upper()
        # check
        if cfg.startswith(p_name) or p_name in cfg:
            matched = pid
            break
    if not matched:
        unmatched_configs.append((sec, cfg))

print(f"Total configs without naive match: {len(unmatched_configs)}")
for sec, cfg in unmatched_configs:
    print(f" - [{sec}] {cfg}")
