# Manual de Uso

## Visao Geral

O **PMRv Operacional** e um aplicativo para apoiar o registro operacional, reunindo cinco modulos principais:

- `Assuncao de Servico`
- `Prévia de Registro: Condutores/Vítimas`
- `Relato Policial`
- `Danos Aparentes`
- `Relatorio Completo`

O acesso a cada modulo e feito pelo menu inicial da aplicacao.

## Menu Inicial

Ao abrir o app, voce vera as opcoes principais:

- `Assuncao de Servico`: gera o texto de inicio de servico.
- `Prévia de Registro: Condutores/Vítimas`: registra pessoas, veiculos, relados e fotos.
- `Relato Policial`: monta o texto padrao da ocorrencia.
- `Danos Aparentes`: registra avarias de carro ou motocicleta.
- `Relatorio Completo`: consolida envolvidos e danos em um unico texto.

## 1. Assuncao de Servico

### Objetivo

Gerar rapidamente o texto de inicio de servico da guarnicao.

### Como usar

1. Acesse `Assuncao de Servico`.
2. Se necessario, marque `Recepcao do P19`.
3. Adicione uma viatura:
   - escolha uma viatura pronta
   - ou use a opcao `Manual`
4. Escolha a escala:
   - Ordinaria
   - Apoio
   - Ponte
   - Evento
   - Futebol
   - ou `Manual`
5. Selecione os policiais da viatura.
6. Defina o horario da viatura.
7. Clique em `Confirmar Viatura`.
8. Repita o processo para outras viaturas, se necessario.
9. Defina o `Turno/Horario` geral e a `Localizacao`.
10. Clique em `Gerar Texto`.

### Resultado

O sistema monta o texto final e oferece:

- `Copiar`
- `WhatsApp`

## 2. Prévia de Registro: Condutores/Vítimas

### Objetivo

Registrar os envolvidos no sinistro com dados basicos, relato e fotos.

### Como usar

1. Acesse `Prévia de Registro: Condutores/Vítimas`.
2. Clique em `Adicionar Envolvido`.
3. Preencha:
   - tipo
   - contato
   - nome completo
   - veiculo
   - local
   - relato/dinamica
4. Anexe as fotos do envolvido.
5. Repita para os demais envolvidos.

### Recursos

- `Copiar`: copia o texto geral dos envolvidos.
- `WhatsApp`: envia o texto geral.
- `Enviar Fotos p/ WhatsApp`: abre o compartilhamento das fotos daquele envolvido.
- `Remover Todas`: limpa as fotos do card.

## 3. Relato Policial

### Objetivo

Montar o texto padrao do relato policial da ocorrencia.

### Como usar

1. Acesse `Relato Policial`.
2. Preencha os campos principais:
   - numero SADE
   - viatura
   - rodovia
   - cidade
   - km
   - horario
   - ocorrencia
   - conhecimento
   - sentido
   - subtipo
3. Se houver vitimas, informe a quantidade por gravidade.
4. Ajuste a dinamica se necessario.

### Resultado

O texto e atualizado automaticamente no quadro de relatorio.

### Recursos

- `Limpar`
- `Copiar`
- `WhatsApp`

## 4. Danos Aparentes

### Objetivo

Registrar avarias de veiculos com apoio visual.

### Como usar

1. Acesse `Danos Aparentes`.
2. Escolha o tipo de veiculo:
   - carro
   - motocicleta

### Para carro

1. Escolha a vista:
   - frontal
   - traseira
   - esquerda
   - direita
2. Toque no ponto da peca desejada.
3. Escolha o tipo de dano:
   - amassado
   - riscado
   - quebrado
   - trincado
4. Repita nas demais pecas.
5. Adicione fotos dos danos, se necessario.
6. Clique em `Salvar este veiculo` para incluir no conjunto.
7. Clique em `Gerar Relatorio` para o texto do veiculo atual.
8. Clique em `Gerar Relatorio de Todos` para consolidar os veiculos salvos.

### Para motocicleta

1. Escolha a vista:
   - frente
   - traseira
   - direita
   - esquerda
2. Toque no pino da peca desejada.
3. Escolha o tipo de avaria.
4. Repita nas demais pecas.
5. Adicione fotos dos danos, se necessario.
6. Salve o veiculo e gere o relatorio quando concluir.

### Recursos

- `Copiar`
- `WhatsApp`
- `Compartilhar Fotos`
- `Remover Todas`

## 5. Relatorio Completo

### Objetivo

Consolidar os dados de envolvidos e danos aparentes em um unico texto.

### Como usar

1. Acesse `Relatorio Completo`.
2. Se desejar, anexe ate `2 fotos do local`.
3. Clique em `Gerar Relatorio Completo`.

### Resultado

O sistema gera um texto consolidado com:

- envolvidos
- dados principais
- danos aparentes registrados

### Recursos

- `Copiar`
- `WhatsApp`: envia somente o texto
- `Baixar texto (.txt)`: baixa o relatorio em arquivo `.txt`
- `Compartilhar so as fotos`: compartilha as fotos dos envolvidos e as fotos do local

### Observacoes sobre fotos

Ao compartilhar as fotos pelo Relatorio Completo, o sistema organiza o pacote com:

- fotos dos envolvidos
- nome do veiculo de cada envolvido
- quantidade de fotos por veiculo
- quantidade de fotos do local

Em alguns navegadores mobile, a opcao pode abrir o compartilhamento nativo. Em navegadores sem suporte, o sistema pode baixar os arquivos.

## Fluxo Recomendado de Uso

Para um atendimento completo, o fluxo mais indicado e:

1. `Assuncao de Servico`
2. `Prévia de Registro: Condutores/Vítimas`
3. `Relato Policial`
4. `Danos Aparentes`
5. `Relatorio Completo`

## Observacoes Gerais

- O app foi pensado para uso rapido em campo.
- Sempre revise os textos antes de copiar ou compartilhar.
- Quando usar fotos, confirme se elas ficaram visiveis no card antes de gerar o relatorio.
- Para funcionamento offline, abra o app via navegador depois de instalado/cacheado como PWA.
