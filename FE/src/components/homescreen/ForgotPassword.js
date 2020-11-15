import React, {useState, useContext, useEffect} from 'react';
import { useHistory} from 'react-router-dom';
import M from 'materialize-css';

const ForgotPassword = () => {
    const [email, setEmail] = useState("")
    const history = useHistory()
    
    const PostData = () => {    
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid email", classes:"#f44336 red"})
            return
        }     
        fetch("/reset-password", {
            method:"post",
            headers: {
                "Content-Type":"application/json",
            },
            body:JSON.stringify({          
                email
            })
            }).then(res =>res.json())
            .then(data => {
                //console.log(data)
                if(data.error){
                  return  M.toast({html: data.error, classes:"#f44336 red"})
                }else {        
                    M.toast({html:data.message,classes:"#43a047 green darken-1"})
                    history.push('/login')
                }
                
            }).catch(err => {
                console.log(err)
            })
        
    }


    return (
        <div className="landing-page">
            <div className="cont">
                <div className="form sign-in">
                    <h2>Reset Password</h2>
                <label>
                    <span>Email</span>
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </label> 
                <button className="submit" type="button" onClick={() =>PostData()}>Submit</button>
            </div>
        </div>
    </div>
    )
}

export default ForgotPassword;