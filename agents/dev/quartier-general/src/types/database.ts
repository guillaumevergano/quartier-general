export interface Agent {
  id: string;
  name: string;
  title: string;
  grade: string;
  model: string;
  workspace: string;
  avatar_url?: string;
  identity_md?: string;
  soul_md?: string;
  channels?: Record<string, any>;
  status: 'online' | 'offline' | 'busy';
  is_default?: boolean;
}

export interface Action {
  id: string;
  agent_id: string;
  action_type: 'message' | 'tool_call' | 'exec' | 'error' | 'system' | 'heartbeat' | 'subagent';
  channel: string;
  account_id?: string;
  summary: string;
  details?: Record<string, any>;
  tokens_input?: number;
  tokens_output?: number;
  cost_usd?: number;
  model_used?: string;
  session_id?: string;
  status: 'success' | 'error' | 'pending';
  duration_ms?: number;
  created_at: string;
}

export interface DailyCost {
  date: string;
  agent_id: string;
  model: string;
  action_type: string;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cost_usd: number;
  action_count: number;
}

export interface Alert {
  id: string;
  severity: 'critical' | 'warning' | 'info' | 'success';
  category: 'cost' | 'error' | 'system' | 'agent' | 'security';
  title: string;
  message: string;
  agent_id?: string;
  is_read: boolean;
  created_at: string;
}

export interface Session {
  id: string;
  agent_id: string;
  session_type: string;
  start_time: string;
  end_time?: string;
  message_count: number;
  total_cost: number;
  channel: string;
}

export interface AlertThreshold {
  id: string;
  name: string;
  metric: string;
  threshold_value: number;
  period: string;
  is_active: boolean;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
  created_at: string;
}

// Types pour l'API et l'interface
export interface KPIData {
  messagesTotal: number;
  costTotal: number;
  actionsTotal: number;
  avgResponseTime: number;
}

export interface ChartData {
  date: string;
  [key: string]: string | number;
}

export interface AgentStats {
  id: string;
  name: string;
  messageCount: number;
  cost: number;
  avgResponseTime: number;
  status: Agent['status'];
}

// Nouvelle interface pour la section Armée (agents + humains)
export interface ArmyMember {
  id: string;
  name: string;
  position: string;
  hourly_rate: number;
  type: 'human' | 'agent';
  photo_url?: string;
  model?: string; // Seulement pour les agents
  emoji?: string;
  contract_type?: string; // CDI, Freelance, etc.
  status?: 'online' | 'offline' | 'busy'; // Seulement pour les agents
  created_at?: string;
  updated_at?: string;
}