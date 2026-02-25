export interface Agent {
  id: string;
  name: string;
  title: string | null;
  grade: string | null;
  model: string | null;
  workspace: string | null;
  avatar_url: string | null;
  description: string | null;
  identity_md: string | null;
  soul_md: string | null;
  channels: Record<string, unknown> | null;
  status: "online" | "offline" | "busy";
  is_default: boolean;
  created_at: string;
  updated_at: string;
}

export interface Action {
  id: string;
  agent_id: string;
  action_type: string;
  channel: string | null;
  account_id: string | null;
  summary: string | null;
  details: Record<string, unknown> | null;
  tokens_input: number | null;
  tokens_output: number | null;
  cost_usd: number | null;
  model_used: string | null;
  session_id: string | null;
  status: "success" | "error" | "pending";
  duration_ms: number | null;
  created_at: string;
}

export interface DailyCost {
  date: string;
  agent_id: string;
  model: string | null;
  action_type: string | null;
  total_input_tokens: number;
  total_output_tokens: number;
  total_cost_usd: number;
  action_count: number;
}

export interface Alert {
  id: string;
  severity: "critical" | "warning" | "info" | "success";
  category: string;
  title: string;
  message: string;
  agent_id: string | null;
  is_read: boolean;
  created_at: string;
}

export interface AdminUser {
  id: string;
  username: string;
  password_hash: string;
}
