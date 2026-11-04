import re

with open('src/data/products.ts', 'r', encoding='utf-8') as f:
    text = f.read()

# Match id: "..." or id: '...'
pattern = re.compile(r'id:\s*["\']([^"\']+)["\']')
slugs = pattern.findall(text)
print(f"Total products in src/data/products.ts: {len(slugs)}")
print("Sample slugs:", slugs[:20])
