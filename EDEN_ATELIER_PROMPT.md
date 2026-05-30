/goal Construa o Eden Atelier — um SaaS multi-tenant completo de gestão para designers de interiores e designers gráficos autônomos. Trabalhe de forma autônoma do início ao fim: crie o projeto Next.js, todas as migrations SQL, todos os componentes, todas as páginas, e itere até que `npm run build` execute sem nenhum erro de TypeScript ou ESLint. Não pare para perguntar nada — todas as decisões já estão tomadas neste prompt.

# CONTEXTO

O Eden Atelier é parte do ecossistema Eden Technology. É o terceiro produto vertical da família, ao lado do Eden Beauty (salões) e Eden Mind (psicologia). Diferente dos anteriores que operam por hora marcada / sessão recorrente, o Atelier é orientado a **projetos** — multi-etapas, com pagamentos parcelados, fortemente visuais, com revisões e clientes frequentemente remotos.

**Público-alvo principal:**
- Designers de interiores autônomos (incluindo nichos como infantil, comercial, residencial)
- Designers gráficos autônomos
- Profissionais com forte presença online que captam pelo Instagram e atendem Brasil + exterior

**Parceira ativa de referência:** Mariana Muratori (Studio Mura) — designer de interiores infantil em Brasília, atende remoto Brasil e brasileiros no exterior.

# STACK TÉCNICA (FIXA — NÃO ALTERAR)

```json
{
  "name": "eden-atelier",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint"
  },
  "dependencies": {
    "@supabase/ssr": "^0.10.0",
    "@supabase/supabase-js": "^2.101.1",
    "next": "16.2.2",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "recharts": "^3.8.1"
  },
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "dotenv": "^17.4.2",
    "eslint": "^9",
    "eslint-config-next": "16.2.2",
    "tailwindcss": "^4",
    "tsx": "^4.21.0",
    "typescript": "^5"
  }
}
```

**IMPORTANTE — Next.js 16:**
Este projeto usa Next.js 16, que tem breaking changes. Antes de escrever qualquer código relacionado ao Next, leia os docs em `node_modules/next/dist/docs/` para garantir uso correto das APIs (App Router, server components assíncronos, `cookies()` async, etc).

# FILOSOFIA VISUAL — "CONCRETO E CURVA"

O Eden Atelier é a tradução em interface da arquitetura de Brasília — modernismo brasileiro de Oscar Niemeyer, integrado ao cerrado e à filosofia biofílica do design contemporâneo brasileiro (referência: ambientes do CASACOR Brasília).

**Princípios:**

1. **A curva como assinatura** — Niemeyer dizia "de curvas é feito o universo". Cards, headers, divisores e elementos decorativos usam curvas suaves ao invés de retas duras. Border-radius generosos (14-24px). Linhas divisórias podem ter um arco sutil.

2. **Vão livre** — Niemeyer construiu Brasília com espaços abertos monumentais. Aqui isso vira espaçamento generoso, ar entre seções, respiro visual. Padding maior que o usual. Densidade de informação baixa, leitura confortável.

3. **Concreto bruto, mas leve** — concreto não é cinza neutro. É um cinza-areia quente, com textura sutil. Backgrounds podem ter um leve grão (noise SVG).

4. **Cerrado como paleta** — neutros pigmentados, não cinzas frios. Inspiração nas cores da paleta Suvinil Cerrado e revestimentos Portobello Terralma:
   - Concreto claro (creme quente, base)
   - Jatobá (terracota profundo, brand primary)
   - Ipê amarelo (acento ocasional para destaque)
   - Verde-cerrado seco (folhagem suave)
   - Barro / ferrugem (status warning)
   - Branco-osso (surface)

5. **Sem nada escuro demais** — a sidebar é creme/concreto claro, NÃO marrom escuro. Branco e seus tons quentes dominam. Letras sobre fundos claros. Texto escuro sobre concreto, não o contrário.

6. **Tipografia editorial** — fontes que dialogam com o gestual do croqui de Niemeyer e a sofisticação editorial de revistas de arquitetura:
   - **Fraunces** (Google Fonts) — display, títulos. Serifa contemporânea com personalidade orgânica.
   - **Inter** (Google Fonts) — corpo. Sans humanista, clean, alta legibilidade.

7. **Integração com a natureza** — pequenos elementos botânicos sutis (linhas de folhas, traços orgânicos) como ornamentação ocasional, não decorativos pesados.

8. **Monumentalidade contida** — números grandes em serif, com personalidade. Headings com peso, mas sem ser agressivos.

# ENTREGÁVEIS — ARQUIVOS A CRIAR

Crie EXATAMENTE estes arquivos com EXATAMENTE este conteúdo.

---

## 1. ARQUIVOS DE CONFIGURAÇÃO

### `package.json`
Use o JSON exato listado acima na seção "Stack Técnica".

### `tsconfig.json`
```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

### `next.config.ts`
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "*.supabase.co" },
    ],
  },
};

export default nextConfig;
```

### `postcss.config.mjs`
```javascript
export default {
  plugins: { "@tailwindcss/postcss": {} },
};
```

### `eslint.config.mjs`
```javascript
import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];

export default eslintConfig;
```

### `.env.local.example`
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

### `.gitignore`
```
node_modules
.next
.env.local
.env*.local
*.log
.DS_Store
```

---

## 2. BANCO DE DADOS — MIGRATION COMPLETA

### `supabase/migrations/20260522000001_eden_atelier_schema.sql`

