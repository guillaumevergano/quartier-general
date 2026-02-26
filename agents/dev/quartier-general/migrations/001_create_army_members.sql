-- Création de la table army_members pour l'interface unifiée agents + humains
CREATE TABLE IF NOT EXISTS army_members (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    position VARCHAR(150) NOT NULL,
    hourly_rate DECIMAL(8,2) NOT NULL DEFAULT 0,
    type VARCHAR(10) NOT NULL CHECK (type IN ('human', 'agent')),
    photo_url TEXT,
    model VARCHAR(50), -- Pour les agents seulement
    emoji VARCHAR(10),
    contract_type VARCHAR(20), -- CDI, Freelance, etc. (pour humains)
    status VARCHAR(10) CHECK (status IN ('online', 'offline', 'busy')) DEFAULT 'offline', -- Pour les agents
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index pour optimiser les requêtes
CREATE INDEX IF NOT EXISTS idx_army_members_type ON army_members(type);
CREATE INDEX IF NOT EXISTS idx_army_members_status ON army_members(status) WHERE type = 'agent';

-- Trigger pour mise à jour automatique de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE OR REPLACE TRIGGER update_army_members_updated_at
    BEFORE UPDATE ON army_members
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Insertion des données Mollien
INSERT INTO army_members (name, position, hourly_rate, type, photo_url, emoji, contract_type) VALUES
-- ÉQUIPE HUMAINE
('Guillaume', 'Directeur', 120.00, 'human', '/avatars/guillaume.jpg', '👨‍💼', 'CDI'),
('Marie', 'DA', 85.00, 'human', '/avatars/marie.jpg', '🎨', 'CDI'),
('Léana', 'UX/UI', 75.00, 'human', '/avatars/leana.jpg', '✏️', 'Freelance'),
('Emilie', 'Graphiste', 65.00, 'human', '/avatars/emilie.jpg', '🎭', 'CDI'),
('Roland', 'Dev', 80.00, 'human', '/avatars/roland.jpg', '💻', 'CDI');

-- AGENTS
INSERT INTO army_members (name, position, hourly_rate, type, photo_url, emoji, model, status) VALUES
('Berthier', 'Chef d''état-major', 18.00, 'agent', '/avatars/berthier.jpg', '⭐', 'Sonnet 4', 'online'),
('Murat', 'Éclaireur', 12.00, 'agent', '/avatars/murat.jpg', '🔍', 'Sonnet 4', 'busy'),
('Davout', 'Gestionnaire', 15.00, 'agent', '/avatars/davout.jpg', '📊', 'Sonnet 4', 'online'),
('Vauban', 'Ingénieur', 40.00, 'agent', '/avatars/vauban.jpg', '🏗️', 'Opus 4', 'online'),
('Mollien', 'Trésorier', 12.00, 'agent', '/avatars/mollien.jpg', '💰', 'Sonnet 4', 'online');

-- RLS (Row Level Security) - optionnel pour sécuriser l'accès
-- ALTER TABLE army_members ENABLE ROW LEVEL SECURITY;

-- Politique pour permettre la lecture à tous les utilisateurs authentifiés
-- CREATE POLICY "Allow read access to army_members" ON army_members
--     FOR SELECT USING (auth.role() = 'authenticated');

-- Politique pour permettre les modifications aux admins seulement  
-- CREATE POLICY "Allow full access to admins" ON army_members
--     FOR ALL USING (auth.jwt() ->> 'role' = 'admin');