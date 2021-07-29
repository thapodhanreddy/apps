import {USERS_POSTS_STATE_CHANGE,USERS_DATA_STATE_CHANGE,CLEAR_DATA} from '../constants/index';

const initialState = {
    users:[],
    usersLoaded:0  /*feed:[] */
};

export const users = (state=initialState,action)=>{
    switch(action.type){
        case USERS_DATA_STATE_CHANGE:
            return{
                ...state,
                users:[...state.users,action.user]
            }
        case USERS_POSTS_STATE_CHANGE:
            return{
                ...state,
                usersLoaded:state.usersLoaded+1,
                users:state.users.map(user=>user.uid === action.id ? /**feed:[...state.feed,...action.posts] */
                                        {...user,posts:action.posts}:
                                         user)
            }
           /* case USERS_LIKES_STATE_CHANGE:
                return{
                    ...state,
                    feed:state.feed.map(post=>post.id==action.postid?{
                        ...post,currentuserlike:actionuserlike
                    }:post)
                }*/
        case CLEAR_DATA:
            return{
                users:[],
                usersLoaded:0
            }
       
        default:
            return state;

    }
    
}