import json

with open('src/data/products.backup.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

# Show structure of iphone-duo, macbook-pro-m5, ipad-pro-m5, apple-watch-ultra-4
sample_ids = ['iphone-duo', 'macbook-pro-m5', 'ipad-pro-m5', 'apple-watch-ultra-4', 'apple-watch-s10']
for p in products:
    if p['id'] in sample_ids:
        print(f"=== {p['id']} ===")
        print(json.dumps({k: v for k, v in p.items() if k != 'description'}, indent=2, ensure_ascii=False))
