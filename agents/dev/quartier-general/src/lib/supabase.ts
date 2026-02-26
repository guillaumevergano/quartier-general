import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'placeholder-service-key';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-anon-key';

// Client pour les opérations côté serveur (avec service_role_key)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Client pour les opérations côté client (avec anon key)
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Fonctions utilitaires pour les données
export const getAgents = async () => {
  const { data, error } = await supabaseAdmin
    .from('agents')
    .select('*')
    .order('name');
  
  if (error) throw error;
  return data;
};

export const getRecentActions = async (limit: number = 50) => {
  const { data, error } = await supabaseAdmin
    .from('actions')
    .select('*, agents(name)')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) throw error;
  return data;
};

export const getDailyCosts = async (days: number = 7) => {
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);
  
  const { data, error } = await supabaseAdmin
    .from('daily_costs')
    .select('*')
    .gte('date', startDate.toISOString().split('T')[0])
    .order('date', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getKPIs = async (period: 'today' | 'week' | 'month' = 'today') => {
  const now = new Date();
  let startDate: Date;
  
  switch (period) {
    case 'today':
      startDate = new Date(now.setHours(0, 0, 0, 0));
      break;
    case 'week':
      startDate = new Date(now);
      startDate.setDate(startDate.getDate() - 7);
      break;
    case 'month':
      startDate = new Date(now);
      startDate.setMonth(startDate.getMonth() - 1);
      break;
  }

  const { data, error } = await supabaseAdmin
    .from('actions')
    .select('tokens_input, tokens_output, cost_usd, duration_ms')
    .gte('created_at', startDate.toISOString());

  if (error) throw error;

  const kpis = data.reduce((acc, action) => {
    acc.messagesTotal += 1;
    acc.costTotal += action.cost_usd || 0;
    acc.actionsTotal += 1;
    acc.avgResponseTime += action.duration_ms || 0;
    return acc;
  }, {
    messagesTotal: 0,
    costTotal: 0,
    actionsTotal: 0,
    avgResponseTime: 0
  });

  if (kpis.messagesTotal > 0) {
    kpis.avgResponseTime = Math.round(kpis.avgResponseTime / kpis.messagesTotal);
  }

  return kpis;
};

export const getAlerts = async (unreadOnly: boolean = false) => {
  let query = supabaseAdmin
    .from('alerts')
    .select('*')
    .order('created_at', { ascending: false });
    
  if (unreadOnly) {
    query = query.eq('is_read', false);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

// Fonctions pour la gestion de l'Armée (agents + humains)
export const getArmyMembers = async () => {
  const { data, error } = await supabaseAdmin
    .from('army_members')
    .select('*')
    .order('type', { ascending: false }) // Humains en premier, puis agents
    .order('name');
  
  if (error) throw error;
  return data;
};

export const createArmyMember = async (member: Omit<any, 'id' | 'created_at' | 'updated_at'>) => {
  const { data, error } = await supabaseAdmin
    .from('army_members')
    .insert(member)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const updateArmyMember = async (id: string, updates: Partial<any>) => {
  const { data, error } = await supabaseAdmin
    .from('army_members')
    .update(updates)
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

export const deleteArmyMember = async (id: string) => {
  const { data, error } = await supabaseAdmin
    .from('army_members')
    .delete()
    .eq('id', id)
    .select()
    .single();
  
  if (error) throw error;
  return data;
};

// Statistiques de l'armée
export const getArmyStats = async () => {
  const { data, error } = await supabaseAdmin
    .from('army_members')
    .select('type, hourly_rate, status');
  
  if (error) throw error;
  
  const stats = data.reduce((acc, member) => {
    acc.totalMembers += 1;
    acc.totalCostPerHour += member.hourly_rate || 0;
    
    if (member.type === 'human') {
      acc.humanMembers += 1;
      acc.humanCostPerHour += member.hourly_rate || 0;
    } else {
      acc.agentMembers += 1;
      acc.agentCostPerHour += member.hourly_rate || 0;
      
      if (member.status === 'online') {
        acc.onlineAgents += 1;
      }
    }
    
    return acc;
  }, {
    totalMembers: 0,
    humanMembers: 0,
    agentMembers: 0,
    onlineAgents: 0,
    totalCostPerHour: 0,
    humanCostPerHour: 0,
    agentCostPerHour: 0
  });
  
  return stats;
};