```sql
-- ================================================================
-- EDEN ATELIER — Schema inicial completo
-- ================================================================

-- 1. STUDIOS (multi-tenant root)
CREATE TABLE IF NOT EXISTS studios (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id           uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_studio             text NOT NULL,
  slug                    text UNIQUE,
  tipo                    text DEFAULT 'interiores', -- interiores | grafico | misto
  especialidade           text, -- ex: "design infantil", "branding"
  bio                     text,
  logo_url                text,
  capa_url                text,
  telefone                text,
  email                   text,
  instagram               text,
  endereco                text,
  cidade                  text,
  estado                  text,
  atende_remoto           boolean DEFAULT true,
  atende_presencial       boolean DEFAULT true,
  atende_internacional    boolean DEFAULT false,
  moeda_principal         text DEFAULT 'BRL', -- BRL | USD | EUR
  valor_hora              numeric(10,2) DEFAULT 0,
  valor_m2_interiores     numeric(10,2),
  taxa_revisao_extra      numeric(10,2),
  prazo_aprovacao_dias    int DEFAULT 3,
  cor_marca               text DEFAULT '#8B4513',
  created_at              timestamptz DEFAULT now()
);

-- 2. PROFILES
CREATE TABLE IF NOT EXISTS profiles (
  id              uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  studio_id       uuid REFERENCES studios(id) ON DELETE SET NULL,
  nome            text,
  role            text DEFAULT 'admin', -- admin | cliente
  created_at      timestamptz DEFAULT now()
);

-- 3. CLIENTES
CREATE TABLE IF NOT EXISTS clientes (
  id                  uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id           uuid REFERENCES studios(id) ON DELETE CASCADE,
  auth_user_id        uuid REFERENCES auth.users(id),
  nome                text NOT NULL,
  email               text,
  telefone            text,
  empresa             text,
  cpf_cnpj            text,
  endereco            text,
  cidade              text,
  estado              text,
  pais                text DEFAULT 'Brasil',
  moeda               text DEFAULT 'BRL',
  como_conheceu       text,
  tags                text[], -- ['quarto-infantil', 'expatriado', 'reforma']
  status              text DEFAULT 'lead', -- lead | qualificado | ativo | inativo | encerrado
  total_projetos      int DEFAULT 0,
  valor_total_pago    numeric(12,2) DEFAULT 0,
  observacoes         text,
  created_at          timestamptz DEFAULT now()
);

-- 4. PROJETOS
CREATE TABLE IF NOT EXISTS projetos (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  cliente_id              uuid REFERENCES clientes(id) ON DELETE CASCADE,
  nome                    text NOT NULL,
  tipo                    text DEFAULT 'interiores', -- interiores | grafico
  categoria               text, -- "quarto-infantil" | "branding" | "comercial" | etc
  ambiente                text, -- para interiores: "quarto", "sala", "cozinha", etc
  area_m2                 numeric(8,2), -- para interiores
  modalidade              text DEFAULT 'remoto', -- remoto | presencial | hibrido
  descricao               text,
  briefing_resumo         text,
  status                  text DEFAULT 'aguardando_briefing',
  -- status: aguardando_briefing | briefing_recebido | em_desenvolvimento | em_revisao | aprovado | em_entrega | concluido | cancelado | pausado
  prioridade              text DEFAULT 'media', -- baixa | media | alta
  valor_total             numeric(12,2),
  moeda                   text DEFAULT 'BRL',
  data_inicio             date,
  data_entrega_prevista   date,
  data_entrega_real       date,
  limite_revisoes         int DEFAULT 3,
  revisoes_usadas         int DEFAULT 0,
  publicar_portfolio      boolean DEFAULT false,
  capa_url                text,
  publicado_em            timestamptz,
  created_at              timestamptz DEFAULT now(),
  updated_at              timestamptz DEFAULT now()
);

-- 5. ETAPAS (fases do projeto: briefing, moodboard, desenvolvimento, etc)
CREATE TABLE IF NOT EXISTS etapas (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  projeto_id              uuid REFERENCES projetos(id) ON DELETE CASCADE,
  ordem                   int NOT NULL,
  nome                    text NOT NULL,
  descricao               text,
  status                  text DEFAULT 'pendente', -- pendente | em_andamento | aguardando_aprovacao | aprovado | rejeitado
  percentual_pagamento    numeric(5,2) DEFAULT 0,
  valor                   numeric(10,2),
  pago                    boolean DEFAULT false,
  data_pagamento          date,
  prazo                   date,
  enviado_em              timestamptz,
  aprovado_em             timestamptz,
  feedback_cliente        text,
  created_at              timestamptz DEFAULT now()
);

-- 6. BRIEFINGS (formulário estruturado preenchido pelo cliente)
CREATE TABLE IF NOT EXISTS briefings (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  projeto_id              uuid REFERENCES projetos(id) ON DELETE CASCADE,
  -- Comuns
  objetivo                text,
  publico                 text,
  estilo_preferido        text,
  cores_preferidas        text,
  cores_evitar            text,
  referencias_visuais     text, -- texto descritivo + links
  prazo_desejado          text,
  orcamento_estimado      text,
  -- Interiores
  ambiente_descricao      text,
  medidas_ambiente        text, -- texto livre com medidas
  pontos_eletrica         text,
  iluminacao_natural      text,
  mobiliario_atual        text,
  necessidades_funcionais text,
  -- Grafico
  marca_atual             text,
  valores_marca           text,
  diferenciais            text,
  concorrentes            text,
  -- Livre
  observacoes_extras      text,
  enviado_em              timestamptz,
  created_at              timestamptz DEFAULT now()
);

-- 7. ARQUIVOS (uploads de qualquer tipo: moodboard, plantas, fotos, renders)
CREATE TABLE IF NOT EXISTS arquivos (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  projeto_id              uuid REFERENCES projetos(id) ON DELETE CASCADE,
  etapa_id                uuid REFERENCES etapas(id) ON DELETE SET NULL,
  nome                    text NOT NULL,
  tipo                    text DEFAULT 'arquivo', -- moodboard | planta | render | foto_cliente | entregavel | referencia | outro
  categoria               text, -- antes | depois | conceito | desenvolvimento | final
  url                     text NOT NULL,
  thumbnail_url           text,
  tamanho_kb              int,
  descricao               text,
  visivel_cliente         boolean DEFAULT true,
  created_at              timestamptz DEFAULT now()
);

-- 8. MOODBOARDS (galeria de referências por projeto)
CREATE TABLE IF NOT EXISTS moodboards (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  projeto_id              uuid REFERENCES projetos(id) ON DELETE CASCADE,
  titulo                  text NOT NULL,
  descricao               text,
  visivel_cliente         boolean DEFAULT true,
  created_at              timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS moodboard_itens (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  moodboard_id            uuid REFERENCES moodboards(id) ON DELETE CASCADE,
  imagem_url              text NOT NULL,
  legenda                 text,
  ordem                   int DEFAULT 0,
  fornecedor_id           uuid,
  created_at              timestamptz DEFAULT now()
);

-- 9. FORNECEDORES (lojas, marcas, contatos — biblioteca pessoal do designer)
CREATE TABLE IF NOT EXISTS fornecedores (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  nome                    text NOT NULL,
  categoria               text, -- moveis | iluminacao | decoracao | acabamentos | tipografia | grafica | impressao | outro
  cidade                  text,
  site                    text,
  instagram               text,
  contato_nome            text,
  contato_telefone        text,
  contato_email           text,
  observacoes             text,
  faixa_preco             text, -- "$" | "$$" | "$$$"
  avaliacao               int DEFAULT 0, -- 0 a 5
  created_at              timestamptz DEFAULT now()
);

-- 10. PROPOSTAS
CREATE TABLE IF NOT EXISTS propostas (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  cliente_id              uuid REFERENCES clientes(id) ON DELETE CASCADE,
  projeto_id              uuid REFERENCES projetos(id) ON DELETE SET NULL,
  numero                  text,
  titulo                  text NOT NULL,
  escopo                  text,
  valor_total             numeric(12,2) NOT NULL,
  moeda                   text DEFAULT 'BRL',
  forma_pagamento         text,
  prazo_estimado_dias     int,
  validade_dias           int DEFAULT 7,
  status                  text DEFAULT 'rascunho', -- rascunho | enviada | aprovada | rejeitada | expirada
  link_compartilhavel     text,
  enviada_em              timestamptz,
  visualizada_em          timestamptz,
  respondida_em           timestamptz,
  created_at              timestamptz DEFAULT now()
);

-- 11. TRANSAÇÕES FINANCEIRAS
CREATE TABLE IF NOT EXISTS transacoes (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  projeto_id              uuid REFERENCES projetos(id) ON DELETE SET NULL,
  etapa_id                uuid REFERENCES etapas(id) ON DELETE SET NULL,
  cliente_id              uuid REFERENCES clientes(id) ON DELETE SET NULL,
  tipo                    text NOT NULL, -- receita | despesa
  descricao               text,
  valor                   numeric(12,2) NOT NULL,
  moeda                   text DEFAULT 'BRL',
  data                    date NOT NULL DEFAULT CURRENT_DATE,
  forma_pagamento         text,
  categoria               text,
  recebido                boolean DEFAULT true,
  created_at              timestamptz DEFAULT now()
);

-- 12. MENSAGENS (chat designer ↔ cliente, por projeto)
CREATE TABLE IF NOT EXISTS mensagens (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  projeto_id              uuid REFERENCES projetos(id) ON DELETE CASCADE,
  remetente_user_id       uuid REFERENCES auth.users(id),
  remetente_tipo          text, -- designer | cliente
  texto                   text NOT NULL,
  anexo_arquivo_id        uuid REFERENCES arquivos(id),
  lida                    boolean DEFAULT false,
  created_at              timestamptz DEFAULT now()
);

-- ================================================================
-- FUNÇÃO AUXILIAR — multi-tenant
-- ================================================================
CREATE OR REPLACE FUNCTION get_my_studio_id()
RETURNS uuid LANGUAGE sql SECURITY DEFINER STABLE AS $$
  SELECT studio_id FROM profiles WHERE id = auth.uid() LIMIT 1;
$$;

-- ================================================================
-- TRIGGER — atualiza projeto.updated_at
-- ================================================================
CREATE OR REPLACE FUNCTION update_projeto_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_projeto_updated ON projetos;
CREATE TRIGGER trg_projeto_updated
BEFORE UPDATE ON projetos
FOR EACH ROW EXECUTE FUNCTION update_projeto_timestamp();

-- ================================================================
-- TRIGGER — incrementa cliente.total_projetos quando projeto concluido
-- ================================================================
CREATE OR REPLACE FUNCTION incrementar_projetos_cliente()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'concluido' AND OLD.status <> 'concluido' THEN
    UPDATE clientes SET total_projetos = total_projetos + 1 WHERE id = NEW.cliente_id;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_projeto_concluido ON projetos;
CREATE TRIGGER trg_projeto_concluido
AFTER UPDATE OF status ON projetos
FOR EACH ROW EXECUTE FUNCTION incrementar_projetos_cliente();

-- ================================================================
-- RLS — Row Level Security
-- ================================================================
ALTER TABLE studios          ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles         ENABLE ROW LEVEL SECURITY;
ALTER TABLE clientes         ENABLE ROW LEVEL SECURITY;
ALTER TABLE projetos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE etapas           ENABLE ROW LEVEL SECURITY;
ALTER TABLE briefings        ENABLE ROW LEVEL SECURITY;
ALTER TABLE arquivos         ENABLE ROW LEVEL SECURITY;
ALTER TABLE moodboards       ENABLE ROW LEVEL SECURITY;
ALTER TABLE moodboard_itens  ENABLE ROW LEVEL SECURITY;
ALTER TABLE fornecedores     ENABLE ROW LEVEL SECURITY;
ALTER TABLE propostas        ENABLE ROW LEVEL SECURITY;
ALTER TABLE transacoes       ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensagens        ENABLE ROW LEVEL SECURITY;

-- Studios
DROP POLICY IF EXISTS "studios_own" ON studios;
CREATE POLICY "studios_own" ON studios FOR ALL USING (owner_user_id = auth.uid());

DROP POLICY IF EXISTS "studios_public_by_slug" ON studios;
CREATE POLICY "studios_public_by_slug" ON studios FOR SELECT USING (slug IS NOT NULL);

-- Profiles
DROP POLICY IF EXISTS "profiles_self" ON profiles;
CREATE POLICY "profiles_self" ON profiles FOR ALL USING (id = auth.uid());

-- Clientes
DROP POLICY IF EXISTS "clientes_all" ON clientes;
CREATE POLICY "clientes_all" ON clientes FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "clientes_self_read" ON clientes;
CREATE POLICY "clientes_self_read" ON clientes FOR SELECT USING (auth_user_id = auth.uid());

-- Projetos
DROP POLICY IF EXISTS "projetos_all" ON projetos;
CREATE POLICY "projetos_all" ON projetos FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "projetos_cliente_read" ON projetos;
CREATE POLICY "projetos_cliente_read" ON projetos FOR SELECT USING (
  cliente_id IN (SELECT id FROM clientes WHERE auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "projetos_portfolio_publico" ON projetos;
CREATE POLICY "projetos_portfolio_publico" ON projetos FOR SELECT USING (publicar_portfolio = true);

-- Etapas
DROP POLICY IF EXISTS "etapas_all" ON etapas;
CREATE POLICY "etapas_all" ON etapas FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "etapas_cliente_read" ON etapas;
CREATE POLICY "etapas_cliente_read" ON etapas FOR SELECT USING (
  projeto_id IN (
    SELECT id FROM projetos WHERE cliente_id IN (
      SELECT id FROM clientes WHERE auth_user_id = auth.uid()
    )
  )
);

-- Briefings
DROP POLICY IF EXISTS "briefings_all" ON briefings;
CREATE POLICY "briefings_all" ON briefings FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "briefings_cliente" ON briefings;
CREATE POLICY "briefings_cliente" ON briefings FOR ALL USING (
  projeto_id IN (
    SELECT id FROM projetos WHERE cliente_id IN (
      SELECT id FROM clientes WHERE auth_user_id = auth.uid()
    )
  )
);

-- Arquivos
DROP POLICY IF EXISTS "arquivos_all" ON arquivos;
CREATE POLICY "arquivos_all" ON arquivos FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "arquivos_cliente_read" ON arquivos;
CREATE POLICY "arquivos_cliente_read" ON arquivos FOR SELECT USING (
  visivel_cliente = true AND projeto_id IN (
    SELECT id FROM projetos WHERE cliente_id IN (
      SELECT id FROM clientes WHERE auth_user_id = auth.uid()
    )
  )
);

-- Moodboards
DROP POLICY IF EXISTS "moodboards_all" ON moodboards;
CREATE POLICY "moodboards_all" ON moodboards FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "moodboard_itens_via_moodboard" ON moodboard_itens;
CREATE POLICY "moodboard_itens_via_moodboard" ON moodboard_itens FOR ALL USING (
  moodboard_id IN (SELECT id FROM moodboards WHERE studio_id = get_my_studio_id())
);

-- Fornecedores
DROP POLICY IF EXISTS "fornecedores_all" ON fornecedores;
CREATE POLICY "fornecedores_all" ON fornecedores FOR ALL USING (studio_id = get_my_studio_id());

-- Propostas
DROP POLICY IF EXISTS "propostas_all" ON propostas;
CREATE POLICY "propostas_all" ON propostas FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "propostas_via_link" ON propostas;
CREATE POLICY "propostas_via_link" ON propostas FOR SELECT USING (link_compartilhavel IS NOT NULL);

-- Transacoes
DROP POLICY IF EXISTS "transacoes_all" ON transacoes;
CREATE POLICY "transacoes_all" ON transacoes FOR ALL USING (studio_id = get_my_studio_id());

-- Mensagens
DROP POLICY IF EXISTS "mensagens_all" ON mensagens;
CREATE POLICY "mensagens_all" ON mensagens FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "mensagens_cliente" ON mensagens;
CREATE POLICY "mensagens_cliente" ON mensagens FOR ALL USING (
  projeto_id IN (
    SELECT id FROM projetos WHERE cliente_id IN (
      SELECT id FROM clientes WHERE auth_user_id = auth.uid()
    )
  )
);
```

