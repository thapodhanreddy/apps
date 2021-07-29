import React, { Component } from 'react';
import firebase  from 'firebase';
import { View,Text } from 'react-native';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';



import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {fetchUser,fetchUserPosts,fetchUserFollowing,clearData} from './redux/actions/index';
import FeedScreen from './main/Feed';
import ProfileScreen from './main/Profile';
import AddScreen from './main/Add';
import SearchScreen from './main/Search';

const Tab = createMaterialBottomTabNavigator();

const EmptyScreen = ()=>{
  return (null)
}




 export class Main extends Component {
    componentDidMount(){
      const firebase = require('firebase');
        this.props.clearData();
        this.props.fetchUser();
        this.props.fetchUserPosts();
        this.props.fetchUserFollowing();
    }
    render() {
      
      return(
        <Tab.Navigator  initialRouteName="Feed" labeled={false} >
          <Tab.Screen name="Feed" component={FeedScreen} 
          options={{
            tabBarIcon:({color,size})=>(
              <MaterialCommunityIcons name="home" color={color} size={26}/>
            )
          }} />
          <Tab.Screen name="MainAdd" component={EmptyScreen} 
          options={{
            tabBarIcon:({color,size})=>(
              <MaterialCommunityIcons name="plus-box" color={color} size={26}/>
            )
          }} 
          listeners={({navigation})=>({
            tabPress: event =>{
              event.preventDefault();
              navigation.navigate("Add")
            }
          })}/>
          <Tab.Screen name="Search" component={SearchScreen} navigation={this.props.navigation}
           options={{
             tabBarIcon:({color,size})=>(
               <MaterialCommunityIcons name="magnify" color={color} size={26}/>
             )
           }} />
          <Tab.Screen name="Profile" component={ProfileScreen}
          listeners={({navigation})=>({
            tabPress: event =>{
              event.preventDefault();
              navigation.navigate("Profile",{uid:firebase.auth().currentUser.uid})
            }
          })} 
          options={{
            tabBarIcon:({color,size})=>(
              <MaterialCommunityIcons name="account-circle" color={color} size={26}/>
            )
          }} />
        </Tab.Navigator>
      
        
        )
}

}

const mapStateToProps = (state)=>({
    currentUser:state.userState.currentUser
  })

const mapDispatchProps = (dispatch)=>bindActionCreators({fetchUser,fetchUserPosts,fetchUserFollowing,clearData},dispatch);

export default connect(mapStateToProps,mapDispatchProps)(Main);
