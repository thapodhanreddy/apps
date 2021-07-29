import React,{useState,useEffect} from 'react';
import { View,Text,FlatList,TextInput,Button } from 'react-native';

/*import connect 
import bindactioncreators
import fetchusersdata */


export default function Comment(props) {
    const [comments,setComments] = useState([]);
    const [postId,setPostId] = useState("");
    const [text ,setText] = useState("");

    

     useEffect(() => {
        /*function matchUserToComment(comments){
            
            for(let i=0;i<comments.length;i++){
                if(comments[i].hasownproperty('user')){
                continue;
            }
                const user = props.user.find(x=>x.id===comments[i].creator)
                if(user==undefined){
                    props.fecthusersdata(comments[i].creator,false)
                }else{
                    comments[i].user = user;
                }
            }
            setComments(comments)
        } */


         if(props.route.params[0] !== postId){
            firebase.firestore()
            .collection("posts")
            .doc(props.route.params[1])
            .collection("userPosts")
            .doc(props.route.params[0])
            .collection('comments')
            .get()
            .then((snapshot)=>{
                let comments = snapshot.docs.map(doc=>{
                    const data = doc.data();
                    const id =doc.id;
                    return{id,...data};
                })
                setComments(comments);/*matchusertocomment(comments) */
                
            })
            setPostId(props.route.params[0]);/*props.users */
         }/*else{
             matchusertocomment(comments)
         } */
         
        
    }, [props.route.params[0]])
    
    
        
    return (
        <View>
            <FlatList
            numColumns={1}
            horizontal={false}
            data={comments}
            renderItem={({item})=>(
                <View>
                    <Text>{item.text}</Text>
                </View>
                /*<View>
                    <Text>{item.user.name}</Text>
                </View> */
            )}   />
            
        </View>
    )
}

/*const mapStateToProps = (state)=>({
    users:state.usersState.users
  })

const mapDispatchProps = (dispatch)=>bindActionCreators({fetchUsersdata},dispatch);

export default connect(mapStateToProps,mapDispatchProps)(comment);
 */
