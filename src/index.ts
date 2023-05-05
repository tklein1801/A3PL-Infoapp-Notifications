import { CronJob } from 'cron';
import { LOGGER } from './log';
import { LocalConfig, LocalConfigService } from './services/LocalConfig.service';
import type { Changelog, ModUpdate } from './types';
import { PanthorService } from './services/Panthor.service';
import { NotificationService } from './services/Notification.service';

const PRODUCTION = process.env.PRODUCTION === 'true';
const checkForUpdate = new CronJob('*/1 * * * *', async () => {
  // await LOGGER.log('LOG', 'Check for updates', 'Check for new Panthor updates');
  let latestServedVersion: LocalConfig['latest_version'],
    latestPublishedChangelog: Changelog | null,
    updateType: ModUpdate;

  try {
    latestServedVersion = await LocalConfigService.getLatesServedtChangelogVersion();

    latestPublishedChangelog = await PanthorService.getLatestChangelog();
    if (latestPublishedChangelog === null) {
      return await LOGGER.log(
        'WARN',
        'Retrieve changelogs',
        "Couldn't retrieve the latest published changelog"
      );
    }

    if (latestPublishedChangelog.version === latestServedVersion) {
      // return await LOGGER.log('INFO', 'Compare versions', 'No new changelog available');
      return console.log('INFO', 'Compare versions', 'No new changelog available');
    }

    updateType =
      latestPublishedChangelog.change_mod.length > 0 ||
      latestPublishedChangelog.change_map.length > 0
        ? 'MOD'
        : 'MISSION';

    await LOGGER.log('LOG', 'Retrieve device tokens', 'Retrieving active device push tokens');
    const { data } = await NotificationService.getActiveDeviceTokens();
    if (!data || data.length === 0) {
      return await LOGGER.log('WARN', 'Retrieve device tokens', "Couldn't retrieve device tokens");
    }
    const notificationProps = {
      updateType: updateType,
      version: latestPublishedChangelog.version,
    };
    data.forEach(async (deviceToken) => {
      await LOGGER.log(
        'LOG',
        'Trigger push notification',
        `Trigger push notification for '${deviceToken.id}'`
      );
      if (PRODUCTION) {
        try {
          await NotificationService.triggerNotification(deviceToken.token, notificationProps);
          await LOGGER.log(
            'LOG',
            'Trigger push notification',
            `Push notification for '${deviceToken.id}' was triggered`
          );
        } catch (error) {
          await LOGGER.log(
            'ERROR',
            'Trigger push notification',
            `Couldn't trigger push notification for '${deviceToken.id}'`
          );
        }
      } else {
        console.warn(`Didn't trigger push notification for ${deviceToken.token}`);
      }
    });
  } catch (error) {
    if (error instanceof Error) {
      await LOGGER.log('ERROR', error.name, error.message);
    } else await LOGGER.log('ERROR', 'unknown', String(error));
  } finally {
    // await LOGGER.close();
  }
});

(async () => {
  await LOGGER.log(
    'LOG',
    'Starting',
    `Running in ${PRODUCTION ? 'production' : 'development'}-mode!`
  );

  // Before we start the task, we get the latest version and save it in our local config to prevent unnecessary triggered push notifications
  let success = false;
  do {
    await LOGGER.log('LOG', 'Starting', 'Saving latest published changelog-version');
    const latestPublishedChangelog = await PanthorService.getLatestChangelog();
    if (latestPublishedChangelog) {
      success = await LocalConfigService.saveFile({
        latest_version: latestPublishedChangelog.version,
      });
    }
  } while (!success);

  await LOGGER.log('LOG', 'Starting', `Starting job`);
  checkForUpdate.fireOnTick();
  checkForUpdate.start();
})();
