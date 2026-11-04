with open('src/app/admin/produtos/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

box_start = content.find('{/* Live Supplier Sync Controls Box */}')
feedback_start = content.find('{/* Feedback Alert */}')

if box_start != -1 and feedback_start != -1:
    content = content[:box_start] + content[feedback_start:]
    with open('src/app/admin/produtos/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Caixa de sync removida com sucesso!")
else:
    print("Bloco nao encontrado")
