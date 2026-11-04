with open('src/components/home/StoreLocationSection.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

header_start = content.find('<div className="text-center max-w-3xl mx-auto mb-14 sm:mb-16 space-y-3">')
header_end = content.find('</div>', content.find('</p>', header_start)) + 6

if header_start != -1 and header_end != -1:
    content = content[:header_start] + content[header_end:]
    # adjust py
    content = content.replace('py-20 sm:py-28', 'py-12 sm:py-16')
    with open('src/components/home/StoreLocationSection.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Cabecalho de localizacao removido com sucesso!")
else:
    print("Bloco nao encontrado")
