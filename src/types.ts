export type ModUpdate = 'MISSION' | 'MOD';

export type ApiResponse<T> = {
  data: T;
  requested_at: number;
};

export type Changelog = {
  id: number;
  version: string;
  note: string;
  active: number;
  size: string;
  change_mission: string[];
  change_map: string[];
  change_mod: string[];
  release_at: string;
  created_at: string;
  updated_at: string;
};
