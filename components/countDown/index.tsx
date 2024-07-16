import React, {useState, useEffect, useCallback} from 'react';
import {StyleSheet, View, Button} from 'react-native';
import Svg, {Circle} from 'react-native-svg';
import Animated, {
  Easing,
  useSharedValue,
  useAnimatedProps,
  withTiming,
} from 'react-native-reanimated';
import {MD2Colors, Text} from 'react-native-paper';

interface CountdownTimerProps {
  initialSeconds: number;
  onFinish: () => void;
  onReset: () => void;
}

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const CountdownTimer: React.FC<CountdownTimerProps> = ({
  initialSeconds,
  onFinish,
  onReset,
}) => {
  const [timeLeft, setTimeLeft] = useState<number>(initialSeconds);
  const progress = useSharedValue(1);

  useEffect(() => {
    if (timeLeft === 0) {
      onFinish();
      return;
    }

    const timerId = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
      progress.value = withTiming(timeLeft / initialSeconds, {
        duration: 1000,
        easing: Easing.linear,
      });
    }, 1000);

    return () => clearInterval(timerId);
  }, [timeLeft, initialSeconds, onFinish, progress]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleReset = useCallback(() => {
    setTimeLeft(initialSeconds);
    progress.value = 1;
    onReset();
  }, [initialSeconds, onReset, progress]);

  const animatedProps = useAnimatedProps(() => ({
    strokeDashoffset: 2 * Math.PI * 20 * (1 - progress.value),
  }));

  return (
    <View style={styles.container}>
      <Svg height="100" width="100">
        <Circle
          cx="50"
          cy="50"
          r="20"
          stroke="#e6e7e8"
          strokeWidth="2"
          fill="none"
        />
        <AnimatedCircle
          cx="50"
          cy="50"
          r="20"
          stroke="#42a5f5"
          strokeWidth="2"
          fill="none"
          strokeDasharray={2 * Math.PI * 20}
          animatedProps={animatedProps}
        />
      </Svg>
      <Text style={styles.timerText}>{formatTime(timeLeft)}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 15,
    position: 'absolute',
    top: 38,
  },
});

export default CountdownTimer;
