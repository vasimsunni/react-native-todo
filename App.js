import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, ScrollView, View } from 'react-native';


const Data = () => {
  return (
    Array.apply(null, { length: 100 }).map((e, i) => (
      <Text style={styles.text}>Think outside the box!</Text>
    ))
  );
}

const ScrollViewData = () =>{
return (
<ScrollView>
  <Data />
</ScrollView>
);
}

const AppHeader = () => {
  return (
    <View style={{height:50, backgroundColor:'#2c3e50', alignContent:'center', alignItems:'center'}}>
      <Text style={{fontSize:25, marginTop:10, fontWeight:'900', color:'#fff'}}>My First App</Text>
    </View>
  )
}
const AppFooter = () => {
  return (
    <View style={{height:12, backgroundColor:'#2c3e50', alignContent:'center', alignItems:'center'}}>
      <Text style={{fontSize:9, color:'#fff'}}>Powerd by: React Native</Text>
    </View>
  )
}

export default function App() {
  return (
    <View style={styles.container}>
      <AppHeader  style={styles.appHeader}/>
     <ScrollViewData />
     <AppFooter style={styles.appFooter}/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff'  
  },
  text:{
    alignSelf:'center',
    padding:15,
    borderBottomWidth:1
  },
  appHeader:{
    alignSelf:'flex-start'
  },
  appFooter :{
    alignSelf:'flex-end'
  }
});
