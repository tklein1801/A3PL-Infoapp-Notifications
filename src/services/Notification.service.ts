import axios from 'axios';
import type { InfoappDeviceToken, ApiResponse } from '@kleithor/types';
import type { ModUpdate } from '../types';

export class NotificationService {
  /**
   * @throws {Error} Environment variable wasn't set
   */
  static async triggerNotification(
    devicePushToken: string,
    { updateType, version }: { updateType: ModUpdate; version: string }
  ) {
    const envVar = process.env.FCM_SERVER_KEY;
    if (envVar === undefined || envVar.length === 0)
      throw "Enviroment variable 'FCM_SERVER_KEY' not set";

    const response = await axios.post<{
      multicast_id: number;
      success: number;
      failure: number;
      canonical_ids: number;
      results: any[];
    }>(
      'https://fcm.googleapis.com/fcm/send',
      {
        to: devicePushToken,
        priority: 10,
        data: {
          experienceId: '@tklein1801/A3PLI',
          scopeKey: '@tklein1801/A3PLI',
          title: 'Panthor Update v' + version,
          message:
            updateType === 'MISSION'
              ? 'Es steht eine veränderte Missionsdatei zur verfügung'
              : 'Es steht ein neues Modupdate im Launcher zur verfügung',
        },
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'key=' + process.env.FCM_SERVER_KEY,
        },
      }
    );
    return response.data;
  }

  /**
   * @throws {Error} Environment variable wasn't set
   */
  static async getActiveDeviceTokens(): Promise<ApiResponse<number, InfoappDeviceToken[]>> {
    const envVar = process.env.KLEITHOR_AUTHORIZATION_KEY;
    if (envVar === undefined || envVar.length === 0) {
      throw new Error("Enviroment variable 'KLEITHOR_AUTHORIZATION_KEY' not set");
    }
    const response = await axios.get('https://backend.tklein.it/v1/infoapp/', {
      params: { active: true },
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + process.env.KLEITHOR_AUTHORIZATION_KEY,
      },
    });
    return response.data;
  }
}
