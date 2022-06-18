export type ModUpdate = 'MISSION' | 'MOD';

export interface INotificationToken {
  id: number;
  active: 1 | 0;
  token: string;
  created_at: Date;
}

export interface IChangelog {
  data: {
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
  }[];
  requested_at: number;
}
