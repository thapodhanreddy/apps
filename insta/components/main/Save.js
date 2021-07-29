import React from 'react';
import { View,TextInput,Image,Button } from 'react-native';
import firebase from 'firebase';
require('firebase/firestore');
require('firebase/firebase-storage');
import { useState } from 'react';

export default function Save(props) {
   const [caption, setCaption] = useState("");
   const uploadImage = async ()=>{
       const uri = props.route.params.image;
       const childPath = `post/${firebase.auth().currentUser.uid}/${Math.random().toString(36)}`;
       const response = await fetch(uri);
       const blob = await response.blob();

       const task = firebase.storage().ref().child(childPath).put(blob);

       const taskProgress = snapshot =>{
           console.log(`transferred:${snapshot.bytesTransferred}`)
       };
       const taskCompleted = ()=>{
           task.snapshot.ref.getDownloadURL().then((snapshot)=>{
               savePostData(snapshot);
               
           })
       }
       const taskError = snapshot=>{
           console.log(snapshot);
       }

       task.on("state_changed",taskProgress,taskError,taskCompleted);

       const savePostData =(downloadurl)=>{
           firebase.firestore().collection('posts').doc(firebase.auth().currentUser.uid)
           .collection('userPosts').add({
               downloadURL:downloadurl,
               caption:caption,
               creation:firebase.firestore.FieldValue.serverTimestamp()
           }).then((function(){props.route.params.navigation.popToTop()}))
       }


   }
    return (
        <View style={{flex:1}}>
            <Image source={{uri:props.route.params.image}}/>
            <TextInput placeholder="write a caption"
                        onChangeText={(caption)=>setCaption(caption)}
            />
            <Button title="Save" onPress={()=>uploadImage()}/>
            
        </View>
    )
}