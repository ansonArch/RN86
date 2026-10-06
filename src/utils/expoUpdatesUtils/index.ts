import * as Updates from 'expo-updates';

export const SET_EXPO_UPDATES_VERSION = 'SET_EXPO_UPDATES_VERSION';

export const handleExpoUpdates = async (initDbAndStaticData: () => Promise<void>) => {
  const checkoutForUpdateWithTimeout = (timeout: number) => {
    return new Promise<Updates.UpdateCheckResult>((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error('Request time out after 30s'));
      }, timeout);

      Updates.checkForUpdateAsync()
        .then(update => {
          clearTimeout(timer);
          resolve(update);
        })
        .catch(error => {
          clearTimeout(timer);
          reject(error);
        });
    });
  };

  try {
    const update = await checkoutForUpdateWithTimeout(30000);

    if (update.isAvailable) {
      await Updates.fetchUpdateAsync();
      await Updates.reloadAsync();
    }
    initDbAndStaticData();
  } catch (error: any) {
    initDbAndStaticData();
  }
};

export const handleExpoUpdatesGroupId = () => {
  const groupId = Updates.updateId;
  const isEmbeddedLaunch = Updates.isEmbeddedLaunch;
  if (groupId && !isEmbeddedLaunch) {
    console.log('[ExpoUpdates GroupId', groupId.split('-')[0]);
  }
};