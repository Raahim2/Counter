import { StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import VideoList from './screens/videolist';
import VideoFolderList from './screens/floders';
import VideoScreen from './screens/Video';

const Stack = createNativeStackNavigator();



export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen  name="Home" component={VideoFolderList} options={{ title: 'Home' }} />
        <Stack.Screen  name="Videos" component={VideoList} options={{ title: 'Videos' }} />
        <Stack.Screen  name="VideoScreen" component={VideoScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});
