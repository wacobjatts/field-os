export type ID = string;
export type ISO8601Timestamp = string;

export interface Project {
  id: ID;
  name: string;
  status: string;
  budget_total: number;
  created_at: ISO8601Timestamp;
  updated_at: ISO8601Timestamp;
}

export interface Task {
  id: ID;
  phase_id: ID;
  name: string;
  quantity_planned: number;
  unit: string;
  predicted_mhpu: number;
  created_at: ISO8601Timestamp;
  updated_at: ISO8601Timestamp;
}

export interface LogEntry {
  id: ID;
  task_id: ID;
  timestamp: ISO8601Timestamp;
  crew_size: number;
  hours_spent: number;
  quantity_installed: number;
}
