import json

with open('src/data/products.backup.json', 'r', encoding='utf-8') as f:
    products = json.load(f)

with open('parsed_whitelist.json', 'r', encoding='utf-8') as f:
    whitelist = json.load(f)

# Let's see the unique parent products implied by the 143 configs.
# We will create a mapping from config_name to parent_product_id.

mapping = {}

for c in whitelist:
    cfg = c['config_name']
    sec = c['section']
    
    # 1. IPHONES NOVOS
    if sec == 'IPHONES NOVOS':
        if cfg.startswith('IPHONE DUO'):
            mapping[cfg] = 'iphone-duo'
        elif cfg.startswith('IPHONE 18 PRO MAX'):
            mapping[cfg] = 'iphone-18-pro-max'
        elif cfg.startswith('IPHONE 18 PRO'):
            mapping[cfg] = 'iphone-18-pro'
        elif cfg.startswith('IPHONE 17 PRO MAX'):
            mapping[cfg] = 'iphone-17-pro-max'
        elif cfg.startswith('IPHONE 17 PRO'):
            mapping[cfg] = 'iphone-17-pro'
        elif cfg.startswith('IPHONE 17 AIR'):
            mapping[cfg] = 'iphone-17-air'
        elif cfg.startswith('IPHONE 17E'):
            mapping[cfg] = 'iphone-17e'
        elif cfg.startswith('IPHONE 17 '):
            mapping[cfg] = 'iphone-17'
        elif cfg.startswith('IPHONE 16 '):
            mapping[cfg] = 'iphone-16'
        elif cfg.startswith('IPHONE 15 '):
            mapping[cfg] = 'iphone-15'
            
    # 2. IPADS
    elif sec == 'IPADS':
        if cfg.startswith('IPAD PRO M5'):
            mapping[cfg] = 'ipad-pro-m5'
        elif cfg.startswith('IPAD PRO M4'):
            mapping[cfg] = 'ipad-pro-m4'
        elif cfg.startswith('IPAD AIR M4'):
            mapping[cfg] = 'ipad-air-m4'
        elif cfg.startswith('IPAD AIR M3'):
            mapping[cfg] = 'ipad-air-m3'
        elif cfg.startswith('SMART FOLIO IPAD AIR 13'):
            mapping[cfg] = 'smart-folio-ipad-air-13'
        elif cfg.startswith('IPAD MINI 7'):
            mapping[cfg] = 'ipad-mini-7'
        elif cfg.startswith('IPAD MINI 6'):
            mapping[cfg] = 'ipad-mini-6'
        elif cfg.startswith('IPAD 11'):
            mapping[cfg] = 'ipad-11'
            
    # 3. MACBOOKS & MACS
    elif sec == 'MACBOOKS & MACS':
        if cfg.startswith('MACBOOK PRO M5 PRO'):
            mapping[cfg] = 'macbook-pro-m5-pro'
        elif cfg.startswith('MACBOOK PRO M5 MAX'):
            mapping[cfg] = 'macbook-pro-m5-max'
        elif cfg.startswith('MACBOOK PRO M5 '):
            mapping[cfg] = 'macbook-pro-m5'
        elif cfg.startswith('MACBOOK AIR M5'):
            mapping[cfg] = 'macbook-air-m5'
        elif cfg.startswith('MAC STUDIO M5 MAX'):
            mapping[cfg] = 'mac-studio-m5-max' # Check if exists or need new
        elif cfg.startswith('MACBOOK PRO M4 PRO'):
            mapping[cfg] = 'macbook-pro-m4-pro'
        elif cfg.startswith('MACBOOK PRO M4 MAX'):
            mapping[cfg] = 'macbook-pro-m4-max'
        elif cfg.startswith('MAC MINI M4 PRO'):
            mapping[cfg] = 'mac-mini-m4-pro'
        elif cfg.startswith('MAC MINI M4 '):
            mapping[cfg] = 'mac-mini-m4'
        elif cfg.startswith('MAC STUDIO M4 MAX'):
            mapping[cfg] = 'mac-studio-m4-max'
        elif cfg.startswith('MACBOOK AIR M4'):
            mapping[cfg] = 'macbook-air-m4'
        elif cfg.startswith('IMAC M4 24'):
            mapping[cfg] = 'imac-24-m4'
        elif cfg.startswith('MACBOOK NEO 13'):
            mapping[cfg] = 'macbook-neo-13'
        elif cfg.startswith('MAC MINI M6'):
            mapping[cfg] = 'mac-mini-m6' # Check if exists or need new
            
    # 4. APPLE WATCHES
    elif sec == 'APPLE WATCHES':
        if cfg.startswith('APPLE WATCH ULTRA 4'):
            mapping[cfg] = 'apple-watch-ultra-4'
        elif cfg.startswith('APPLE WATCH ULTRA 3'):
            mapping[cfg] = 'apple-watch-ultra-3'
        elif cfg.startswith('APPLE WATCH ULTRA 2'):
            mapping[cfg] = 'apple-watch-ultra-2'
        elif cfg.startswith('APPLE WATCH S12'):
            mapping[cfg] = 'apple-watch-s12'
        elif cfg.startswith('APPLE WATCH S11'):
            mapping[cfg] = 'apple-watch-s11'
        elif cfg.startswith('APPLE WATCH S10'):
            mapping[cfg] = 'apple-watch-s10'
        elif cfg.startswith('APPLE WATCH SE 3'):
            mapping[cfg] = 'apple-watch-se-3'
        elif cfg.startswith('APPLE WATCH SE 2'):
            mapping[cfg] = 'apple-watch-se-2'
            
    # 5. AIRPODS
    elif sec == 'AIRPODS':
        if cfg == 'AIRPODS MAX 2':
            mapping[cfg] = 'airpods-max-2'
        elif cfg == 'AIRPODS MAX SMART CASE':
            mapping[cfg] = 'airpods-max-smart-case'
        elif cfg == 'AIRPODS PRO 3':
            mapping[cfg] = 'airpods-pro-3'
        elif cfg == 'AIRPODS PRO 2':
            mapping[cfg] = 'airpods-pro-2'
        elif cfg == 'AIRPODS PRO LIGHTNING':
            mapping[cfg] = 'airpods-pro-lightning'
        elif cfg == 'AIRPODS 5 WIRELESS CHARGING CASE':
            mapping[cfg] = 'airpods-5-wireless'
        elif cfg == 'AIRPODS 5':
            mapping[cfg] = 'airpods-5'
        elif cfg == 'AIRPODS 4 ANC':
            mapping[cfg] = 'airpods-4-anc'
        elif cfg == 'AIRPODS 4':
            mapping[cfg] = 'airpods-4'
        elif cfg == 'AIRPODS 3':
            mapping[cfg] = 'airpods-3'
        elif cfg == 'AIRPODS 2':
            mapping[cfg] = 'airpods-2'
            
    # 6. ACESSÓRIOS & APPLE TV
    else:
        if cfg == 'APPLE PENCIL PRO':
            mapping[cfg] = 'apple-pencil-pro'
        elif cfg == 'APPLE PENCIL 2':
            mapping[cfg] = 'apple-pencil-2'
        elif cfg == 'APPLE PENCIL COM ADAPTADOR':
            mapping[cfg] = 'apple-pencil-com-adaptador'
        elif cfg == 'APPLE PENCIL USB-C':
            mapping[cfg] = 'apple-pencil-usbc'
        elif cfg == 'MAGIC KEYBOARD 11"':
            mapping[cfg] = 'magic-keyboard-11'
        elif cfg == 'MAGIC KEYBOARD 12.9"':
            mapping[cfg] = 'magic-keyboard-12-9'
        elif cfg == 'MAGIC KEYBOARD 13"':
            mapping[cfg] = 'magic-keyboard-13'
        elif cfg == 'MAGIC KEYBOARD TOUCH ID':
            mapping[cfg] = 'magic-keyboard-touch-id'
        elif cfg == 'MAGIC KEYBOARD TOUCH ID + NUMERICO':
            mapping[cfg] = 'magic-keyboard-touch-id-numeric'
        elif cfg == 'MAGIC MOUSE 2':
            mapping[cfg] = 'magic-mouse-2'
        elif cfg == 'MAGIC MOUSE 3':
            mapping[cfg] = 'magic-mouse-3'
        elif cfg == 'MAGIC TRACKPAD':
            mapping[cfg] = 'magic-trackpad'
        elif cfg == 'AIRTAG 1 PACK':
            mapping[cfg] = 'airtag-1pack'
        elif cfg == 'AIRTAG 4 PACK':
            mapping[cfg] = 'airtag-4pack'
        elif cfg == 'AIRTAG 2 4 PACK':
            mapping[cfg] = 'airtag-2-4pack'
        elif cfg == 'APPLE TV 4K 64GB':
            mapping[cfg] = 'apple-tv-4k-64gb'
        elif cfg == 'APPLE TV 4K 128GB':
            mapping[cfg] = 'apple-tv-4k-128gb'
        elif cfg == 'SMART KEYBOARD':
            mapping[cfg] = 'smart-keyboard'

print(f"Total mapped configs: {len(mapping)} / {len(whitelist)}")
missing_mapping = [c['config_name'] for c in whitelist if c['config_name'] not in mapping]
if missing_mapping:
    print("MISSING:", missing_mapping)

target_pids = set(mapping.values())
existing_pids = set(p['id'] for p in products)
print(f"\nUnique target parent products: {len(target_pids)}")
print(f"Target products in existing DB: {len(target_pids.intersection(existing_pids))}")
print(f"Target products NOT in existing DB: {target_pids - existing_pids}")
print(f"Existing products NOT in target (should be deactivated): {existing_pids - target_pids}")
