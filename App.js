import 'react-native-gesture-handler'
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';
import HomeScreen from './src/screens/HomeScreen';
import NewTodo from './src/screens/NewTodo';
import TaskDetails from './src/screens/TaskDetails';
import { Icon } from 'react-native-elements/dist/icons/Icon';
import { StyleSheet } from 'react-native-web';
import { Toast } from 'react-native-toast-message/lib/src/Toast';


const Stack = createNativeStackNavigator();

const ToastRef = React.forwardRef((props, ref) => {
  return <Toast ref={ref}/>;
});

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home"
        screenOptions={{
          headerStyle: {
            backgroundColor: '#DC133B'
          },
          headerTintColor: '#ffffff',
          headerTitleAlign: "center",
        }}
      >
        <Stack.Screen name='My To Do' component={HomeScreen}/>
        <Stack.Screen name='New' component={NewTodo} />
        <Stack.Screen name='Details' component={TaskDetails} />
      </Stack.Navigator>
      <ToastRef ref={Toast} />
    </NavigationContainer>
  )
}

const style = StyleSheet.create({
  headerIcon: {
    marginRight: 10,
    color:'#ffffff'
  }
});