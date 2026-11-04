with open('src/app/iphone/page.tsx', 'r', encoding='utf-8') as f:
    lines = f.readlines()

new_lines = []
skip = False
for line in lines:
    if '<SectionHeading' in line:
        skip = True
        continue
    if skip and '/>' in line:
        skip = False
        continue
    if not skip:
        if 'pt-28 pb-20' in line:
            line = line.replace('pt-28 pb-20', 'pt-20 pb-20')
        new_lines.append(line)

with open('src/app/iphone/page.tsx', 'w', encoding='utf-8') as f:
    f.writelines(new_lines)

print("Removido com sucesso!")
