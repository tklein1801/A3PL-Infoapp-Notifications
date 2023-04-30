export type ModUpdate = 'MISSION' | 'MOD';

export type INotificationToken = {
  id: number;
  active: boolean;
  token: string;
  created_at: Date;
};

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
