// App.js
import './PushNotificationConfig';

import React, {useState, useEffect} from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
import BackgroundTimer from 'react-native-background-timer';
import PushNotification from 'react-native-push-notification';

const App = () => {
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);

  useEffect(() => {
    let intervalId: number;

    if (isRunning) {
      intervalId = BackgroundTimer.setInterval(() => {
        setSeconds(prevSeconds => prevSeconds + 1);
        sendNotification(seconds + 1);
      }, 1000);
    } else if (!isRunning && seconds !== 0) {
      BackgroundTimer.clearInterval(intervalId);
    }

    return () => BackgroundTimer.clearInterval(intervalId);
  }, [isRunning]);

  const sendNotification = (seconds: number) => {
    const formattedTime = formatTime(seconds);
    PushNotification.localNotification({
      channelId: 'timer-channel',
      autoCancel: true,
      bigText: `Timer is running: ${formattedTime}`,
      subText: 'Click to view the timer',
      title: 'Timer Notification',
      message: `Timer is running: ${formattedTime}`,
      playSound: true,
      soundName: 'default',
    });
  };

  const startTimer = () => {
    setIsRunning(true);
  };

  const stopTimer = () => {
    setIsRunning(false);
    PushNotification.cancelAllLocalNotifications();
  };

  const resetTimer = () => {
    setSeconds(0);
    setIsRunning(false);
    PushNotification.cancelAllLocalNotifications();
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(
      2,
      '0',
    )}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <View style={styles.container}>
      <Text style={styles.timerText}>{formatTime(seconds)}</Text>
      <View style={styles.buttonContainer}>
        <Button
          title={isRunning ? 'Pause' : 'Start'}
          onPress={isRunning ? stopTimer : startTimer}
        />
        <Button title="Reset" onPress={resetTimer} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  timerText: {
    fontSize: 48,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '60%',
  },
});

export default App;
