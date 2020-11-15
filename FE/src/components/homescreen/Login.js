import React, {useState, useContext, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import { UserContext } from '../../App';
import M from 'materialize-css';
import logo from '../Chit2.png'


const Login = () => {
    const {state, dispatch} = useContext(UserContext)
    const history = useHistory()   
    const [password, setPassword] = useState("")
    const [email, setEmail] = useState("")

    const PostData = () => {  
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid email", classes:"#f44336 red"})
            return
        }
        if(!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/.test(password)){
            M.toast({html: "Invalid password", classes:"#f44336 red"})
            return
        }
        fetch("/login", {
            method:"post",
            headers: {
                "Content-Type":"application/json"         
            },
            body:JSON.stringify({          
                password,
                email
            })
            }).then(res =>res.json())
            .then(data => {
               // console.log(data)
               if(data.error) {
                    M.toast({html: data.error, classes:"#f44336 red"})
               }
               else {
                   localStorage.setItem("jwt",data.Token)
                   localStorage.setItem("user",JSON.stringify(data.user))
                   dispatch({type:"USER", payload:data.user})
                   M.toast({html:"Logged in successfully",classes:"#43a047 green darken-1"})
                   history.push('/')
               }
            }).catch(err => {
                console.log(err)
            })
    }


    return (
        <>
        <nav>
        <div className="nav-wrapper #e8eaf6 indigo lighten-5">
          <Link to={state? "/":"/login"} className="brand-logo left">
            <img className="nav-logo" src={logo}></img>
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            <li key="6"><Link to='/login'><i className="material-icons">login</i></Link></li>
            <li key="7"><Link to="/register">Register</Link></li>
          </ul>
        </div>
        </nav>
        <div className="landing-page">
            <div className="cont">
                <div className="form sign-in">
                    <h2>Sign In</h2>
                <label>
                    <span>Email Address</span>
                    <input type="email" name="email"value={email} onChange={(e) => setEmail(e.target.value)}/>
                </label>
                <label>
                    <span>Password</span>
                    <input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </label>
                <button className="submit" type="button" onClick={() =>PostData()}>Sign In</button>
                <p className="forgot-pass"><Link to='/reset'>Forgot Password ?</Link></p>
            </div>
            <div className="sub-cont">
                <div className="img">
                    <div className="img-text m-up">
                        <h2>New here?</h2>
                        <p>Sign up and discover great amount of new opportunities!</p>
                        <h5><Link to='/register'>Don't have an Account?</Link></h5>
                    </div>
                </div>
            </div>
        </div>
    </div>
    </>
    )
}

export default Login;