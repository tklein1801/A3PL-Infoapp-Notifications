import dotenv from 'dotenv';
dotenv.config();
import { CronJob } from 'cron';
import axios from 'axios';
import { IChangelog, INotificationToken, ModUpdate } from './types';
import { readFile, writeFile } from 'fs/promises';
import { LOGGER } from './log';

const checkForUpdate = new CronJob('*/1 * * * *', async () => {
  // await LOGGER.log('LOG', 'Check for updates', 'Check for new Panthor updates');
  const LATEST_VERSION = await getLatestVersion('config.json');
  if (!LATEST_VERSION) {
    await LOGGER.log('ERROR', 'Get `config.json`', `Couldn't get the latest served version`);
  }

  getChangelogs()
    .then(async (response) => {
      const LATEST_CHANGELOG = response.data[0];
      if (LATEST_CHANGELOG.version === LATEST_VERSION) {
        // await LOGGER.log('INFO', 'Check for updates', 'No new update avaiable');
        return;
      }

      const updateType: ModUpdate =
        LATEST_CHANGELOG.change_mod.length > 0 || LATEST_CHANGELOG.change_map.length > 0
          ? 'MOD'
          : 'MISSION';

      await LOGGER.log('LOG', 'Push Tokens', 'Retrieving active device push tokens');
      getTokens()
        .then(async (response) => {
          const TOKENS = response.data;
          if (TOKENS.length < 1) {
            await LOGGER.log('INFO', 'Push Tokens', 'No tokens found');
            return;
          }
          TOKENS.forEach(async (token) => {
            await LOGGER.log(
              'LOG',
              'Push-Notification',
              `Send push-notification to '${token.token}'`
            );
            if (process.env.PRODUCTION === 'true') {
              await sendNotification(token.token, {
                version: LATEST_CHANGELOG.version,
                updateType: updateType,
              })
                .then(async (response) => {
                  if (response.data.failure > 0) {
                    await LOGGER.log(
                      'ERROR',
                      'Push-Notification',
                      `Sending push-notification for '${token}' failed`
                    );
                  }
                  await LOGGER.log(
                    'INFO',
                    'Push-Notification',
                    `Push-notification for device '${token.token}' sent successfully`
                  );
                })
                .catch(async (err) => await LOGGER.log('ERROR', 'Push-Notification', err));
            }
          });
        })
        .catch(async (err) => await LOGGER.log('ERROR', 'Push-Notification', err))
        .finally(async () => await LOGGER.log('INFO', 'Push-Notification', 'Processing complete'));

      await saveNewVersion('config.json', LATEST_CHANGELOG.version);
    })
    .catch(async (err) => await LOGGER.log('ERROR', 'Push-Notification', err));
});

LOGGER.log(
  'INFO',
  'Starting',
  `Running in ${process.env.PRODUCTION === 'true' ? 'production' : 'development'}-mode!`
);

checkForUpdate.fireOnTick();
checkForUpdate.start();

async function getLatestVersion(file: string) {
  const data = JSON.parse(await readFile(file, 'utf-8')).latest_version;
  // @ts-ignore
  return data;
}

async function saveNewVersion(file: string, version: string) {
  await writeFile(file, JSON.stringify({ latest_version: version }));
  return await readFile(file);
}

async function getChangelogs() {
  try {
    const response = await axios.get<IChangelog>('https://api.panthor.de/v1/changelog');
    if (response.status !== 200) throw new Error(response.statusText);
    return response.data;
  } catch (err) {
    throw err;
  }
}

async function getTokens() {
  if (!process.env.KLEITHOR_AUTHORIZATION_KEY)
    throw "Enviroment variable 'KLEITHOR_AUTHORIZATION_KEY' not set";
  return axios.get<INotificationToken[]>('https://backend.tklein.it/v1/infoapp/', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: ('Bearer ' + process.env.KLEITHOR_AUTHORIZATION_KEY) as string,
    },
  });
}

async function sendNotification(
  devicePushToken: string,
  { updateType, version }: { updateType: ModUpdate; version: string }
) {
  if (!process.env.FCM_SERVER_KEY) throw "Enviroment variable 'FCM_SERVER_KEY' not set";

  return axios.post<{
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
}
