import json

with open('src/data/products.backup.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

for pid in ['mac-studio-m4-max', 'mac-mini-m4']:
    for p in products:
        if p['id'] == pid:
            print(f"=== {pid} ===")
            print(json.dumps(p, indent=2, ensure_ascii=False))
