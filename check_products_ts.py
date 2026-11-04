import json

# Read products.ts
with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Since products.ts is TS with `export const products: Product[] = [...]`,
# let's parse the JSON part or extract it.
start_idx = text.find('[')
end_idx = text.rfind(']')
if start_idx != -1 and end_idx != -1:
    json_str = text[start_idx:end_idx+1]
    # In case there are trailing commas or comments, let's test if json.loads works
    try:
        products = json.loads(json_str)
        print(f"Successfully parsed products.ts as JSON! Found {len(products)} products.")
        
        # Save a backup immediately
        with open('src/data/products.backup.json', 'w', encoding='utf-8') as b:
            json.dump(products, b, indent=2, ensure_ascii=False)
        print("Created backup at src/data/products.backup.json")
    except Exception as e:
        print("JSON parse error:", e)
