with open('src/components/layout/Header.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

target = '''              <p className="text-center text-xs text-zinc-500">
                Mundo Apple Delivery • 1 ano de garantia
              </p>'''

if target in content:
    content = content.replace(target, '')
    with open('src/components/layout/Header.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Texto do rodape do menu mobile removido!")
else:
    print("Target nao encontrado")
