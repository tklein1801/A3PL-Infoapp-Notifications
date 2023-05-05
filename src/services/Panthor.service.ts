import axios from 'axios';
import type { ApiResponse, Changelog } from '../types';

export class PanthorService {
  static host = 'https://api.panthor.de';

  static async getChangelogs() {
    const req = await axios.get(this.host + '/v1/changelog');
    return req.data as ApiResponse<Changelog[]>;
  }

  static async getLatestChangelog() {
    try {
      const changelogs = await this.getChangelogs();
      return changelogs.data[0];
    } catch (error) {
      console.error(error);
      return null;
    }
  }
}
