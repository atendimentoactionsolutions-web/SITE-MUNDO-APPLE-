import json
import re

with open('parsed_whitelist.json', 'r', encoding='utf-8') as f:
    whitelist = json.load(f)

# From map_all.py, we have the logic to map each config to product_id
# Let's inspect how each section should be structured into ProductVariant

def parse_config(c):
    cfg = c['config_name']
    sec = c['section']
    variants = c['variants'] # [{raw_color, price}]
    
    parsed_items = []
    
    if sec == 'IPHONES NOVOS':
        # E.g. IPHONE DUO 256GB, IPHONE 18 PRO MAX 256GB
        # storage is at the end: 256GB, 512GB, 1TB, 2TB, 128GB
        m = re.search(r'(128GB|256GB|512GB|1TB|2TB)$', cfg)
        storage = m.group(1) if m else None
        for v in variants:
            parsed_items.append({
                'storage': storage,
                'color': v['raw_color'],
                'price': v['price']
            })
            
    elif sec == 'IPADS':
        # E.g. IPAD PRO M5 11" WIFI 256GB
        # IPAD PRO M5 13" WIFI + CELULAR 512GB
        # SMART FOLIO IPAD AIR 13" -> no storage, raw_color is Denim etc
        if cfg.startswith('SMART FOLIO'):
            for v in variants:
                parsed_items.append({
                    'color': v['raw_color'],
                    'price': v['price']
                })
        else:
            # extract screen size: 11" or 13"
            sz_m = re.search(r'(11"|13")', cfg)
            screenSize = sz_m.group(1) if sz_m else None
            # extract chip/connectivity: WIFI + CELULAR or WIFI
            conn = 'Wi-Fi + Cellular' if ('CELULAR' in cfg or 'CELLULAR' in cfg) else 'Wi-Fi'
            # extract storage
            st_m = re.search(r'(128GB|256GB|512GB|1TB|2TB)$', cfg)
            storage = st_m.group(1) if st_m else None
            for v in variants:
                parsed_items.append({
                    'screenSize': screenSize,
                    'chip': conn,
                    'storage': storage,
                    'color': v['raw_color'],
                    'price': v['price']
                })
                
    elif sec == 'MACBOOKS & MACS':
        # E.g. MACBOOK PRO M5 PRO 16" 24GB 1TB
        # MAC STUDIO M5 MAX 36GB 512GB
        # MAC MINI M4 16GB 256GB
        # IMAC M4 24" 16GB 256GB
        # IMAC M4 24" - 4 SAIDAS 16GB 512GB
        # MACBOOK NEO 13" 8GB 256GB
        sz_m = re.search(r'(13"|14"|15"|16"|24")', cfg)
        screenSize = sz_m.group(1) if sz_m else None
        
        # ram
        ram_m = re.search(r'(\d+GB)\s+(\d+(?:GB|TB))$', cfg)
        if ram_m:
            ram = ram_m.group(1)
            storage = ram_m.group(2)
        else:
            ram = None
            storage = None
            
        # chip
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
            item = {'color': v['raw_color'], 'price': v['price']}
            if screenSize: item['screenSize'] = screenSize
            if chip: item['chip'] = chip
            if ram: item['ram'] = ram
            if storage: item['storage'] = storage
            parsed_items.append(item)
            
    elif sec == 'APPLE WATCHES':
        # E.g. APPLE WATCH ULTRA 3 CAIXA NATURAL 49MM
        # APPLE WATCH S10 46MM
        # APPLE WATCH SE 3 GPS + CELULAR 40MM
        sz_m = re.search(r'(40mm|42mm|44mm|46mm|49mm)', cfg, re.IGNORECASE)
        size = sz_m.group(1).lower() if sz_m else None
        conn = 'GPS + Cellular' if ('CELULAR' in cfg or 'CELLULAR' in cfg) else 'GPS'
        
        # case note if ultra: CAIXA NATURAL / CAIXA PRETA
        case = None
        if 'CAIXA NATURAL' in cfg: case = 'Natural'
        elif 'CAIXA PRETA' in cfg: case = 'Preto'
        
        for v in variants:
            color_name = v['raw_color']
            if case:
                # e.g. color might be pulseira, or color can include case
                pass
            item = {'color': color_name, 'price': v['price']}
            if size: item['size'] = size
            if conn != 'GPS': item['connectivity'] = conn
            if case: item['case'] = case
            parsed_items.append(item)
            
    elif sec in ['AIRPODS', 'ACESSÓRIOS', 'ACESSRIOS']:
        for v in variants:
            parsed_items.append({
                'color': v['raw_color'],
                'price': v['price']
            })
            
    return parsed_items

all_parsed = []
for c in whitelist:
    items = parse_config(c)
    all_parsed.extend(items)

print(f"Total parsed variant items: {len(all_parsed)}")
