import json
import re

# Load backups and inputs
with open('src/data/products.backup.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('parsed_whitelist.json', 'r', encoding='utf-8') as f:
    whitelist = json.load(f)

def format_color(raw):
    words = raw.strip().split()
    return ' '.join(w.capitalize() for w in words)

product_variants = {}

for c in whitelist:
    cfg = c['config_name']
    sec = c['section']
    variants = c['variants']
    
    if sec == 'IPHONES NOVOS':
        if cfg.startswith('IPHONE DUO'): pid = 'iphone-duo'
        elif cfg.startswith('IPHONE 18 PRO MAX'): pid = 'iphone-18-pro-max'
        elif cfg.startswith('IPHONE 18 PRO'): pid = 'iphone-18-pro'
        elif cfg.startswith('IPHONE 17 PRO MAX'): pid = 'iphone-17-pro-max'
        elif cfg.startswith('IPHONE 17 PRO'): pid = 'iphone-17-pro'
        elif cfg.startswith('IPHONE 17 AIR'): pid = 'iphone-17-air'
        elif cfg.startswith('IPHONE 17E'): pid = 'iphone-17e'
        elif cfg.startswith('IPHONE 17 '): pid = 'iphone-17'
        elif cfg.startswith('IPHONE 16 '): pid = 'iphone-16'
        elif cfg.startswith('IPHONE 15 '): pid = 'iphone-15'
        else: raise Exception(f"Unmapped iphone: {cfg}")
        
        m = re.search(r'(128GB|256GB|512GB|1TB|2TB)$', cfg)
        storage = m.group(1)
        for v in variants:
            product_variants.setdefault(pid, []).append({
                'storage': storage,
                'color': format_color(v['raw_color']),
                'price': v['price'],
                'available': True
            })

    elif sec == 'IPADS':
        if cfg.startswith('SMART FOLIO'):
            pid = 'smart-folio-ipad-air-13'
            for v in variants:
                product_variants.setdefault(pid, []).append({
                    'color': format_color(v['raw_color']),
                    'price': v['price'],
                    'available': True
                })
        else:
            if cfg.startswith('IPAD PRO M5'): pid = 'ipad-pro-m5'
            elif cfg.startswith('IPAD PRO M4'): pid = 'ipad-pro-m4'
            elif cfg.startswith('IPAD AIR M4'): pid = 'ipad-air-m4'
            elif cfg.startswith('IPAD AIR M3'): pid = 'ipad-air-m3'
            elif cfg.startswith('IPAD MINI 7'): pid = 'ipad-mini-7'
            elif cfg.startswith('IPAD MINI 6'): pid = 'ipad-mini-6'
            elif cfg.startswith('IPAD 11'): pid = 'ipad-11'
            else: raise Exception(f"Unmapped ipad: {cfg}")
            
            sz_m = re.search(r'(11"|13")', cfg)
            screenSize = sz_m.group(1) if sz_m else None
            chip = 'Wi-Fi + Cellular' if ('CELULAR' in cfg or 'CELLULAR' in cfg) else 'Wi-Fi'
            st_m = re.search(r'(128GB|256GB|512GB|1TB|2TB)$', cfg)
            storage = st_m.group(1) if st_m else None
            
            for v in variants:
                item = {
                    'storage': storage,
                    'color': format_color(v['raw_color']),
                    'price': v['price'],
                    'available': True
                }
                if screenSize: item['screenSize'] = screenSize
                item['chip'] = chip
                product_variants.setdefault(pid, []).append(item)

    elif sec == 'MACBOOKS & MACS':
        if cfg.startswith('MACBOOK PRO M5 PRO'): pid = 'macbook-pro-m5-pro'
        elif cfg.startswith('MACBOOK PRO M5 MAX'): pid = 'macbook-pro-m5-max'
        elif cfg.startswith('MACBOOK PRO M5 '): pid = 'macbook-pro-m5'
        elif cfg.startswith('MACBOOK AIR M5'): pid = 'macbook-air-m5'
        elif cfg.startswith('MAC STUDIO M5 MAX'): pid = 'mac-studio-m5-max'
        elif cfg.startswith('MACBOOK PRO M4 PRO'): pid = 'macbook-pro-m4-pro'
        elif cfg.startswith('MACBOOK PRO M4 MAX'): pid = 'macbook-pro-m4-max'
        elif cfg.startswith('MAC MINI M4 PRO'): pid = 'mac-mini-m4-pro'
        elif cfg.startswith('MAC MINI M4 '): pid = 'mac-mini-m4'
        elif cfg.startswith('MAC STUDIO M4 MAX'): pid = 'mac-studio-m4-max'
        elif cfg.startswith('MACBOOK AIR M4'): pid = 'macbook-air-m4'
        elif cfg.startswith('IMAC M4 24'): pid = 'imac-24-m4'
        elif cfg.startswith('MACBOOK NEO 13'): pid = 'macbook-neo-13'
        elif cfg.startswith('MAC MINI M6'): pid = 'mac-mini-m6'
        else: raise Exception(f"Unmapped mac: {cfg}")
        
        sz_m = re.search(r'(13"|14"|15"|16"|24")', cfg)
        screenSize = sz_m.group(1) if sz_m else None
        
        ram_m = re.search(r'(\d+GB)\s+(\d+(?:GB|TB))$', cfg)
        ram = ram_m.group(1) if ram_m else None
        storage = ram_m.group(2) if ram_m else None
        
        chip = None
        if 'M5 PRO' in cfg: chip = 'M5 Pro'
        elif 'M5 MAX' in cfg: chip = 'M5 Max'
        elif 'M5' in cfg: chip = 'M5'
        elif 'M4 PRO' in cfg: chip = 'M4 Pro'
        elif 'M4 MAX' in cfg: chip = 'M4 Max'
        elif 'M4' in cfg: chip = 'M4'
        elif 'M6' in cfg: chip = 'M6'
        elif 'NEO' in cfg: chip = 'A18 Pro'

        for v in variants:
            item = {
                'color': format_color(v['raw_color']),
                'price': v['price'],
                'available': True
            }
            if screenSize: item['screenSize'] = screenSize
            if chip: item['chip'] = chip
            if ram: item['ram'] = ram
            if storage: item['storage'] = storage
            product_variants.setdefault(pid, []).append(item)

    elif sec == 'APPLE WATCHES':
        if cfg.startswith('APPLE WATCH ULTRA 4'): pid = 'apple-watch-ultra-4'
        elif cfg.startswith('APPLE WATCH ULTRA 3'): pid = 'apple-watch-ultra-3'
        elif cfg.startswith('APPLE WATCH ULTRA 2'): pid = 'apple-watch-ultra-2'
        elif cfg.startswith('APPLE WATCH S12'): pid = 'apple-watch-s12'
        elif cfg.startswith('APPLE WATCH S11'): pid = 'apple-watch-s11'
        elif cfg.startswith('APPLE WATCH S10'): pid = 'apple-watch-s10'
        elif cfg.startswith('APPLE WATCH SE 3'): pid = 'apple-watch-se-3'
        elif cfg.startswith('APPLE WATCH SE 2'): pid = 'apple-watch-se-2'
        else: raise Exception(f"Unmapped watch: {cfg}")
        
        sz_m = re.search(r'(40mm|42mm|44mm|46mm|49mm)', cfg, re.IGNORECASE)
        size = sz_m.group(1).lower() if sz_m else None
        conn = 'GPS + Cellular' if ('CELULAR' in cfg or 'CELLULAR' in cfg) else 'GPS'
        
        for v in variants:
            item = {
                'size': size,
                'color': format_color(v['raw_color']),
                'price': v['price'],
                'available': True
            }
            if 'SE' in cfg:
                item['chip'] = conn
            product_variants.setdefault(pid, []).append(item)

    elif sec == 'AIRPODS':
        if cfg == 'AIRPODS MAX 2': pid = 'airpods-max-2'
        elif cfg == 'AIRPODS MAX SMART CASE': pid = 'airpods-max-smart-case'
        elif cfg == 'AIRPODS PRO 3': pid = 'airpods-pro-3'
        elif cfg == 'AIRPODS PRO 2': pid = 'airpods-pro-2'
        elif cfg == 'AIRPODS PRO LIGHTNING': pid = 'airpods-pro-lightning'
        elif cfg == 'AIRPODS 5 WIRELESS CHARGING CASE': pid = 'airpods-5-wireless'
        elif cfg == 'AIRPODS 5': pid = 'airpods-5'
        elif cfg == 'AIRPODS 4 ANC': pid = 'airpods-4-anc'
        elif cfg == 'AIRPODS 4': pid = 'airpods-4'
        elif cfg == 'AIRPODS 3': pid = 'airpods-3'
        elif cfg == 'AIRPODS 2': pid = 'airpods-2'
        else: raise Exception(f"Unmapped airpods: {cfg}")
        
        for v in variants:
            product_variants.setdefault(pid, []).append({
                'color': format_color(v['raw_color']),
                'price': v['price'],
                'available': True
            })

    else:
        if cfg == 'APPLE PENCIL PRO': pid = 'apple-pencil-pro'
        elif cfg == 'APPLE PENCIL 2': pid = 'apple-pencil-2'
        elif cfg == 'APPLE PENCIL COM ADAPTADOR': pid = 'apple-pencil-com-adaptador'
        elif cfg == 'APPLE PENCIL USB-C': pid = 'apple-pencil-usbc'
        elif cfg == 'MAGIC KEYBOARD 11"': pid = 'magic-keyboard-11'
        elif cfg == 'MAGIC KEYBOARD 12.9"': pid = 'magic-keyboard-12-9'
        elif cfg == 'MAGIC KEYBOARD 13"': pid = 'magic-keyboard-13'
        elif cfg == 'MAGIC KEYBOARD TOUCH ID': pid = 'magic-keyboard-touch-id'
        elif cfg == 'MAGIC KEYBOARD TOUCH ID + NUMERICO': pid = 'magic-keyboard-touch-id-numeric'
        elif cfg == 'MAGIC MOUSE 2': pid = 'magic-mouse-2'
        elif cfg == 'MAGIC MOUSE 3': pid = 'magic-mouse-3'
        elif cfg == 'MAGIC TRACKPAD': pid = 'magic-trackpad'
        elif cfg == 'AIRTAG 1 PACK': pid = 'airtag-1pack'
        elif cfg == 'AIRTAG 4 PACK': pid = 'airtag-4pack'
        elif cfg == 'AIRTAG 2 4 PACK': pid = 'airtag-2-4pack'
        elif cfg == 'APPLE TV 4K 64GB': pid = 'apple-tv-4k-64gb'
        elif cfg == 'APPLE TV 4K 128GB': pid = 'apple-tv-4k-128gb'
        elif cfg == 'SMART KEYBOARD': pid = 'smart-keyboard'
        else: raise Exception(f"Unmapped accessory: {cfg}")
        
        for v in variants:
            product_variants.setdefault(pid, []).append({
                'color': format_color(v['raw_color']),
                'price': v['price'],
                'available': True
            })

# Map existing products
existing_map = {p['id']: p for p in products}

# Create missing new products if needed:
# mac-studio-m5-max, mac-mini-m6
if 'mac-studio-m5-max' not in existing_map:
    mac_studio_m5 = {
        "id": "mac-studio-m5-max",
        "slug": "mac-studio-m5-max",
        "name": "Mac Studio M5 Max",
        "category": "mac",
        "subcategory": "Potência Extrema para Estúdios • Chip M5 Max",
        "image": "/images/products/mac/mac-mini-m4-clean.png",
        "priceFrom": 0,
        "condition": "new",
        "chips": ["M5 Max"],
        "ramOptions": ["36GB"],
        "storage": ["512GB"],
        "colors": ["Silver"],
        "variants": [],
        "description": "Performance de ponta para profissionais criativos com chip Apple M5 Max.",
        "warranty": "1 ano de garantia oficial Apple",
        "featured": True,
        "active": True
    }
    products.append(mac_studio_m5)
    existing_map['mac-studio-m5-max'] = mac_studio_m5

if 'mac-mini-m6' not in existing_map:
    mac_mini_m6 = {
        "id": "mac-mini-m6",
        "slug": "mac-mini-m6",
        "name": "Mac mini M6",
        "category": "mac",
        "subcategory": "Design Ultracompacto • Chip M6",
        "image": "/images/products/mac/mac-mini-m4-clean.png",
        "priceFrom": 0,
        "condition": "new",
        "chips": ["M6"],
        "ramOptions": ["16GB"],
        "storage": ["256GB", "512GB"],
        "colors": ["Silver"],
        "variants": [],
        "description": "Nova geração de performance compacta com chip Apple M6.",
        "warranty": "1 ano de garantia oficial Apple",
        "featured": True,
        "active": True
    }
    products.append(mac_mini_m6)
    existing_map['mac-mini-m6'] = mac_mini_m6

# Now update each product in products list:
# If in whitelist:
#   active = True
#   variants = product_variants[pid]
#   priceFrom = min(v['price'] for v in variants)
#   update storage, colors, ramOptions, screenSizes to match variants
# If NOT in whitelist:
#   active = False

deactivated_count = 0
active_count = 0
total_active_variants = 0

for p in products:
    pid = p['id']
    if pid in product_variants:
        p['active'] = True
        vars = product_variants[pid]
        p['variants'] = vars
        p['priceFrom'] = min(v['price'] for v in vars)
        
        # Collect distinct attributes
        storages = list(dict.fromkeys(v['storage'] for v in vars if 'storage' in v and v['storage']))
        if storages:
            p['storage'] = storages
            
        colors = list(dict.fromkeys(v['color'] for v in vars if 'color' in v and v['color']))
        if colors:
            p['colors'] = colors
            
        screens = list(dict.fromkeys(v['screenSize'] for v in vars if 'screenSize' in v and v['screenSize']))
        if screens:
            p['screenSizes'] = screens
            
        rams = list(dict.fromkeys(v['ram'] for v in vars if 'ram' in v and v['ram']))
        if rams:
            p['ramOptions'] = rams
            
        chips = list(dict.fromkeys(v['chip'] for v in vars if 'chip' in v and v['chip']))
        if chips:
            p['chips'] = chips
            
        sizes = list(dict.fromkeys(v['size'] for v in vars if 'size' in v and v['size']))
        if sizes:
            p['sizes'] = sizes
            
        active_count += 1
        total_active_variants += len(vars)
    else:
        p['active'] = False
        deactivated_count += 1

print(f"\nCatalog Summary:")
print(f"Total products in catalog: {len(products)}")
print(f"Active products: {active_count}")
print(f"Deactivated products: {deactivated_count}")
print(f"Total active variants: {total_active_variants}")

# Generate products_override.json
overrides = {}
for p in products:
    pid = p['id']
    if pid in product_variants:
        vars = product_variants[pid]
        overrides[pid] = {
            "active": True,
            "priceFrom": min(v['price'] for v in vars),
            "variants": vars
        }
    else:
        overrides[pid] = {
            "active": False
        }

with open('products_override.json', 'w', encoding='utf-8') as f:
    json.dump(overrides, f, indent=2, ensure_ascii=False)
print("Saved products_override.json successfully!")

# Write updated products.ts
ts_content = 'import { Product } from "@/types/product";\n\nexport const products: Product[] = ' + json.dumps(products, indent=2, ensure_ascii=False) + ';\n'
with open('src/data/products.ts', 'w', encoding='utf-8') as f:
    f.write(ts_content)
print("Saved src/data/products.ts successfully!")
