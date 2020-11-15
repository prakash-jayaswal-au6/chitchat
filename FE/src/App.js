import React, {useEffect, createContext, useReducer, useContext} from 'react';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Switch, useHistory,Link } from 'react-router-dom';
import './App.css';


import Home from './components/homescreen/Home';
import Login from './components/homescreen/Login';
import Register from './components/homescreen/Register';
import Profile from './components/homescreen/Profile';
import Confimation from './components/homescreen/confirmation';
import PostCreate from './components/homescreen/PostCreate';
import {reducer, initialState} from './reducer/userReducer'
import UserProfile from './components/homescreen/UserProfile';
import LikePost from './components/homescreen/LikePost';
import ChangePassword from './components/homescreen/Changepassword';
import ForgotPassword from './components/homescreen/ForgotPassword';
import NewPassword from './components/homescreen/NewPassword'
import SubscribedUsersPost from './components/homescreen/SubscribeUsersPost'
import Chat from './components/homescreen/Chat'

export const UserContext = createContext()

const Routing=() =>{
  const history = useHistory()
  const { state,dispatch } = useContext(UserContext)
  useEffect(()=>{
    const user = JSON.parse(localStorage.getItem("user"))
    if(user) {
      dispatch({type:"USER",payload:user})
    }
    else {
      if(!history.location.pathname.startsWith(`/confirmation`))   
          if(!history.location.pathname.startsWith(`/reset`))
              history.push('/login')  
    }
  },[])
  
  return (
      <Switch>
      <Route exact path='/' component={SubscribedUsersPost}/>
      <Route path='/login'component={Login} />
      <Route path='/register' component={Register}/>
      <Route path="/confirmation/:token" component={Confimation} />
      <Route exact path='/profile' component={Profile}/>
      <Route path='/create' component={PostCreate} />
      <Route path="/profile/:userid" component={UserProfile} />
      <Route path="/likepost" component={LikePost} />
      <Route path="/changepassword" component={ChangePassword} />
      <Route exact path="/reset" component={ForgotPassword} />
      <Route path="/reset/:token" component = {NewPassword} />
      <Route path="/explore" component={Home} />
      <Route path="/privateChat/:name/:id" component={Chat} />
      </Switch>
    
  );
}
function App (){
  const [state,dispatch] = useReducer(reducer,initialState)
  if(state){
    return ( 
      <UserContext.Provider value={{state,dispatch}}>
      <Router>
        <Navbar/>
        <Routing />
      </Router>
      </UserContext.Provider>
    )
  } else{
    return(
      <UserContext.Provider value={{state,dispatch}}>
      <Router>
        <Routing />
      </Router>
      </UserContext.Provider>
    )
  }
 
}
export default App;
