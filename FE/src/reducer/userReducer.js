export const initialState = null
export const reducer = (state, action) => {
     if(action.type === 'USER') {
         return action.payload
     }
     if(action.type === 'CLEAR') {
         return null
     }
     if(action.type === "UPDATE PIC") {
         return {
             ...state,
             pic:action.payload
         }
     }
     if(action.type === "UPDATE"){
         return {
             ...state,
             followers:action.payload.followers,
             following:action.payload.following,

         }
     }
     if(action.type === "GET_CHATS"){
        return {
            ...state,
            chats:action.payload
        }
    }
    if(action.type === "AFTER_POST_MESSAGE"){
        return {
            ...state,
            chats:state.chats.concat(action.payload)
        }
    }
     return state
 }