with open('src/components/layout/Header.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_item = '    { label: "Suporte", href: "/sobre" },\n'
if old_item in content:
    content = content.replace(old_item, '')
    with open('src/components/layout/Header.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Suporte removido com sucesso!")
else:
    print("Item nao encontrado exatamente")
