import json

# 1. Update products_override.json
with open('products_override.json', 'r', encoding='utf-8') as f:
    ov = json.load(f)

if 'macbook-air-m4' in ov:
    ov['macbook-air-m4']['active'] = False
    print("Set macbook-air-m4 active = False in products_override.json")

with open('products_override.json', 'w', encoding='utf-8') as f:
    json.dump(ov, f, indent=2, ensure_ascii=False)

# 2. Update src/data/products.ts
with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

arr_start = text.find('[\n  {')
arr_end = text.rfind('];')
products = json.loads(text[arr_start:arr_end+1])

for p in products:
    if p['id'] == 'macbook-air-m4':
        p['active'] = False
        print("Set macbook-air-m4 active = False in src/data/products.ts")

new_ts = 'import { Product } from "@/types/product";\n\nexport const products: Product[] = ' + json.dumps(products, indent=2, ensure_ascii=False) + ';\n'
with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(new_ts)

print("Finished successfully.")