---

## 3. ESTILO GLOBAL — `src/app/globals.css`

```css
@import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500;9..144,600;9..144,700&family=Inter:wght@300;400;500;600;700&display=swap');
@import "tailwindcss";

/* ─── Design Tokens — Eden Atelier ───────────────────────── */
/* Conceito: Concreto e Curva. Arquitetura de Brasília + Cerrado + Biofilia */

:root {
  /* ─ Bases — Concreto claro e papel ─ */
  --bg:            #F5F1EA;  /* concreto creme, base */
  --bg-subtle:     #EBE5DA;  /* concreto mais profundo */
  --surface:       #FBF8F3;  /* branco osso, surface principal */
  --surface-2:     #F1ECE3;
  --border:        #E0D8C8;
  --border-strong: #C9BFAB;

  /* ─ Brand — Jatobá (terracota profundo, inspirado no cerrado) ─ */
  --brand-900:     #2E1A0E;
  --brand-800:     #4A2A14;
  --brand-700:     #6B3D1E;  /* jatobá escuro — botões primários */
  --brand-600:     #8B5028;
  --brand-500:     #A36A3A;  /* terracota principal */
  --brand-400:     #BC8B5F;
  --brand-300:     #D4AC85;
  --brand-200:     #E8CDB0;
  --brand-100:     #F2E2CD;
  --brand-50:      #F9F0E2;

  /* ─ Accent — Ipê amarelo (acento ocasional, destaque) ─ */
  --accent-500:    #C9A227;  /* ipê amarelo seco */
  --accent-300:    #E0C168;
  --accent-100:    #F4E8B8;

  /* ─ Cerrado verde — folhagem seca ─ */
  --leaf-700:      #4A5A3A;
  --leaf-500:      #6B7E54;  /* verde-cerrado */
  --leaf-300:      #9AAB82;
  --leaf-100:      #DDE2CE;

  /* ─ Concreto — cinzas quentes neutros ─ */
  --concrete-900:  #2A2520;
  --concrete-700:  #574E44;
  --concrete-500:  #847A6D;
  --concrete-300:  #B5AB9D;
  --concrete-100:  #E2DCD0;

  /* ─ Texto ─ */
  --text-primary:   #2A1F14;
  --text-secondary: #5A4A3A;
  --text-muted:     #8B7E6D;
  --text-disabled:  #B8AC9C;
  --text-inverse:   #FBF8F3;

  /* ─ Status — Cerrado vivo ─ */
  --success:       #4A5A3A;
  --success-bg:    #E5EBD4;
  --warning:       #B57318;  /* barro */
  --warning-bg:    #F8E8C8;
  --danger:        #8B3A26;  /* ferrugem profundo */
  --danger-bg:     #F2D5CC;
  --info:          #3D5466;  /* azul-niemeyer suave */
  --info-bg:       #DDE5ED;

  /* ─ Sombras — quentes, sutis ─ */
  --shadow-sm:  0 1px 2px 0 rgb(74 42 20 / 0.04);
  --shadow:     0 1px 3px 0 rgb(74 42 20 / 0.06), 0 1px 2px -1px rgb(74 42 20 / 0.06);
  --shadow-md:  0 4px 8px -2px rgb(74 42 20 / 0.07), 0 2px 4px -2px rgb(74 42 20 / 0.06);
  --shadow-lg:  0 12px 24px -6px rgb(74 42 20 / 0.08), 0 4px 8px -4px rgb(74 42 20 / 0.06);

  /* ─ Raios — generosos, evocando curvas ─ */
  --radius-sm: 8px;
  --radius:    14px;
  --radius-md: 18px;
  --radius-lg: 24px;
  --radius-xl: 32px;

  --sidebar-w: 256px;
}

*, *::before, *::after { box-sizing: border-box; }
html { height: 100%; }
body {
  height: 100%;
  background-color: var(--bg);
  color: var(--text-primary);
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 14px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

/* ─ Background com textura de concreto sutil ─ */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 0;
  opacity: 0.4;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 0.42 0 0 0 0 0.32 0 0 0 0 0.18 0 0 0 0.05 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* ─── Tipografia ─────────────────────────────────────────── */
.font-display {
  font-family: 'Fraunces', Georgia, serif;
  font-weight: 400;
  font-variation-settings: "opsz" 144, "SOFT" 50;
  letter-spacing: -0.02em;
}

h1 {
  font-family: 'Fraunces', Georgia, serif;
  font-size: 2rem;
  font-weight: 400;
  line-height: 1.15;
  letter-spacing: -0.02em;
  color: var(--text-primary);
  font-variation-settings: "opsz" 144, "SOFT" 50;
}
h2 { font-family: 'Fraunces', Georgia, serif; font-size: 1.375rem; font-weight: 400; line-height: 1.3; letter-spacing: -0.015em; color: var(--text-primary); }
h3 { font-size: 1rem; font-weight: 600; line-height: 1.4; color: var(--text-primary); }
h4 { font-size: 0.875rem; font-weight: 600; line-height: 1.4; }

/* ─── Scrollbar ──────────────────────────────────────────── */
::-webkit-scrollbar { width: 8px; height: 8px; }
::-webkit-scrollbar-track { background: transparent; }
::-webkit-scrollbar-thumb { background: var(--border-strong); border-radius: 99px; }
::-webkit-scrollbar-thumb:hover { background: var(--concrete-500); }

/* ─── Cards — bordas curvas generosas ─────────────────────── */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  position: relative;
  z-index: 1;
}

.card-feature {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-xl);
  box-shadow: var(--shadow);
  position: relative;
  overflow: hidden;
}

/* Curva decorativa no topo dos cards-feature (homenagem a Niemeyer) */
.card-feature::before {
  content: '';
  position: absolute;
  top: 0; left: 0; right: 0;
  height: 3px;
  background: linear-gradient(90deg, transparent, var(--brand-500), transparent);
  opacity: 0.5;
}

/* ─── Inputs ─────────────────────────────────────────────── */
.input, .textarea, .select {
  width: 100%;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.625rem 0.875rem;
  font-size: 0.875rem;
  color: var(--text-primary);
  outline: none;
  font-family: inherit;
  transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
}
.input::placeholder, .textarea::placeholder { color: var(--text-disabled); }
.input:hover, .textarea:hover, .select:hover { border-color: var(--border-strong); }
.input:focus, .textarea:focus, .select:focus {
  border-color: var(--brand-600);
  box-shadow: 0 0 0 3px rgb(163 106 58 / 0.12);
  background: var(--surface);
}
.textarea { resize: vertical; min-height: 96px; }
.select {
  appearance: none;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23847A6D' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 0.875rem center;
  padding-right: 2.5rem;
}

/* ─── Buttons ────────────────────────────────────────────── */
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: var(--radius);
  padding: 0.5rem 1.125rem;
  border: 1px solid transparent;
  cursor: pointer;
  transition: all 0.2s;
  white-space: nowrap;
  text-decoration: none;
  font-family: inherit;
  letter-spacing: 0.005em;
}
.btn:disabled { opacity: 0.5; cursor: not-allowed; }

.btn-primary {
  background: var(--brand-700);
  color: var(--text-inverse);
  border-color: var(--brand-700);
  box-shadow: var(--shadow-sm);
}
.btn-primary:hover:not(:disabled) {
  background: var(--brand-800);
  border-color: var(--brand-800);
  box-shadow: var(--shadow);
  transform: translateY(-1px);
}

.btn-secondary {
  background: var(--surface);
  color: var(--text-primary);
  border-color: var(--border-strong);
}
.btn-secondary:hover:not(:disabled) {
  background: var(--bg-subtle);
  border-color: var(--concrete-500);
}

.btn-ghost {
  background: transparent;
  color: var(--text-secondary);
}
.btn-ghost:hover:not(:disabled) {
  background: var(--bg-subtle);
  color: var(--text-primary);
}

.btn-accent {
  background: var(--accent-500);
  color: var(--brand-900);
  border-color: var(--accent-500);
}
.btn-accent:hover:not(:disabled) {
  background: #B89220;
  border-color: #B89220;
}

.btn-danger {
  background: var(--danger-bg);
  color: var(--danger);
  border-color: #E5BFB0;
}
.btn-danger:hover:not(:disabled) { background: #EBC8BC; }

.btn-lg { padding: 0.75rem 1.5rem; font-size: 0.9375rem; border-radius: var(--radius-md); }

/* ─── Badge ──────────────────────────────────────────────── */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.25rem 0.625rem;
  border-radius: 99px;
  border: 1px solid transparent;
  letter-spacing: 0.02em;
  text-transform: lowercase;
}
.badge-brand   { background: var(--brand-100);  color: var(--brand-700);  border-color: var(--brand-200); }
.badge-accent  { background: var(--accent-100); color: #876600;           border-color: var(--accent-300); }
.badge-leaf    { background: var(--leaf-100);   color: var(--leaf-700);   border-color: #C8D2B5; }
.badge-green   { background: var(--success-bg); color: var(--success);    border-color: #C8D2B5; }
.badge-yellow  { background: var(--warning-bg); color: var(--warning);    border-color: #E8C97A; }
.badge-red     { background: var(--danger-bg);  color: var(--danger);     border-color: #E5BFB0; }
.badge-blue    { background: var(--info-bg);    color: var(--info);       border-color: #C1CFDD; }
.badge-gray    { background: var(--bg-subtle);  color: var(--text-muted); border-color: var(--border); }

/* ─── Label ──────────────────────────────────────────────── */
.label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--text-secondary);
  margin-bottom: 0.4rem;
  letter-spacing: 0.005em;
}

/* ─── Table ──────────────────────────────────────────────── */
.table { width: 100%; border-collapse: collapse; }
.table th {
  background: var(--bg-subtle);
  color: var(--text-muted);
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.75rem 1.5rem;
  text-align: left;
  border-bottom: 1px solid var(--border);
}
.table td {
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
  vertical-align: middle;
}
.table tbody tr:last-child td { border-bottom: none; }
.table tbody tr:hover td { background: var(--bg-subtle); }

/* ─── Avatar ─────────────────────────────────────────────── */
.avatar {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  font-weight: 600;
  flex-shrink: 0;
  font-family: 'Fraunces', serif;
  font-variation-settings: "opsz" 144;
}
.avatar-sm { width: 28px; height: 28px; font-size: 0.75rem; }
.avatar-md { width: 40px; height: 40px; font-size: 0.9375rem; }
.avatar-lg { width: 56px; height: 56px; font-size: 1.25rem; }
.avatar-brand { background: var(--brand-200); color: var(--brand-800); }
.avatar-leaf  { background: var(--leaf-100);  color: var(--leaf-700); }
.avatar-gray  { background: var(--concrete-100); color: var(--concrete-700); }

/* ─── Divider — uma linha curva sutil (homenagem ao croqui) ─ */
.divider {
  border: none;
  height: 1px;
  background: var(--border);
  margin: 0;
}
.divider-curve {
  border: none;
  height: 24px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 400 24' fill='none'%3E%3Cpath d='M0 12 Q 100 4, 200 12 T 400 12' stroke='%23C9BFAB' stroke-width='1' fill='none'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: center;
  background-size: 100% 100%;
  margin: 1rem 0;
}

/* ─── Empty state ────────────────────────────────────────── */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  text-align: center;
  color: var(--text-muted);
}
.empty-state-icon { font-size: 2.5rem; margin-bottom: 0.75rem; opacity: 0.5; }
.empty-state-title { font-family: 'Fraunces', serif; font-size: 1.125rem; color: var(--text-secondary); margin-bottom: 0.375rem; }
.empty-state-desc  { font-size: 0.8125rem; max-width: 320px; }

/* ─── Page header ────────────────────────────────────────── */
.page-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1.5rem;
  margin-bottom: 2rem;
}
.page-title { color: var(--text-primary); }
.page-subtitle { font-size: 0.9375rem; color: var(--text-muted); margin-top: 0.25rem; }

/* ─── Stat card — números monumentais ─────────────────────── */
.stat-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.75rem;
  position: relative;
  overflow: hidden;
}
.stat-card::after {
  content: '';
  position: absolute;
  bottom: -40px;
  right: -40px;
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: radial-gradient(circle, var(--brand-50), transparent 70%);
  pointer-events: none;
}
.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: 500;
}
.stat-value {
  font-family: 'Fraunces', serif;
  font-size: 2.25rem;
  font-weight: 400;
  letter-spacing: -0.025em;
  color: var(--text-primary);
  line-height: 1.05;
  font-variation-settings: "opsz" 144;
}
.stat-delta { font-size: 0.8125rem; margin-top: 0.625rem; }
.stat-delta-up   { color: var(--success); }
.stat-delta-down { color: var(--danger); }

/* ─── Sidebar nav item (sidebar CLARA, texto escuro) ──────── */
.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--text-secondary);
  text-decoration: none;
  transition: all 0.18s;
  cursor: pointer;
  border: none;
  background: transparent;
  width: 100%;
  text-align: left;
  font-family: inherit;
}
.nav-item:hover { color: var(--text-primary); background: var(--bg-subtle); }
.nav-item.active {
  color: var(--brand-800);
  background: var(--brand-100);
  font-weight: 600;
}
.nav-item.active .nav-item-icon { color: var(--brand-700); }
.nav-item-icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
  color: var(--concrete-500);
  transition: color 0.18s;
}
.nav-item:hover .nav-item-icon { color: var(--text-secondary); }

.nav-group-label {
  font-size: 0.6875rem;
  font-weight: 600;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.1em;
  padding: 0 0.875rem;
  margin: 1.25rem 0 0.5rem;
}

/* ─── Kanban — colunas com curva inferior ─────────────────── */
.kanban-column {
  background: var(--bg-subtle);
  border-radius: var(--radius-lg);
  padding: 1rem;
  min-height: 400px;
}
.kanban-column-header {
  font-family: 'Fraunces', serif;
  font-size: 0.9375rem;
  color: var(--text-primary);
  margin-bottom: 0.875rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border);
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.kanban-count {
  font-family: 'Inter', sans-serif;
  font-size: 0.75rem;
  color: var(--text-muted);
  background: var(--surface);
  padding: 0.125rem 0.5rem;
  border-radius: 99px;
}
.kanban-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 0.875rem 1rem;
  margin-bottom: 0.625rem;
  cursor: pointer;
  transition: all 0.18s;
}
.kanban-card:hover {
  border-color: var(--brand-300);
  transform: translateY(-1px);
  box-shadow: var(--shadow);
}

/* ─── Moodboard grid ─────────────────────────────────────── */
.moodboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.875rem;
}
.moodboard-item {
  position: relative;
  aspect-ratio: 1;
  border-radius: var(--radius);
  overflow: hidden;
  background: var(--bg-subtle);
  border: 1px solid var(--border);
  cursor: pointer;
  transition: transform 0.2s;
}
.moodboard-item:hover { transform: scale(1.02); }
.moodboard-item img { width: 100%; height: 100%; object-fit: cover; }

/* ─── Portfolio público (página /[slug]) ──────────────────── */
.portfolio-hero {
  background: linear-gradient(180deg, var(--surface), var(--bg));
  padding: 5rem 2rem 4rem;
  text-align: center;
  border-bottom: 1px solid var(--border);
  position: relative;
  overflow: hidden;
}
.portfolio-hero::before {
  content: '';
  position: absolute;
  bottom: -1px; left: 0; right: 0;
  height: 40px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 40' fill='none' preserveAspectRatio='none'%3E%3Cpath d='M0 40 Q 300 0, 600 20 T 1200 30 L 1200 40 Z' fill='%23F5F1EA'/%3E%3C/svg%3E");
  background-size: 100% 100%;
}
.portfolio-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1.5rem;
  padding: 3rem 2rem;
  max-width: 1200px;
  margin: 0 auto;
}
.portfolio-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-lg);
  overflow: hidden;
  transition: transform 0.25s, box-shadow 0.25s;
  cursor: pointer;
}
.portfolio-card:hover { transform: translateY(-4px); box-shadow: var(--shadow-lg); }
.portfolio-card-image {
  aspect-ratio: 4 / 3;
  background: var(--bg-subtle);
  position: relative;
  overflow: hidden;
}
.portfolio-card-image img { width: 100%; height: 100%; object-fit: cover; }
.portfolio-card-content { padding: 1.25rem 1.5rem 1.5rem; }
.portfolio-card-title {
  font-family: 'Fraunces', serif;
  font-size: 1.0625rem;
  color: var(--text-primary);
  margin-bottom: 0.375rem;
}
.portfolio-card-meta {
  font-size: 0.8125rem;
  color: var(--text-muted);
}

/* ─── Chat (mensagens) ────────────────────────────────────── */
.chat-msg {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.chat-msg-bubble {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  max-width: 70%;
  font-size: 0.875rem;
}
.chat-msg.from-me { flex-direction: row-reverse; }
.chat-msg.from-me .chat-msg-bubble {
  background: var(--brand-100);
  border-color: var(--brand-200);
  color: var(--brand-900);
}

/* ─── Etapa do projeto (timeline visual) ──────────────────── */
.etapa-card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 3px solid var(--concrete-300);
  border-radius: var(--radius);
  padding: 1rem 1.25rem;
  margin-bottom: 0.625rem;
}
.etapa-card.status-em-andamento  { border-left-color: var(--accent-500); background: var(--accent-100); border-color: var(--accent-300); }
.etapa-card.status-aprovado      { border-left-color: var(--success); }
.etapa-card.status-rejeitado     { border-left-color: var(--danger); }
.etapa-card.status-aguardando    { border-left-color: var(--info); }
```

