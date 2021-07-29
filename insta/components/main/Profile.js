import React,{useState,useEffect} from 'react';
import firebase from 'firebase';
require('firebase/firestore');
import { View,Text,Image,FlatList,StyleSheet,Button } from 'react-native';

import {connect } from 'react-redux';
export  function Profile(props) {
   
    const [userPosts,setUserPosts] = useState([]);
    const [user,setUser] = useState(null);
    const [following ,setFollowing] = useState(false);
    

    useEffect(()=>{
        const {currentUser,posts} =props;
        if(props.route.params.uid===firebase.auth().currentUser.uid){
            setUser(currentUser);
            const postArray = [posts[0].downloadURL,posts[1].downloadURL]
            setUserPosts(postArray);
        }else{
            firebase.firestore()
            .collection("users")
            .doc(props.route.params.uid)
            .get()
            .then((snapshot)=>{
                if(snapshot.exists){
                    setUser([snapshot.data().name,snapshot.data().email]);
                }
                else{
                    console.log('does not exist');
                }
            })
            firebase.firestore()
            .collection("posts")
            .doc(props.route.params.uid)
            .collection("userPosts")
            .orderBy("creation","asc")
            .get()
            .then((snapshot)=>{
                let posts = snapshot.docs.map(doc=>{
                    const data = doc.data().downloadURL;
                    const id = doc.id;
                    return data;
                    
                });
                setUserPosts(posts);
                
            })
    
        }

        if(props.following.indexOf(props.route.params.uid) > -1){
            setFollowing(true);
        }
        else{
            setFollowing(false);
        }
        
        
    },[props.following,props.route.params.uid]);

    const onFollow = ()=>{
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .set({})
    }

    const onUnfollow = ()=>{
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .doc(props.route.params.uid)
        .delete()
    }

    const onLogout = ()=>{
        firebase.auth().signOut();
    }


    if(user===null||userPosts===undefined){
        return(
            <View></View>
        )
    }

    

    return (
       
        <View style={{flex:1}} >
            <View style={{marginTop:5}} >
            <Text>{user[0]}</Text>
            <Text>{user[1]}</Text>
            {props.route.params.uid !== firebase.auth().currentUser.uid ? (
                <View>
                    {following ? (
                        <Button
                            title="Following"
                            onPress={()=>onUnfollow()} />
                    ):(
                        <Button
                            title="Follow"
                            onPress={()=>onFollow()} />)
                        }
                </View>
                         ):<Button
                            title="Logout"
                             onPress={()=>onLogout()} />}
            </View>
            <View style={{flex:1}} >
            <Image style={{flex:1,aspectRatio:1/1}}
                source={{uri:userPosts[0]}}/>
            <Image style={{flex:1,aspectRatio:1/1}}
                source={{uri:userPosts[1]}}/>
            </View>
        </View>
        
    )
}

const mapStateToProps = (state)=>({
    currentUser:state.userState.currentUser,
    posts:state.userState.posts,
    following:state.userState.following
})


export default connect (mapStateToProps,null)(Profile);

