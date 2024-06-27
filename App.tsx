import {View, Text, TouchableOpacity} from 'react-native';
import React from 'react';
import BackgroundService from 'react-native-background-actions';
const sleep = (time: number | undefined) =>
  new Promise(resolve => setTimeout(() => resolve(), time));

const veryIntensiveTask = async taskDataArguments => {
  // Example of an infinite loop task
  const {delay} = taskDataArguments;
  await new Promise(async resolve => {
    for (let i = 0; BackgroundService.isRunning(); i++) {
      console.log(i);
      await BackgroundService.updateNotification({
        taskDesc: 'timer application' + i,
      });
      await sleep(delay);
    }
  });
};

const options = {
  taskName: 'Example',
  taskTitle: 'ExampleTask title',
  taskDesc: 'ExampleTask description',
  taskIcon: {
    name: 'ic_launcher',
    type: 'mipmap',
  },
  color: '#ff00ff',
  linkingURI: 'yourSchemeHere://chat/jane', // See Deep Linking for more info
  parameters: {
    delay: 5000,
  },
};

const App = () => {
  const startBackgroundService = async () => {
    await BackgroundService.start(veryIntensiveTask, options);
    await BackgroundService.updateNotification({
      taskDesc: 'timer application',
    });
  };
  const stopBackgroundService = async () => {
    await BackgroundService.stop();
  };
  return (
    <View
      style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 20,
      }}>
      <Text>App</Text>
      <View style={{gap: 20}}>
        <TouchableOpacity
          onPress={() => {
            startBackgroundService();
          }}>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 40,
              paddingVertical: 10,
              paddingHorizontal: 30,
              backgroundColor: '#000000',
            }}>
            <Text style={{color: '#FFFFFF', fontSize: 16}}>start</Text>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => {
            stopBackgroundService();
          }}>
          <View
            style={{
              borderWidth: 1,
              borderRadius: 40,
              paddingVertical: 10,
              paddingHorizontal: 30,
              backgroundColor: '#000000',
            }}>
            <Text style={{color: '#FFFFFF', fontSize: 16}}>stop</Text>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default App;
