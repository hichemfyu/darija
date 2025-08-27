import React, { useEffect } from 'react';
import { Text, StyleSheet } from 'react-native';
import Animated, { 
  useSharedValue, 
  useAnimatedStyle, 
  withTiming, 
  withSequence,
  runOnJS
} from 'react-native-reanimated';

interface XPGainProps {
  amount: number;
  visible: boolean;
  onAnimationComplete: () => void;
}

export function XPGain({ amount, visible, onAnimationComplete }: XPGainProps) {
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(0.8);

  useEffect(() => {
    if (visible) {
      opacity.value = withSequence(
        withTiming(1, { duration: 200 }),
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 300 }, () => {
          runOnJS(onAnimationComplete)();
        })
      );
      translateY.value = withTiming(-30, { duration: 1500 });
      scale.value = withSequence(
        withTiming(1.2, { duration: 200 }),
        withTiming(1, { duration: 300 })
      );
    } else {
      opacity.value = 0;
      translateY.value = 0;
      scale.value = 0.8;
    }
  }, [visible, opacity, translateY, scale, onAnimationComplete]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [
      { translateY: translateY.value },
      { scale: scale.value }
    ],
  }));

  if (!visible) return null;

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Text style={styles.text}>+{amount} XP</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -30 }, { translateY: -10 }],
    backgroundColor: '#e11d48',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1000,
  },
  text: {
    color: '#ffffff',
    fontFamily: 'Inter-Bold',
    fontSize: 14,
    fontWeight: '700',
  },
});