import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

export interface NotificationPermissionResult {
  granted: boolean;
  token?: string;
  error?: string;
}

export const requestNotificationPermissions = async (): Promise<NotificationPermissionResult> => {
  try {
    if (Platform.OS === 'web') {
      // Sur web, simuler l'autorisation
      return {
        granted: true,
        token: `web_token_${Date.now()}`
      };
    }

    // Demander les permissions
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      return {
        granted: false,
        error: 'Permission refusée'
      };
    }

    // Obtenir le token Expo Push
    const token = await Notifications.getExpoPushTokenAsync({
      projectId: 'your-project-id' // Remplacer par votre project ID
    });

    return {
      granted: true,
      token: token.data
    };
  } catch (error) {
    console.error('Error requesting notification permissions:', error);
    return {
      granted: false,
      error: 'Erreur lors de la demande de permissions'
    };
  }
};

export const configureNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
};