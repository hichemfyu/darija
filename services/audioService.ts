import * as Haptics from 'expo-haptics';

export const playSound = async (audioUrl: string) => {
  console.log(`Playing sound from: ${audioUrl}`);
  // In a real app, you would use Expo Audio or a similar library here.
  // For now, we just simulate playback.
  return new Promise(resolve => setTimeout(resolve, 500));
};

export const playHaptic = async () => {
  try {
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  } catch (error) {
    console.warn('Haptics not supported or failed:', error);
  }
};