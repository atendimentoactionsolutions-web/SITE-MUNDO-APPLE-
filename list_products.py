import json

with open('src/data/products.backup.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    print(f"{p.get('id')} | {p.get('name')} | {p.get('category')}")