---

## 4. LIB — `src/lib/`

### `src/lib/supabase/client.ts`
```typescript
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
```

### `src/lib/supabase/server.ts`
```typescript
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll(); },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
}
```

### `src/lib/supabase/studio.ts`
```typescript
import { createClient } from "./server";

export async function getStudio() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;
  const { data } = await supabase
    .from("studios")
    .select("*")
    .eq("owner_user_id", user.id)
    .single();
  return data ?? null;
}

export async function getStudioId(): Promise<string | null> {
  const s = await getStudio();
  if (!s?.id) return null;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    await supabase
      .from("profiles")
      .upsert({ id: user.id, studio_id: s.id }, { onConflict: "id" });
  }
  return s.id;
}

export async function getStudioBySlug(slug: string) {
  const supabase = await createClient();
  const { data } = await supabase
    .from("studios")
    .select("*")
    .eq("slug", slug)
    .single();
  return data ?? null;
}

export function generateSlug(nome: string): string {
  return nome
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 50);
}
```

### `src/lib/format.ts`
```typescript
export function formatPhone(raw: string): string {
  const digits = raw.replace(/\D/g, "").slice(0, 11);
  if (digits.length <= 2) return digits.length ? `(${digits}` : "";
  if (digits.length <= 6) return `(${digits.slice(0, 2)}) ${digits.slice(2)}`;
  if (digits.length <= 10) return `(${digits.slice(0, 2)}) ${digits.slice(2, 6)}-${digits.slice(6)}`;
  return `(${digits.slice(0, 2)}) ${digits.slice(2, 7)}-${digits.slice(7)}`;
}

export function formatCurrency(value: number | null | undefined, moeda: string = "BRL"): string {
  const locale = moeda === "USD" ? "en-US" : moeda === "EUR" ? "de-DE" : "pt-BR";
  return new Intl.NumberFormat(locale, { style: "currency", currency: moeda }).format(value ?? 0);
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const [y, m, d] = dateStr.split("-");
  return `${d}/${m}/${y}`;
}

export function formatDateLong(dateStr: string | null | undefined): string {
  if (!dateStr) return "—";
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("pt-BR", {
    day: "numeric", month: "long", year: "numeric"
  });
}

export function getInitials(name: string | null | undefined): string {
  if (!name) return "?";
  return name.split(" ").filter(Boolean).slice(0, 2).map(n => n[0]).join("").toUpperCase();
}

export function diasDesde(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const data = new Date(dateStr + "T00:00:00");
  const hoje = new Date();
  return Math.floor((hoje.getTime() - data.getTime()) / 86400000);
}

export function diasAte(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const data = new Date(dateStr + "T00:00:00");
  const hoje = new Date();
  return Math.ceil((data.getTime() - hoje.getTime()) / 86400000);
}

export function statusProjetoLabel(status: string): string {
  const map: Record<string, string> = {
    aguardando_briefing: "Aguardando briefing",
    briefing_recebido: "Briefing recebido",
    em_desenvolvimento: "Em desenvolvimento",
    em_revisao: "Em revisão",
    aprovado: "Aprovado",
    em_entrega: "Em entrega",
    concluido: "Concluído",
    cancelado: "Cancelado",
    pausado: "Pausado",
  };
  return map[status] || status;
}

export function statusProjetoBadge(status: string): string {
  const map: Record<string, string> = {
    aguardando_briefing: "badge-gray",
    briefing_recebido: "badge-blue",
    em_desenvolvimento: "badge-accent",
    em_revisao: "badge-yellow",
    aprovado: "badge-leaf",
    em_entrega: "badge-brand",
    concluido: "badge-green",
    cancelado: "badge-red",
    pausado: "badge-gray",
  };
  return map[status] || "badge-gray";
}
```

---

## 5. MIDDLEWARE — `src/middleware.ts`

```typescript
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

const PAINEL_PREFIXES = [
  "/dashboard", "/projetos", "/clientes", "/propostas",
  "/financeiro", "/moodboards", "/fornecedores",
  "/portfolio", "/relatorios", "/configuracoes",
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  let response = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll(); },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          response = NextResponse.next({ request });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  const { data: { user } } = await supabase.auth.getUser();
  const isPainel = PAINEL_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + "/"));

  if (isPainel && !user) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (pathname === "/login" && user) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|favicon\\.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
```

---

## 6. ESTRUTURA DE PASTAS COMPLETA

```
src/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                                # Landing pública mínima
│   ├── globals.css
│   ├── not-found.tsx
│   ├── login/
│   │   ├── page.tsx
│   │   └── actions.ts
│   ├── cadastro/
│   │   ├── page.tsx
│   │   └── actions.ts
│   ├── setup-studio/
│   │   └── page.tsx                            # Onboarding wizard 4 etapas
│   ├── recuperar-senha/
│   │   └── page.tsx
│   ├── (painel)/
│   │   ├── layout.tsx
│   │   ├── dashboard/page.tsx
│   │   ├── projetos/
│   │   │   ├── page.tsx                        # Kanban + lista
│   │   │   ├── novo/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx                    # Detalhe completo do projeto
│   │   │       ├── editar/page.tsx
│   │   │       ├── briefing/page.tsx
│   │   │       ├── etapas/page.tsx
│   │   │       ├── arquivos/page.tsx
│   │   │       ├── moodboard/page.tsx
│   │   │       └── chat/page.tsx
│   │   ├── clientes/
│   │   │   ├── page.tsx
│   │   │   ├── novo/page.tsx
│   │   │   └── [id]/
│   │   │       ├── page.tsx
│   │   │       └── editar/page.tsx
│   │   ├── propostas/
│   │   │   ├── page.tsx
│   │   │   ├── nova/page.tsx
│   │   │   └── [id]/page.tsx
│   │   ├── moodboards/page.tsx                 # Visão geral de todos os moodboards
│   │   ├── fornecedores/
│   │   │   ├── page.tsx
│   │   │   └── novo/page.tsx
│   │   ├── portfolio/page.tsx                  # Gestão do portfólio público
│   │   ├── financeiro/page.tsx
│   │   ├── relatorios/page.tsx
│   │   └── configuracoes/page.tsx
│   └── [slug]/                                 # Portfólio público + portal cliente
│       ├── page.tsx                            # Portfólio público
│       ├── briefing/page.tsx                   # Formulário público de pré-briefing
│       ├── proposta/[id]/page.tsx              # Proposta pública compartilhável
│       └── cliente/                            # Área logada do cliente
│           ├── page.tsx
│           └── projetos/[id]/page.tsx
├── components/
│   ├── EdenAtelierLogo.tsx
│   ├── Sidebar.tsx
│   ├── Topbar.tsx
│   ├── MobileBottomNav.tsx
│   ├── FormCard.tsx
│   ├── StudioSetupGuard.tsx
│   ├── ProjetoKanban.tsx
│   ├── ProjetoTimeline.tsx
│   ├── EtapaCard.tsx
│   ├── BriefingForm.tsx
│   ├── MoodboardGrid.tsx
│   ├── MoodboardUploader.tsx
│   ├── ArquivosGaleria.tsx
│   ├── ChatProjeto.tsx
│   ├── PropostaPreview.tsx
│   ├── PhoneInput.tsx
│   ├── StatusMenu.tsx
│   ├── Toaster.tsx
│   ├── SkeletonPage.tsx
│   ├── CurvaDecorativa.tsx                     # SVG decorativo Niemeyer-inspired
│   └── charts/
│       └── DashboardCharts.tsx
├── lib/
│   ├── format.ts
│   └── supabase/
│       ├── client.ts
│       ├── server.ts
│       └── studio.ts
└── middleware.ts
```

---

## 7. ESPECIFICAÇÕES DE COMPONENTES

### `src/components/EdenAtelierLogo.tsx`

Logo do produto. Curva orgânica que evoca os vão livres do Palácio do Planalto.

```typescript
export default function EdenAtelierLogo({ size = 32, color = "var(--brand-700)" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 40 40" fill="none">
      {/* Curva ascendente — homenagem ao gestual de Niemeyer */}
      <path
        d="M4 28 Q 14 8, 20 14 T 36 12"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
      />
      {/* Ponto/sol */}
      <circle cx="20" cy="14" r="2" fill={color} />
    </svg>
  );
}
```

### `src/components/Sidebar.tsx`

Cliente. Sidebar fixa à esquerda no desktop (256px), drawer no mobile.

**IMPORTANTE — sidebar CLARA, NÃO escura:**
- Background: `var(--surface)` (branco-osso)
- Borda direita: `1px solid var(--border)`
- Texto secundário escuro
- Item ativo: background `var(--brand-100)`, texto `var(--brand-800)`, fonte semibold

Lê dados do studio via Supabase. Mostra no topo:
- EdenAtelierLogo + nome "Eden Atelier" (font-display)
- Divisor curvo (`.divider-curve`)
- Avatar circular com iniciais do studio + nome do studio (truncate) + tipo (interiores/grafico/misto) abaixo em texto pequeno

Detecta item ativo via `usePathname()`.

**Grupos e items (SVGs inline, strokeWidth 1.75, viewBox 0 0 24 24):**

```typescript
const navGroups = [
  {
    label: null,
    items: [
      { href: "/dashboard", label: "Início", icon: "home" },
      { href: "/projetos", label: "Projetos", icon: "folder" },
    ],
  },
  {
    label: "Atendimento",
    items: [
      { href: "/clientes", label: "Clientes", icon: "users" },
      { href: "/propostas", label: "Propostas", icon: "file-text" },
    ],
  },
  {
    label: "Criação",
    items: [
      { href: "/moodboards", label: "Moodboards", icon: "layout-grid" },
      { href: "/fornecedores", label: "Fornecedores", icon: "store" },
      { href: "/portfolio", label: "Portfólio", icon: "image" },
    ],
  },
  {
    label: "Gestão",
    items: [
      { href: "/financeiro", label: "Financeiro", icon: "dollar-sign" },
      { href: "/relatorios", label: "Relatórios", icon: "bar-chart" },
    ],
  },
  {
    label: "Sistema",
    items: [
      { href: "/configuracoes", label: "Configurações", icon: "settings" },
    ],
  },
];
```

Rodapé da sidebar: link "Ver portfólio público" → `/{slug}` (abre em nova aba) + botão "Sair".

No mobile: escuta evento `toggle-sidebar` no `window`.

### `src/components/MobileBottomNav.tsx`

5 items horizontais visíveis apenas em `lg:hidden`. Fixed bottom, background `var(--surface)`, border-top suave.

Items:
- Início → `/dashboard`
- Projetos → `/projetos`
- Clientes → `/clientes`
- Financeiro → `/financeiro`
- Mais (abre drawer com Moodboards, Fornecedores, Portfólio, Propostas, Relatórios, Configurações, Sair)

### `src/components/Topbar.tsx`

Topbar dos painéis. Props: `title: string`, `subtitle?: string`, `breadcrumb?: Array<{href?: string; label: string}>`.

Layout:
- Esquerda: breadcrumb (se houver) em texto pequeno + h1 do título com font-display, opcional subtitle abaixo
- Direita: slot para botões de ação (children prop)
- Mobile: hambúrguer que dispara `toggle-sidebar`

Padding `px-8 py-6`. Border-bottom `1px solid var(--border)`.

### `src/components/FormCard.tsx`

```typescript
"use client";
import { ReactNode } from "react";

export default function FormCard({ title, description, children, className = "" }: {
  title?: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`card-feature p-7 ${className}`}>
      {title && <h2 className="mb-1">{title}</h2>}
      {description && <p className="text-sm text-[var(--text-muted)] mb-5">{description}</p>}
      {children}
    </div>
  );
}
```

### `src/components/CurvaDecorativa.tsx`

SVG decorativo opcional, usado em divisores e ornamentação. Curva à la Niemeyer.

```typescript
export default function CurvaDecorativa({ width = 200, color = "var(--brand-300)" }: { width?: number; color?: string }) {
  return (
    <svg width={width} height="24" viewBox="0 0 200 24" fill="none">
      <path d="M0 12 Q 50 -2, 100 12 T 200 12" stroke={color} strokeWidth="1.5" fill="none" strokeLinecap="round" />
    </svg>
  );
}
```

### `src/components/StudioSetupGuard.tsx`

Server component. Se usuário logado não tem studio configurado E não está em `/setup-studio`, redireciona para lá.

### `src/components/ProjetoKanban.tsx`

Cliente. Kanban dos projetos. Props: `projetos: Projeto[]`.

Colunas (uma por status):
1. Aguardando briefing
2. Briefing recebido
3. Em desenvolvimento
4. Em revisão
5. Aprovado
6. Em entrega
7. Concluído

Cada coluna usa `.kanban-column`. Header com `.kanban-column-header` + contagem em `.kanban-count`.

Cada card usa `.kanban-card` mostrando:
- Nome do projeto (font-display, 0.9375rem)
- Cliente (nome em texto small)
- Badge de tipo (interiores/grafico)
- Prazo de entrega (se houver) — vermelho se atrasado, amarelo se 3 dias ou menos
- Avatar pequeno do cliente

Click no card → navega para `/projetos/{id}`.

Mostrar com scroll horizontal no mobile, grid no desktop.

### `src/components/ProjetoTimeline.tsx`

Server-friendly. Recebe `etapas: Etapa[]` ordenadas. Renderiza timeline vertical com `.etapa-card` para cada etapa.

Cada etapa-card mostra:
- Ordem + nome (font-display)
- Descrição (se houver)
- Badge de status
- Valor (se houver) + percentual de pagamento
- Status de pagamento (pago/pendente)
- Prazo (se houver)
- Botão "Marcar como concluída" se status = em_andamento (server action)

### `src/components/EtapaCard.tsx`

Card individual de etapa (usado dentro do Timeline). Recebe a etapa e renderiza.

### `src/components/BriefingForm.tsx`

Cliente. Formulário de briefing inteligente. Props: `projetoId`, `tipo` (interiores | grafico), `briefingExistente?: Briefing`.

Renderiza campos diferentes por tipo:

**Comuns (sempre):**
- Objetivo do projeto (textarea)
- Público-alvo (textarea)
- Estilo preferido (input)
- Cores preferidas + cores a evitar
- Referências visuais (textarea — pode ser link ou descrição)
- Prazo desejado
- Orçamento estimado

**Se tipo = interiores:**
- Descrição do ambiente
- Medidas (com guia "Saiba como medir" expandível)
- Pontos de elétrica
- Iluminação natural (textarea descritiva)
- Mobiliário atual (manter / substituir)
- Necessidades funcionais

**Se tipo = grafico:**
- Marca atual (descrição)
- Valores da marca
- Diferenciais
- Concorrentes

**Sempre no final:**
- Observações extras (textarea)
- Botão "Enviar briefing" → salva no Supabase e marca projeto.status = briefing_recebido

Validação: campos obrigatórios marcados, mensagem de erro inline em português.

### `src/components/MoodboardGrid.tsx`

Cliente. Grid responsivo de imagens do moodboard. Props: `itens: MoodboardItem[]`, `editavel?: boolean`.

Usa `.moodboard-grid` e `.moodboard-item`. Click na imagem abre lightbox simples (modal full-screen com a imagem).

Se `editavel`: hover mostra botão "remover" canto superior direito.

### `src/components/MoodboardUploader.tsx`

Cliente. Botão "Adicionar imagens" + área de drop. Sobe arquivos para Supabase Storage bucket `arquivos`, cria entradas em `moodboard_itens`.

Aceita: PNG, JPG, WebP. Máx 5MB por imagem.

### `src/components/ArquivosGaleria.tsx`

Galeria visual de arquivos de um projeto, organizada por tipo (moodboard, planta, render, foto_cliente, entregavel). Cada tipo é uma seção colapsável.

### `src/components/ChatProjeto.tsx`

Cliente. Chat por projeto. Props: `projetoId`.

Layout:
- Lista de mensagens (scroll) usando `.chat-msg` e `.chat-msg-bubble`
- Input no rodapé com botão de enviar + botão de anexar arquivo
- Auto-scroll para última mensagem
- Realtime via Supabase subscriptions (`supabase.channel(...)`)

### `src/components/PropostaPreview.tsx`

Renderiza uma proposta em formato de documento elegante (para visualização interna ou pública). Usa font-display para títulos, layout limpo com bastante espaço, tabela de escopo, valor total destacado.

### `src/components/PhoneInput.tsx`

Cliente. Input controlado que formata telefone brasileiro automaticamente.

### `src/components/StatusMenu.tsx`

Dropdown genérico. Props: `current`, `options: Array<{value, label, color}>`, `onChange`.

### `src/components/Toaster.tsx`

Lê query param `?toast=msg&type=success|error` e mostra notificação por 3s. Position fixed bottom-right.

### `src/components/SkeletonPage.tsx`

Loading skeleton genérico.

### `src/components/charts/DashboardCharts.tsx`

Cliente. Exporta:
- `<RevenueChart data />` — bar chart receita por mês (últimos 6 meses) usando cor `var(--brand-500)`
- `<ProjetosStatusChart data />` — donut com distribuição de status, paleta brand/leaf/accent
- `<TopClientesChart data />` — bar horizontal dos top 5 clientes por receita

Todos com tooltip customizado em estilo do sistema.

---

## 8. ESPECIFICAÇÕES DE PÁGINAS

### `src/app/layout.tsx` (root)

```typescript
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eden Atelier — Gestão para Designers",
  description: "Sistema completo de gestão para designers de interiores e gráficos.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
```

### `src/app/page.tsx` (landing pública mínima)

Layout centralizado:
- EdenAtelierLogo grande no topo
- h1 em font-display tamanho 3rem+ "Onde projetos viram experiência"
- Subtítulo em prosa: "Gestão completa para designers de interiores e gráficos. Briefings inteligentes, moodboards integrados, portfólio público — tudo em um lugar."
- 2 botões: "Entrar" (secondary) + "Começar agora" (primary)
- CurvaDecorativa abaixo dos botões
- Pequeno rodapé "Eden Technology — 2026"

Background com a textura sutil de concreto.

### `src/app/(painel)/layout.tsx`

```typescript
import { Suspense } from "react";
import Sidebar from "@/components/Sidebar";
import Toaster from "@/components/Toaster";
import MobileBottomNav from "@/components/MobileBottomNav";
import StudioSetupGuard from "@/components/StudioSetupGuard";

export default function PainelLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ backgroundColor: "var(--bg)" }}>
      <StudioSetupGuard />
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-auto pb-16 lg:pb-0">
        {children}
      </div>
      <MobileBottomNav />
      <Suspense>
        <Toaster />
      </Suspense>
    </div>
  );
}
```

### `/login/page.tsx` e `/login/actions.ts`

Server action `signIn(formData)` recebe email/senha, chama `supabase.auth.signInWithPassword`. Em sucesso redireciona para `?redirect` ou `/dashboard`. Em erro: `/login?error=...`.

Página: card-feature centralizado com EdenAtelierLogo, h1 "Entrar" em font-display, form com email e senha, botão primary "Entrar", link "Esqueci minha senha" e link "Criar studio".

### `/cadastro/page.tsx` e `/cadastro/actions.ts`

Action `signUp(formData)` chama `supabase.auth.signUp` com `data: { nome }`. Cria entrada em `profiles` com `role='admin'`. Redireciona para `/setup-studio`.

Página: form com nome, email, senha, confirmar senha.

### `/setup-studio/page.tsx`

Wizard de 4 etapas com state local:

**Etapa 1 — Identidade:** Nome do studio, tipo (interiores / grafico / misto), especialidade (input livre, ex: "design infantil")
**Etapa 2 — Sobre:** Bio (textarea), cidade, estado, Instagram, telefone
**Etapa 3 — Atendimento:** Atende remoto / presencial / internacional (checkboxes), moeda principal (BRL/USD/EUR)
**Etapa 4 — Comercial:** Valor hora padrão (opcional), valor por m² (se interiores), prazo padrão para aprovação (dias), slug do portfólio público (gerado, editável)

Header com indicador de progresso (4 pontos, atual destacado em `var(--brand-500)`).

Botões "Voltar" e "Próximo / Concluir".

Server action cria o studio no Supabase com `owner_user_id = user.id`, atualiza `profiles.studio_id` e redireciona para `/dashboard`.

### `/(painel)/dashboard/page.tsx`

Server component. Query Supabase em paralelo:

1. Projetos ativos (status != concluido/cancelado) — count + lista dos 5 mais recentes
2. Projetos com prazo próximo (até 7 dias) ou atrasados
3. Receita do mês atual (sum de transacoes.tipo='receita' do mês)
4. Receita dos últimos 6 meses (para gráfico)
5. Total de clientes ativos
6. Propostas enviadas pendentes (status=enviada)
7. Etapas aguardando aprovação do cliente (status=aguardando_aprovacao)

Renderiza:
- `<Topbar title="Olá, {nome do designer}" subtitle="Visão geral do seu studio" />`
- Grid 4 stat-cards:
  - Projetos ativos
  - Receita do mês
  - Clientes ativos
  - Propostas pendentes
- Seção "Em andamento" — lista de projetos com bar de progresso (% de etapas concluídas)
- Grid 2 colunas:
  - "Atenção" — projetos com prazo próximo / atrasados / aguardando aprovação há 48h+
  - "Receita dos últimos 6 meses" — bar chart
- Seção "Próximas entregas" — 5 projetos com data de entrega mais próxima

Estado vazio: se 0 projetos, mostra card grande de boas-vindas com CTA "Criar primeiro projeto".

### `/(painel)/projetos/page.tsx`

Visão dual: tab "Kanban" (default) e tab "Lista".

- Kanban: `<ProjetoKanban projetos={...} />` (componente já especificado)
- Lista: tabela com colunas — Nome, Cliente, Tipo, Status (badge), Valor, Prazo, Progresso

Filtros: busca por nome, tipo, status, cliente.

Header: "Projetos" + botão "Novo projeto" → `/projetos/novo`.

### `/(painel)/projetos/novo/page.tsx`

Form de criação rápida. Etapas inline:
1. Cliente (autocomplete em `clientes` OU botão "+ Novo cliente" abre dialog)
2. Nome do projeto
3. Tipo (interiores / grafico)
4. Se interiores: ambiente + área m² (opcional)
5. Categoria livre (ex: quarto-infantil)
6. Modalidade (remoto / presencial / hibrido)
7. Valor total (opcional, pode definir depois)
8. Moeda
9. Data de entrega prevista
10. Limite de revisões (default 3)
11. Descrição (textarea)

Botão "Criar projeto". Server action cria projeto + 5 etapas padrão pré-preenchidas:
1. Briefing (20%)
2. Conceito + Moodboard (20%)
3. Desenvolvimento (30%)
4. Revisões e Ajustes (20%)
5. Entrega Final (10%)

Redireciona para `/projetos/{id}`.

### `/(painel)/projetos/[id]/page.tsx`

Detalhe completo do projeto. Layout 3 colunas em desktop / stack em mobile:

**Coluna esquerda (sidebar do projeto, 280px):**
- Capa do projeto (se houver) ou placeholder elegante
- Nome em font-display
- Cliente (link)
- Tipo + categoria (badges)
- Status (StatusMenu editável)
- Datas: início, entrega prevista, entrega real
- Valor total (formatCurrency)
- Progresso (bar) — % de etapas concluídas
- Toggle "Publicar no portfólio" (boolean)

**Coluna central (conteúdo):**
- Tabs: Visão Geral | Etapas | Briefing | Moodboard | Arquivos | Chat
- **Visão Geral:** descrição, briefing resumido, próximas etapas, atividade recente
- **Etapas:** `<ProjetoTimeline etapas={...} />`
- **Briefing:** se enviado, mostra o briefing renderizado; se não, botão "Enviar formulário de briefing para o cliente" (gera link)
- **Moodboard:** `<MoodboardGrid>` + `<MoodboardUploader>`
- **Arquivos:** `<ArquivosGaleria>`
- **Chat:** `<ChatProjeto projetoId={...} />`

**Coluna direita (300px, opcional, esconde em md-):**
- Card "Limite de revisões": "X/3 usadas" — botão "+1 revisão extra (R$ X)"
- Card "Cliente" — info rápida + botão WhatsApp (se telefone)
- Card "Documentos rápidos" — links para briefing/proposta originais

### `/(painel)/projetos/[id]/briefing/page.tsx`

Exibe o briefing completo do projeto em formato leitura, formatado por seções. Se ainda não foi enviado, mostra o `BriefingForm` para o designer preencher manualmente OU botão "Gerar link público" para enviar ao cliente preencher.

### `/(painel)/projetos/[id]/etapas/page.tsx`

Gestão das etapas. Lista completa via `ProjetoTimeline`. Botão "Adicionar etapa" abre modal.

Cada etapa pode ser editada inline (nome, descrição, valor, %, prazo, status).

### `/(painel)/projetos/[id]/arquivos/page.tsx`

Galeria completa de arquivos do projeto. Filtros por tipo. Upload de novos arquivos.

### `/(painel)/projetos/[id]/moodboard/page.tsx`

Lista de moodboards do projeto (pode ter mais de um — ex: Conceito Inicial, Desenvolvimento). Cada moodboard expande seu grid.

Botão "Novo moodboard" cria um novo com título.

### `/(painel)/projetos/[id]/chat/page.tsx`

Chat full-page do projeto. Inclui histórico de mensagens entre designer e cliente.

### `/(painel)/clientes/page.tsx`

Lista paginada de clientes. Filtros: busca por nome, status, tags.

Tabela com: avatar + nome, empresa, telefone, status (badge), total de projetos, valor total pago, ações.

Click leva para `/clientes/{id}`.

Header: "Clientes" + botão "Novo cliente".

### `/(painel)/clientes/novo/page.tsx`

Form completo de cadastro:
- Nome (obrigatório), email, telefone (PhoneInput)
- Empresa, CPF/CNPJ
- Endereço, cidade, estado, país (default Brasil)
- Moeda
- Como conheceu
- Tags (input com chips, ex: "quarto-infantil", "expatriado")
- Status (default: lead)
- Observações (textarea)

### `/(painel)/clientes/[id]/page.tsx`

Perfil completo do cliente. Layout 2 colunas:

**Esquerda:**
- Avatar grande + nome (font-display)
- Status editável
- Tags (chips)
- Contato (telefone com botão WhatsApp, email)
- Endereço completo
- Stats: total de projetos, valor total pago, projetos ativos
- Botão "Novo projeto para este cliente"

**Direita:**
- Tabs: Projetos | Propostas | Financeiro | Observações
- Projetos: lista de projetos do cliente
- Propostas: histórico de propostas enviadas
- Financeiro: transações ligadas a este cliente
- Observações: textarea editável

### `/(painel)/propostas/page.tsx`

Lista de propostas. Filtros: status, cliente, período.

Tabela com: número, título, cliente, valor, status, enviada em, ações.

### `/(painel)/propostas/nova/page.tsx`

Form de criação:
- Cliente (autocomplete)
- Projeto vinculado (opcional)
- Título
- Escopo (textarea rica — bullet points ou texto)
- Valor total + moeda
- Forma de pagamento (texto livre, ex: "50% início, 50% entrega")
- Prazo estimado (dias)
- Validade da proposta (dias, default 7)

Botão "Salvar como rascunho" e "Enviar proposta".

Ao enviar: gera UUID em `link_compartilhavel`, status='enviada', URL pública: `/{studio.slug}/proposta/{link}`.

### `/(painel)/propostas/[id]/page.tsx`

Preview da proposta. Botões: Editar, Reenviar, Marcar como aprovada/rejeitada, Copiar link público.

Mostra histórico de visualização ("Visualizada em DD/MM às HH:MM").

### `/(painel)/moodboards/page.tsx`

Visão geral de todos os moodboards do studio, agrupados por projeto. Cards visuais com primeira imagem como capa.

### `/(painel)/fornecedores/page.tsx`

Biblioteca de fornecedores. Cards em grid 3 colunas:
- Nome (font-display)
- Categoria (badge)
- Avaliação (estrelas)
- Faixa de preço ($, $$, $$$)
- Cidade
- Botão Instagram / Site

Filtros: categoria, cidade, faixa de preço.

Header: "Fornecedores" + botão "Adicionar fornecedor".

### `/(painel)/fornecedores/novo/page.tsx`

Form: nome, categoria (select), cidade, site, instagram, contato (nome, tel, email), faixa de preço, avaliação (0-5), observações.

### `/(painel)/portfolio/page.tsx`

Gestão do portfólio público. Lista projetos com `publicar_portfolio = true`.

Cada item pode ter ordem manual (drag&drop opcional, deixar como simples reordenação por botões).

Botão "Visualizar portfólio público" → abre `/{slug}` em nova aba.

### `/(painel)/financeiro/page.tsx`

Visão geral:
- Cards: Receita do mês, Despesas do mês, Lucro líquido, Total a receber (etapas com pago=false)
- Gráfico: receita por mês (últimos 12 meses)
- Lista de transações com filtros (tipo, período, projeto, cliente)
- Botões: "Nova receita", "Nova despesa"
- Sessão "A receber" — etapas pendentes de pagamento agrupadas por projeto

Multi-moeda: mostra resumo em cada moeda separadamente se houver projetos em USD/EUR.

### `/(painel)/relatorios/page.tsx`

- Receita por mês (12 meses) — bar
- Top 10 clientes por receita — bar horizontal
- Distribuição de projetos por status — donut
- Tempo médio de projeto (em dias, conclusão - início)
- Taxa de conversão de proposta (aprovadas / enviadas)
- Projetos com mais revisões (top 5)
- Tipo de projeto mais lucrativo (interiores vs grafico)

### `/(painel)/configuracoes/page.tsx`

Tabs: Studio | Comercial | Portfólio | Atendimento | Notificações

**Studio:** nome, tipo, especialidade, bio, logo (upload), cidade, estado, instagram, telefone, email.
**Comercial:** valor hora, valor por m², taxa de revisão extra, prazo padrão de aprovação, moeda principal.
**Portfólio:** slug (link clicável), capa do portfólio (upload), cor da marca (color picker).
**Atendimento:** atende remoto / presencial / internacional (toggles).
**Notificações:** placeholder com texto sobre integração N8N futura.

### `/[slug]/page.tsx` (portfólio público)

Layout:
- `.portfolio-hero` — nome do studio (font-display gigante), bio, badges de atendimento (remoto / internacional), botão grande "Solicitar projeto" → `/{slug}/briefing`
- Curva orgânica de transição (CSS inline no .portfolio-hero::before)
- `.portfolio-grid` — grid de projetos publicados como `.portfolio-card`
- Cada card: imagem de capa, nome do projeto, categoria, cliente (apenas nome inicial + ano)
- Footer: "Eden Atelier · {nome do studio} · 2026" + link "Entrar (cliente)"

Background: textura sutil de concreto + tipografia editorial.

Click em projeto → modal full-screen com galeria de imagens + descrição.

### `/[slug]/briefing/page.tsx`

Formulário público de pré-briefing. Cliente preenche sem login. Captura:
- Nome, email, telefone
- Sobre o projeto (livre)
- Tipo (interiores / grafico)
- Prazo desejado
- Orçamento estimado
- Como conheceu o studio

Ao enviar: cria cliente (se não existir) com status=lead + cria projeto com status=aguardando_briefing + redireciona para "Obrigada, entraremos em contato em 24h".

### `/[slug]/proposta/[id]/page.tsx`

Renderização pública e elegante de uma proposta. Layout editorial:
- Logo do studio + nome
- Título da proposta (font-display gigante)
- Cliente
- Data
- Escopo (formatado)
- Valor total destacado em number monumental
- Forma de pagamento
- Prazo estimado
- Validade
- Botões: "Aceitar proposta" / "Solicitar alteração"

Ao aceitar: atualiza status='aprovada', respondida_em=now(). Notifica visualmente sucesso.

### `/[slug]/cliente/page.tsx` e subpáginas

Área logada do cliente. Login simples (email magic link).

Após login:
- Lista dos próprios projetos
- Click → `/[slug]/cliente/projetos/{id}` mostra: progresso, etapas, arquivos visíveis (visivel_cliente=true), chat com o designer, briefings respondidos

---

## 9. PADRÕES DE CÓDIGO — SEGUIR EM TUDO

### Server Components (default)
- `async function` para páginas
- Promise.all para queries paralelas
- `createClient` de `@/lib/supabase/server` com `await`

### Client Components
- `"use client"` no topo
- `createClient` de `@/lib/supabase/client`

### Server Actions
- Arquivos `actions.ts` com `"use server"` em cada export
- `revalidatePath` após mutações
- Feedback via query params `?toast=`

### Tipagem
- Tipos inline com `type` ou interfaces no início do arquivo
- Nunca use `any` — use `unknown` se necessário
- Use exatamente as colunas definidas no schema SQL

### Erros e UX
- Forms sempre com try/catch
- Mensagens em pt-BR amigáveis
- Loading states com SkeletonPage onde apropriado
- Empty states elegantes em listas vazias

### Acessibilidade
- `<label>` em todos os inputs
- `aria-label` em botões de ícone
- Foco visível com ring brand

### Visual
- USE `.card-feature` para cards principais (com a curva decorativa no topo)
- USE `.card` para cards secundários
- USE `.divider-curve` ocasionalmente para divisores ornamentais (homenagem ao croqui)
- USE `font-display` (Fraunces) em h1, h2, números monumentais (.stat-value), nomes de projetos/clientes em cards
- USE `Inter` (default) para todo resto

---

## 10. SUPABASE STORAGE — BUCKETS

Crie no arquivo de migration uma instrução para criar buckets (se sua API permitir via SQL; senão, deixe documentado para criar manualmente):

```sql
-- Buckets necessários (criar via Supabase Dashboard se RLS não permitir aqui):
-- 1. 'arquivos' (público com policy: read all, write owner)
-- 2. 'logos' (público, mesma policy)
-- 3. 'capas' (público, mesma policy)
```

Adicione no final do schema SQL um comentário detalhando isso.

---

## 11. ROTEIRO DE EXECUÇÃO

1. `mkdir eden-atelier && cd eden-atelier`
2. Crie `package.json` exato
3. Crie demais arquivos de config
4. `npm install`
5. Leia `node_modules/next/dist/docs/` para confirmar APIs do Next 16
6. Crie migration SQL exata
7. Crie `src/app/globals.css` exato
8. Crie libs (`format.ts`, `supabase/{client,server,studio}.ts`)
9. Crie `src/middleware.ts`
10. Crie todos os componentes em `src/components/`
11. Crie todas as páginas seguindo a estrutura
12. Crie `src/app/layout.tsx`, `page.tsx`, `not-found.tsx`
13. `npm run build` e corrija TODOS os erros
14. `npm run lint` e corrija warnings
15. Sem `any` desnecessários

---

## 12. CRITÉRIOS DE ACEITAÇÃO

O projeto está completo quando TODOS abaixo forem verdade:

- [ ] `npm install` sem erros
- [ ] `npm run build` completa SEM erros TypeScript
- [ ] `npm run lint` retorna 0 erros
- [ ] 12 tabelas no SQL: studios, profiles, clientes, projetos, etapas, briefings, arquivos, moodboards, moodboard_itens, fornecedores, propostas, transacoes, mensagens
- [ ] RLS habilitado em TODAS as tabelas
- [ ] Função `get_my_studio_id()` existe
- [ ] Triggers de updated_at e total_projetos existem
- [ ] Middleware protege rotas do painel
- [ ] Todas as páginas listadas existem
- [ ] Sidebar tem 5 grupos: [sem grupo], Atendimento, Criação, Gestão, Sistema
- [ ] Sidebar é CLARA (background creme/concreto), texto escuro
- [ ] Paleta usada é a Cerrado/Niemeyer especificada
- [ ] Fraunces + Inter importadas e usadas corretamente
- [ ] Cards usam `.card-feature` ou `.card` com border-radius generoso
- [ ] Stat values usam font-display Fraunces, tamanho monumental
- [ ] Kanban de projetos funciona com 7 colunas
- [ ] BriefingForm tem campos diferentes por tipo (interiores vs grafico)
- [ ] MoodboardGrid renderiza imagens em grid responsivo
- [ ] Wizard `/setup-studio` tem 4 etapas
- [ ] Portfólio público `/[slug]` mostra projetos com `publicar_portfolio=true`
- [ ] Briefing público `/[slug]/briefing` permite captura sem login
- [ ] Proposta pública compartilhável via link único
- [ ] Multi-moeda funcional (BRL, USD, EUR)
- [ ] Background com textura sutil de concreto
- [ ] CurvaDecorativa usada em pelo menos 3 lugares
- [ ] Todas mensagens de erro em pt-BR

---

Comece agora. Quando terminar, faça um resumo do que foi entregue e dos próximos passos manuais (criar projeto Supabase, configurar `.env.local`, rodar migration, criar buckets de storage).
