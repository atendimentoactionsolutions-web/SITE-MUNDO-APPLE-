with open('src/components/layout/Header.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Remove the bag block
bag_start = content.find('{/* Shopping Bag / Atendimento */}')
hamburger_start = content.find('{/* Mobile Hamburger Button */}')

if bag_start != -1 and hamburger_start != -1:
    content = content[:bag_start] + content[hamburger_start:]
    # also remove ShoppingBag from imports if clean
    content = content.replace('ShoppingBag, ', '')
    with open('src/components/layout/Header.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Sacola removida com sucesso!")
else:
    print("Bloco nao encontrado")
