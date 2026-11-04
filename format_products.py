import json

with open('site_live_products.json', encoding='utf-8', errors='ignore') as f:
    data = json.load(f)

products = data.get('products', [])

# Filter active ones (if active is explicitly false, exclude, though live API already sends active)
active_products = [p for p in products if p.get('active', True)]

categories = {
    'iphone': 'iPhones',
    'mac': 'Mac & MacBooks',
    'ipad': 'iPads',
    'watch': 'Apple Watches',
    'airpods': 'AirPods',
    'accessories': 'Acessórios & Apple TV'
}

cat_grouped = {}
for p in active_products:
    cat = p.get('category', 'accessories').lower()
    if cat not in cat_grouped:
        cat_grouped[cat] = []
    cat_grouped[cat].append(p)

output_lines = []
total = 0

for cat_key, cat_name in categories.items():
    items = cat_grouped.get(cat_key, [])
    if not items:
        continue
    output_lines.append(f"📦 {cat_name.upper()} ({len(items)} produtos):")
    output_lines.append("-" * 45)
    for p in items:
        total += 1
        name = p.get('name', '').strip()
        price = p.get('priceFrom', 0)
        cond = "Novo Lacrado" if p.get('condition') == 'new' else "Seminovo"
        if price and price > 0:
            price_str = f"R$ {price:,.2f}".replace(",", "X").replace(".", ",").replace("X", ".")
        else:
            price_str = "Sob consulta"
        
        # storage options
        storages = p.get('storage')
        if storages and isinstance(storages, list):
            storages_str = " / ".join(storages)
            output_lines.append(f"• {name} ({storages_str}) — A partir de {price_str} [{cond}]")
        else:
            output_lines.append(f"• {name} — A partir de {price_str} [{cond}]")
    output_lines.append("")

summary_header = f"LISTA DE PRODUTOS ATIVOS NO SITE ({total} PRODUTOS ENCONTRADOS):\n" + "=" * 50
final_text = summary_header + "\n\n" + "\n".join(output_lines)

with open('produtos_formatados.txt', 'w', encoding='utf-8') as f:
    f.write(final_text)

print(f"Pronto! Total: {total} produtos formatados.")
