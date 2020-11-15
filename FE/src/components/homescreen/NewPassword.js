import React, {useState} from 'react';
import { useHistory,useParams } from 'react-router-dom';
import M from 'materialize-css';

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const {token} = useParams()
    //console.log(token)
    const history = useHistory()


    const PostData = () => {  
       // console.log(newPassword,confirmPassword)
        if(!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/.test(newPassword)){
            M.toast({html: "Choose new password in correct format", classes:"#f44336 red"})
            return
        }
        if(!(newPassword === confirmPassword)){
            M.toast({html: "new password and confirm password should be same", classes:"#f44336 red"})
            return
        }
        fetch("/new-password", {
            method:"post",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({          
                password:newPassword,
                token
            })
            }).then(res =>res.json())
            .then(data => {
                //console.log(data)
                if(data.error){
                  return  M.toast({html: data.error, classes:"#f44336 red"})
                }else{
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
                    <h2>Enter New Passsword</h2>
               
                <label>
                    <span>New Passsword</span>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </label>
                <label>
                    <span>Confirm New Passsword</span>
                    <input type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </label>
                <button className="submit" type="button" onClick={() =>PostData()}>Update Password</button>
            </div>

        </div>
    </div>
    )
}

export default ChangePassword;