import json

with open('src/data/products.backup.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for p in products:
    if p['category'] == 'watch':
        print(f"=== {p['id']} ===")
        print(f"sizes: {p.get('sizes')}")
        print(f"colors: {p.get('colors')}")
        print("variants:")
        for v in p.get('variants', []):
            print("  ", v)
