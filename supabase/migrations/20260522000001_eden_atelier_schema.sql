-- ================================================================
-- EDEN ATELIER — Schema inicial completo
-- ================================================================

-- 1. STUDIOS (multi-tenant root)
CREATE TABLE IF NOT EXISTS studios (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_user_id           uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  nome_studio             text NOT NULL,
  slug                    text UNIQUE,
  tipo                    text DEFAULT 'interiores',
  especialidade           text,
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
  moeda_principal         text DEFAULT 'BRL',
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
  role            text DEFAULT 'admin',
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
  tags                text[],
  status              text DEFAULT 'lead',
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
  tipo                    text DEFAULT 'interiores',
  categoria               text,
  ambiente                text,
  area_m2                 numeric(8,2),
  modalidade              text DEFAULT 'remoto',
  descricao               text,
  briefing_resumo         text,
  status                  text DEFAULT 'aguardando_briefing',
  prioridade              text DEFAULT 'media',
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

-- 5. ETAPAS
CREATE TABLE IF NOT EXISTS etapas (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  projeto_id              uuid REFERENCES projetos(id) ON DELETE CASCADE,
  ordem                   int NOT NULL,
  nome                    text NOT NULL,
  descricao               text,
  status                  text DEFAULT 'pendente',
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

-- 6. BRIEFINGS
CREATE TABLE IF NOT EXISTS briefings (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  projeto_id              uuid REFERENCES projetos(id) ON DELETE CASCADE,
  objetivo                text,
  publico                 text,
  estilo_preferido        text,
  cores_preferidas        text,
  cores_evitar            text,
  referencias_visuais     text,
  prazo_desejado          text,
  orcamento_estimado      text,
  ambiente_descricao      text,
  medidas_ambiente        text,
  pontos_eletrica         text,
  iluminacao_natural      text,
  mobiliario_atual        text,
  necessidades_funcionais text,
  marca_atual             text,
  valores_marca           text,
  diferenciais            text,
  concorrentes            text,
  observacoes_extras      text,
  enviado_em              timestamptz,
  created_at              timestamptz DEFAULT now()
);

-- 7. ARQUIVOS
CREATE TABLE IF NOT EXISTS arquivos (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  projeto_id              uuid REFERENCES projetos(id) ON DELETE CASCADE,
  etapa_id                uuid REFERENCES etapas(id) ON DELETE SET NULL,
  nome                    text NOT NULL,
  tipo                    text DEFAULT 'arquivo',
  categoria               text,
  url                     text NOT NULL,
  thumbnail_url           text,
  tamanho_kb              int,
  descricao               text,
  visivel_cliente         boolean DEFAULT true,
  created_at              timestamptz DEFAULT now()
);

-- 8. MOODBOARDS
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

-- 9. FORNECEDORES
CREATE TABLE IF NOT EXISTS fornecedores (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  nome                    text NOT NULL,
  categoria               text,
  cidade                  text,
  site                    text,
  instagram               text,
  contato_nome            text,
  contato_telefone        text,
  contato_email           text,
  observacoes             text,
  faixa_preco             text,
  avaliacao               int DEFAULT 0,
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
  status                  text DEFAULT 'rascunho',
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
  tipo                    text NOT NULL,
  descricao               text,
  valor                   numeric(12,2) NOT NULL,
  moeda                   text DEFAULT 'BRL',
  data                    date NOT NULL DEFAULT CURRENT_DATE,
  forma_pagamento         text,
  categoria               text,
  recebido                boolean DEFAULT true,
  created_at              timestamptz DEFAULT now()
);

-- 12. MENSAGENS
CREATE TABLE IF NOT EXISTS mensagens (
  id                      uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  studio_id               uuid REFERENCES studios(id) ON DELETE CASCADE,
  projeto_id              uuid REFERENCES projetos(id) ON DELETE CASCADE,
  remetente_user_id       uuid REFERENCES auth.users(id),
  remetente_tipo          text,
  texto                   text NOT NULL,
  anexo_arquivo_id        uuid REFERENCES arquivos(id),
  lida                    boolean DEFAULT false,
  created_at              timestamptz DEFAULT now()
);

-- ================================================================
-- FUNÇÃO AUXILIAR
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
-- RLS
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

DROP POLICY IF EXISTS "studios_own" ON studios;
CREATE POLICY "studios_own" ON studios FOR ALL USING (owner_user_id = auth.uid());

DROP POLICY IF EXISTS "studios_public_by_slug" ON studios;
CREATE POLICY "studios_public_by_slug" ON studios FOR SELECT USING (slug IS NOT NULL);

DROP POLICY IF EXISTS "profiles_self" ON profiles;
CREATE POLICY "profiles_self" ON profiles FOR ALL USING (id = auth.uid());

DROP POLICY IF EXISTS "clientes_all" ON clientes;
CREATE POLICY "clientes_all" ON clientes FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "clientes_self_read" ON clientes;
CREATE POLICY "clientes_self_read" ON clientes FOR SELECT USING (auth_user_id = auth.uid());

DROP POLICY IF EXISTS "projetos_all" ON projetos;
CREATE POLICY "projetos_all" ON projetos FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "projetos_cliente_read" ON projetos;
CREATE POLICY "projetos_cliente_read" ON projetos FOR SELECT USING (
  cliente_id IN (SELECT id FROM clientes WHERE auth_user_id = auth.uid())
);

DROP POLICY IF EXISTS "projetos_portfolio_publico" ON projetos;
CREATE POLICY "projetos_portfolio_publico" ON projetos FOR SELECT USING (publicar_portfolio = true);

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

DROP POLICY IF EXISTS "moodboards_all" ON moodboards;
CREATE POLICY "moodboards_all" ON moodboards FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "moodboard_itens_via_moodboard" ON moodboard_itens;
CREATE POLICY "moodboard_itens_via_moodboard" ON moodboard_itens FOR ALL USING (
  moodboard_id IN (SELECT id FROM moodboards WHERE studio_id = get_my_studio_id())
);

DROP POLICY IF EXISTS "fornecedores_all" ON fornecedores;
CREATE POLICY "fornecedores_all" ON fornecedores FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "propostas_all" ON propostas;
CREATE POLICY "propostas_all" ON propostas FOR ALL USING (studio_id = get_my_studio_id());

DROP POLICY IF EXISTS "propostas_via_link" ON propostas;
CREATE POLICY "propostas_via_link" ON propostas FOR SELECT USING (link_compartilhavel IS NOT NULL);

DROP POLICY IF EXISTS "transacoes_all" ON transacoes;
CREATE POLICY "transacoes_all" ON transacoes FOR ALL USING (studio_id = get_my_studio_id());

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

-- ================================================================
-- STORAGE BUCKETS (criar manualmente no Supabase Dashboard):
-- 1. 'arquivos' (público: read all, write owner)
-- 2. 'logos'   (público: read all, write owner)
-- 3. 'capas'   (público: read all, write owner)
-- ================================================================
