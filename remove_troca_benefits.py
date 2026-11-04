with open('src/app/troca/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

bg_start = content.find('{/* Benefits Grid */}')
bg_end = content.find('</div>\n        </div>', bg_start)

if bg_start != -1 and bg_end != -1:
    bg_end += len('</div>\n        </div>')
    content = content[:bg_start] + content[bg_end:]
    with open('src/app/troca/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Benefits grid removido de /troca!")
else:
    print("Bloco nao encontrado em /troca")
