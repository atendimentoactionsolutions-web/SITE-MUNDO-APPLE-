with open('src/components/sell/SellWizard.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

header_start = content.find('{/* ── Cabeçalho Principal ── */}')
card_start = content.find('{/* ── Card Principal Interativo ── */}')

if header_start != -1 and card_start != -1:
    content = content[:header_start] + content[card_start:]
    with open('src/components/sell/SellWizard.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Cabecalho removido com sucesso!")
else:
    print("Nao encontrado")
