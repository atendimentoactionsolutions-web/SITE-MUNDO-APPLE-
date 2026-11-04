import json
import re

with open(r'c:\Users\Mundo Apple\Downloads\comando_antigravity_catalogo_mundo_apple.txt', 'r', encoding='utf-8') as f:
    raw_lines = f.readlines()

# Find the official list bounds
start = 0
end = len(raw_lines)
for i, l in enumerate(raw_lines):
    if 'INÍCIO DA LISTA OFICIAL' in l or ('IN' in l and 'CIO DA LISTA OFICIAL' in l):
        start = i + 1
    if 'FIM DA LISTA OFICIAL' in l:
        end = i

print(f"List lines: {start} to {end}")

current_section = None
current_config = None
configs = [] # {section, config_name, variants: [{color, price}]}

variant_line_re = re.compile(r'^(.*?)\s*[•\u2022\u2013\u2014\-]\s*R\$\s*([\d\.\,]+)$')

for idx in range(start, end):
    line = raw_lines[idx].strip()
    if not line:
        continue
    
    # Check section divider
    if line.startswith('---'):
        continue
    
    # If next line is section divider '---'
    if idx + 1 < len(raw_lines) and raw_lines[idx+1].strip().startswith('---'):
        current_section = line
        print(f"\nSECTION: {current_section}")
        continue
        
    m = variant_line_re.match(line)
    if m:
        color = m.group(1).strip()
        price_str = m.group(2).replace('.', '').replace(',', '.')
        price = float(price_str)
        if current_config:
            current_config['variants'].append({
                'raw_color': color,
                'price': price,
                'raw_line': line
            })
        else:
            print(f"ERROR: Variant without config: {line}")
    else:
        # It's a configuration title
        current_config = {
            'section': current_section,
            'config_name': line,
            'variants': []
        }
        configs.append(current_config)

total_variants = sum(len(c['variants']) for c in configs)
print(f"\nTotal configs parsed: {len(configs)}")
print(f"Total variants parsed: {total_variants}")

# Section counts
sections = {}
for c in configs:
    s = c['section']
    sections[s] = sections.get(s, 0) + 1

print("\nConfigs per section:")
for s, count in sections.items():
    var_count = sum(len(c['variants']) for c in configs if c['section'] == s)
    print(f"  {s}: {count} configs, {var_count} variants")

with open('parsed_whitelist.json', 'w', encoding='utf-8') as f:
    json.dump(configs, f, indent=2, ensure_ascii=False)
