import React,{Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import  firebase from 'firebase';
import firebaseApp from 'firebase/app';
import { View, Text } from 'react-native';
const firebaseConfig = {
  apiKey: "AIzaSyAmF9sf5eK0S_VF_QgayzP60jX_OSNqRiQ",
  authDomain: "instathappu.firebaseapp.com",
  projectId: "instathappu",
  storageBucket: "instathappu.appspot.com",
  messagingSenderId: "582589499848",
  appId: "1:582589499848:web:2d8171d4402ea7e8ba98fd",
  measurementId: "G-DP6N3YFYFP"
};


import { Provider } from 'react-redux';
import { createStore,applyMiddleware } from 'redux';
import rootReducer from './components/redux/reducers/index';
import thunk from 'redux-thunk';

const store = createStore(rootReducer,applyMiddleware(thunk));



import LandingScreen from './components/auth/Landing';
import RegisterScreen from './components/auth/Register';
import LoginScreen from './components/auth/Login';
import MainScreen,{Main}from './components/Main';
import AddScreen from './components/main/Add';
import SaveScreen from './components/main/Save';
import CommentScreen from './components/main/Comment';

const Stack = createStackNavigator();
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


if(firebaseApp.apps.length === 0){
  firebaseApp.initializeApp(firebaseConfig);
}


 class App extends Component {
  constructor(props){
    super(props);
    this.state={
      loaded:false
    }
  }


  componentDidMount(){
    firebase.auth().onAuthStateChanged((user)=>{
      if(!user){
        this.setState({
          loggedIn:false,
          loaded:true
        })
      }
      else{
        this.setState({
          loggedIn:true,
          loaded:true
        })
      }

    })
  }
  
  render() {
    const {loggedIn,loaded} = this.state;
    if(!loaded){
      return(
        <View style={{flex:1,justifyContent:'center'}}>
          <Text>
            loading
          </Text>
        </View>
      )
    };
    if(!loggedIn){
      return (
        <NavigationContainer>
        <Stack.Navigator initialRouteName = "Landing" >
          <Stack.Screen name ="Landing" component = {LandingScreen} options={{headerShown:false}} />
          <Stack.Screen name ="Register" component = {RegisterScreen}  />
          <Stack.Screen name ="Login" component = {LoginScreen} />
        </Stack.Navigator>
      </NavigationContainer>
        
      );

    };
      return (
        <Provider store={store}>
        <NavigationContainer>
        <Stack.Navigator initialRouteName = "Main">
          <Stack.Screen name ="Main" component = {MainScreen}  options={{headerShown:false}} />
          <Stack.Screen name ="Add" component = {AddScreen} navigation ={this.props.navigation}/>
          <Stack.Screen name ="Save" component = {SaveScreen} navigation ={this.props.navigation} />
          <Stack.Screen name ="Comment" component = {CommentScreen} navigation ={this.props.navigation} />
          </Stack.Navigator>    
        </NavigationContainer>
        </Provider>
      );

   
      }
    }
     
    export default App;
