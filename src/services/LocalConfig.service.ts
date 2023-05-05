import fs from 'fs';
import type { Changelog } from '../types';
import { promisify } from 'util';

export type LocalConfig = {
  latest_version: Changelog['version'];
};

export class LocalConfigService {
  static file = 'config.json';

  /**
   * Returns the latest served changelog version
   */
  static async saveFile(data: LocalConfig) {
    const writeFileAsync = promisify(fs.writeFile);
    try {
      await writeFileAsync(this.file, JSON.stringify(data));
      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }

  /**
   * Returns the latest served changelog version
   * @throws {Error} Local config file wasn't found
   */
  static async getLatesServedtChangelogVersion(): Promise<LocalConfig['latest_version']> {
    const fileExists = fs.existsSync(this.file);
    if (!fileExists) throw new Error('config/not-found');

    return new Promise<LocalConfig['latest_version']>((res, rej) => {
      fs.readFile(this.file, { encoding: 'utf-8' }, (err, data) => {
        if (err) {
          console.error(err);
          rej(err);
        } else {
          const fileContent = JSON.parse(data) as LocalConfig;
          res(fileContent.latest_version);
        }
      });
    });
  }
}
