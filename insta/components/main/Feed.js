import React,{useState,useEffect} from 'react';
import { View,Text,Image } from 'react-native';
import firebase from 'firebase';
import 'firebase/firestore';

import {connect } from 'react-redux';
export  function Feed(props) {
    const [a,setA] =useState([]);
    const [y,setY] =useState(null);
    const [z,setZ] =useState(null);
    
        useEffect(()=>{
        
        let posts = [];     /**remove posts */
        if(props.usersLoaded == props.following.length){
            for(let i= 0;i<props.following.length;i++){                             /** */
                const user = props.users.find(el=>el.uid=== props.following[i]);
                if(user != undefined){
                    posts=[...posts,...user.posts];

                }
            }

            posts.sort(function(x,y){           /**props.feed.sort */
                return x.creation-y.creation;
            });
           
            const user = posts.map((item)=>{
                
                return item.user.uid;
            });
            
            setA(user);                     /**setposts(props.feed) */
            setY(posts[0]);
            setZ(posts[1]);
            

            
            
        }

        

    },[props.usersLoaded]);/**props.feed */

    if( y === undefined||z===undefined){
        return(
            <View></View>
        )

    }
    


    if( y === null||z===null){
        return(
            <View></View>
        )

    }
    else{
        return (
       
            <View style={{flex:1}} >
                
                <View style={{flex:1}} >
                    
                <Image style={{flex:1,aspectRatio:1/1}}
                    source={{uri:y.downloadURL}}/>
                    <Text>{y.caption}</Text>
                    <Text onPress={()=>props.navigation.navigate('Comment',[{postId:y.id},{uid:a[0]}])} 
                    >View comments...</Text>
                <Image style={{flex:1,aspectRatio:1/1}}
                    source={{uri:z.downloadURL}}/>
                    <Text>{z.caption}</Text>
                    <Text onPress={()=>props.navigation.navigate('Comment',[{postId:z.id},{uid:a[1]}])} >View comments...</Text>
                </View>
            </View>
            
        )

    }
        
    

    
}

const mapStateToProps = (state)=>({
    currentUser:state.userState.currentUser,
    following:state.userState.following,
    users:state.usersState.users,/**feed:store.usersState.feed */
    usersLoaded:state.usersState.usersLoaded
})


export default connect (mapStateToProps,null)(Feed);



    