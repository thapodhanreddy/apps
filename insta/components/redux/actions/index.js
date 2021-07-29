import firebase from 'firebase';
import {CLEAR_DATA,USER_STATE_CHANGE,USER_POSTS_STATE_CHANGE,USER_FOLLOWING_STATE_CHANGE,USERS_DATA_STATE_CHANGE,USERS_POSTS_STATE_CHANGE} from '../constants/index';


export function clearData(){
    return((dispatch)=>{
        dispatch({type:CLEAR_DATA})
    })
}




export function fetchUser(){
    return ((dispatch)=>{
        firebase.firestore()
        .collection("users")
        .doc(firebase.auth().currentUser.uid)
        .get()
        .then((snapshot)=>{
            const name = snapshot.data().name;
            const email = snapshot.data().email;
            if(snapshot.exists){
                dispatch({type:USER_STATE_CHANGE , currentUser:[name,email]});
            }
            else{
                console.log('does not exist');
            }
        })
    })
}

export function fetchUserPosts(){
    return ((dispatch)=>{
        firebase.firestore()
        .collection("posts")
        .doc(firebase.auth().currentUser.uid)
        .collection("userPosts")
        .orderBy("creation","asc")
        .get()
        .then((snapshot)=>{
            let posts = snapshot.docs.map(doc=>{
                const data = doc.data();
                const id = doc.id;
                return{id,...data}
            })
            dispatch({type:USER_POSTS_STATE_CHANGE,posts})
        })
    })
}

export function fetchUserFollowing(){
    return ((dispatch)=>{
        firebase.firestore()
        .collection("following")
        .doc(firebase.auth().currentUser.uid)
        .collection("userFollowing")
        .onSnapshot((snapshot)=>{
            let following = snapshot.docs.map(doc=>{
                const id = doc.id;
                return id;
            })
            dispatch({type:USER_FOLLOWING_STATE_CHANGE,following});
            for(let i=0;i<following.length;i++){
                dispatch(fetchUsersData(following[i])); /*true */
            }

            
        })
    })
}

export function fetchUsersData(uid){   /*getPosts*/
    return((dispatch,getState)=>{
        const found = getState().usersState.users.some(el=>el.uid===uid);

        if(!found){
            firebase.firestore()
        .collection("users")
        .doc(uid)
        .get()
        .then((snapshot)=>{
            if(snapshot.exists){
                let user = snapshot.data();
                user.uid = snapshot.id;
                dispatch({type:USERS_DATA_STATE_CHANGE,user});
                dispatch(fetchUsersFollowingPosts(user.uid));
                
            }
            else{
                console.log('does not exist');
            }
        })
        /*if(getPosts){
            dispatch(fetchUsersFollowingPosts(user.uid));

        } */
    
        } 

    })
}

export function fetchUsersFollowingPosts(uid){
    const id = uid;
    return ((dispatch,getState)=>{
        firebase.firestore()
        .collection("posts")
        .doc(uid)
        .collection("userPosts")
        .orderBy("creation","asc")
        .get()
        .then((snapshot)=>{

            const user = getState().usersState.users.find(el=>el.uid===id);
            let posts = snapshot.docs.map(doc=>{
                const data = doc.data();
                const id = doc.id;
                return{id,...data,user}
            })
            /**
             * for(let i=0;i<posts.length;i++){
             *              dispatch(fetchusersfollowinglikes(uid,posts[i].id))}
             */
            dispatch({type:USERS_POSTS_STATE_CHANGE,posts,id});
            

            })
            
    })
}

/*export function fetchUsersFollowinglikes(uid,postid){
    const id = uid;
    return ((dispatch,getState)=>{
        firebase.firestore()
        .collection("posts")
        .doc(uid)
        .collection("userPosts")
        .doc(postid)
        .collection('likes')
        .doc(userids)
        .onsnspshot((snapshot)=>{
            const postid =snapsho.query;
            let  currentuserlike = false ;
            if(snapshot.exists){
                currentuserlike= true;
            }
            
            })
            console.log(posts);
            dispatch({type:USERS_LIKES_STATE_CHANGE,postID,currentuserlike});
            console.log(getState());

            })
            
    })
}*/