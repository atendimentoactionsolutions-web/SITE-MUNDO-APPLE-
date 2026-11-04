with open('src/app/mac/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

start_heading = content.find('<SectionHeading')
end_heading = content.find('/>', start_heading) + 2

if start_heading != -1 and end_heading != -1:
    content = content[:start_heading] + content[end_heading:]
    content = content.replace('pt-28 pb-20', 'pt-20 pb-20')
    content = content.replace('-mt-4', 'mt-2')
    with open('src/app/mac/page.tsx', 'w', encoding='utf-8') as f:
        f.write(content)
    print("Atualizado com sucesso!")
else:
    print("Bloco nao encontrado")
