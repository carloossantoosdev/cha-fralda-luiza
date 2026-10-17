# Chá de fraldas da Luiza

Convite e confirmação de presença para o chá de fraldas de Luiza Santos Martins, no dia 5 de dezembro de 2026. Carlos Eduardo e Wilayane Alves assinam o convite. Cada família confirma o nome, o telefone e quantas pessoas vêm; o servidor atribui um tamanho de fralda (RN, P, M ou G).

## Como correr

```bash
npm install
cp .env.example .env
npm run dev
```

No Windows, copie o exemplo com `copy .env.example .env`. Abra o endereço que o Vite mostrar, em geral `http://localhost:5173`.

O build de produção é `npm run build`. A pasta gerada é `dist`.

## Variáveis

| Variável | Uso |
| --- | --- |
| `VITE_SUPABASE_URL` | URL do projeto Supabase |
| `VITE_SUPABASE_ANON_KEY` | Chave anônima (anon). Não use a service role no site |
| `VITE_EVENT_ADDRESS` | Endereço completo, visível no convite |
| `VITE_MAPS_EMBED_QUERY` | Opcional. Query do mapa já codificada. Se ficar vazia, o endereço é codificado no site |
| `VITE_MAPS_EMBED_KEY` | Opcional. Chave da Maps Embed API. Sem ela, o iframe usa o mapa público |
| `VITE_EVENT_TIME` | Horário. Vazio mostra “Horário a confirmar” |
| `VITE_HOST_WHATSAPP` | Opcional. Número com DDI, só dígitos, para o link depois da confirmação |

Enquanto o endereço e o horário não estiverem definidos, a página explica isso em vez de inventar um local.

## Supabase

1. Crie um projeto gratuito em [supabase.com](https://supabase.com).
2. Em **Project Settings → API**, copie a URL e a chave `anon` para o `.env`.
3. Abra **SQL Editor** e execute o arquivo `supabase/migrations/001_rsvps.sql`.

A migration cria:

- `public.rsvps` — uma linha por família
- `public.event_settings` — meta de confirmações (50) e a frase de fallback
- `assign_and_insert_rsvp(...)` — escolhe o tamanho e grava a confirmação

A chave anônima só pode chamar essa função. Não há `SELECT` público: a lista de convidados não sai no site. Os pais veem os dados no **Table Editor** ou exportam CSV por lá.

Se a previsão deixar de ser 50 famílias, ajuste uma única linha:

```sql
update public.event_settings
set expected_rsvps = 40
where id = 1;
```

As metas passam a ser proporcionais: 16% RN, 24% P, 24% G, e o restante em M. Com 50, isso fecha em 8, 12, 12 e 18.

### Como o tamanho é escolhido

No momento do envio, a função conta o que já foi atribuído, compara com a meta e fica com o tamanho de maior déficit. Empate segue a ordem M, G, P, RN. Há um lock na transação para duas confirmações ao mesmo tempo não receberem o mesmo “buraco” da quota.

Um lar recebe um tamanho só, mesmo que `adults_count` seja maior que 1.

Quando todas as metas já foram cumpridas, a linha fica com `quota_fallback = true` e o cartão de agradecimento avisa que um pacote P ou M também ajuda. O texto dessa frase está em `event_settings.fallback_message`.

As primeiras confirmações, com a tabela vazia e meta 50, recebem M. É o tamanho com maior déficit no início.

Um índice único em nome (minúsculas) + telefone (só dígitos) reduz um segundo envio acidental. Pessoas com o mesmo nome e telefones diferentes seguem podendo confirmar.

## Mapa

Com `VITE_EVENT_ADDRESS` preenchido, a página mostra o texto, um link para o Google Maps e um iframe. A chave da Embed API só é necessária se a conta Google exigir restrição. Sem endereço, a seção fica à espera, sem mapa falso.

## Deploy

Na Vercel ou na Netlify:

- comando de build: `npm run build`
- pasta publicada: `dist`
- as mesmas variáveis `VITE_*` no painel, configuradas antes do build

## Fora desta versão

Painel com senha, edição de RSVP, convite por QR e outros idiomas ficam para uma fase seguinte.
