import React, {useState, useContext, useEffect} from 'react';
import { useHistory } from 'react-router-dom';
import M from 'materialize-css';

const ChangePassword = () => {
    const [oldPassword, setOldPassword] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const history = useHistory()


    const PostData = () => {  
        //console.log(oldPassword,newPassword,confirmPassword)
        if(!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/.test(newPassword)){
            M.toast({html: "Choose new password in correct format", classes:"#f44336 red"})
            return
        }
        if(!(newPassword === confirmPassword)){
            M.toast({html: "new password and confirm password should be same", classes:"#f44336 red"})
            return
        }
        fetch("/changepassword", {
            method:"put",
            headers: {
                "Content-Type":"application/json",
                "Authorization": "jwt "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({          
                oldPassword,
                newPassword,
                confirmPassword
            })
            }).then(res =>res.json())
            .then(data => {
                //console.log(data)
                if(data.error){
                  return  M.toast({html: data.error, classes:"#f44336 red"})
                }else{
                    M.toast({html:data.message,classes:"#43a047 green darken-1"})  
                    history.push('/profile')
                }
                
            }).catch(err => {
                console.log(err)
            })
        
    }


    return (
        <div className="landing-page">
            <div className="cont">
                <div className="form sign-in">
                    <h2>Change Password</h2>
                <label>
                    <span>Old Password</span>
                    <input type="password" value={oldPassword} onChange={(e) => setOldPassword(e.target.value)}/>
                </label>
                <label>
                    <span>New Passsword</span>
                    <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} />
                </label>
                <label>
                    <span>Confirm New Passsword</span>
                    <input type="text" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
                </label>
                <button className="submit" type="button" onClick={() =>PostData()}>Change Password</button>
            </div>

        </div>
    </div>
    )
}

export default ChangePassword;