import React, {useState, useEffect} from 'react';
import { Link, useHistory } from 'react-router-dom';
import M from 'materialize-css';
import logo from '../Chit2.png'


const Register = () => {
    const history = useHistory()
    const [name, setName] = useState("")
    const [password, setPassword] = useState("")
    const [password2, setPassword2] = useState("")
    const [email, setEmail] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState(undefined)

    useEffect(() => {
        if(url) {
            uploadFields()
        }
    },[url])

    const uploadPic = () => {
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","chitchat-clone")
        data.append("clound_name","dnjqxnccx")
        fetch("https://api.cloudinary.com/v1_1/dnjqxnccx/image/upload", {
            method:"post",
            body:data
        })
        .then(res =>res.json())
        .then(data => {
            setUrl(data.url)
        }).catch(err => {
            console.log(err)
        })
    }

    const uploadFields = () => {
        if(!name||!email || !password || !password2){
            M.toast({html: "Please Fill all details", classes:"#f44336 red"})
            return
        }
        if(!/^[a-zA-Z ]{3,30}$/.test(name)){
            M.toast({html: "Invalid name", classes:"#f44336 red"})
            return
        }
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)){
            M.toast({html: "Invalid email", classes:"#f44336 red"})
            return
        }
        if(!/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[a-zA-Z!#$%&? "])[a-zA-Z0-9!#$%&?]{8,20}$/.test(password)){
            M.toast({html: "Invalid password", classes:"#f44336 red"})
            return
        }
        if(!(password === password2)){
            M.toast({html: "password and confirm password should be same", classes:"#f44336 red"})
            return
        }
        fetch("/register", {
            method:"post",
            headers: {
                "Content-Type":"application/json"
            },
            body:JSON.stringify({
                name,
                password,
                email,
                pic:url
            })
            }).then(res =>res.json())
            .then(data => {
               if(data.error) {
                    M.toast({html: data.error, classes:"#f44336 red"})
               }
               else {
                   M.toast({html:data.message,classes:"#43a047 green darken-1"})
                   history.push('/login')
               }
            }).catch(err => {
                console.log(err)
            })
    }
    
    const PostData = () => {
        if(image){
            uploadPic()
        } else {
            uploadFields()
        }
        
    }
   
        return (
            <>
            <nav>
                <div className="nav-wrapper #e8eaf6 indigo lighten-5">
                    <Link to="/login" className="brand-logo left">
                        <img className="nav-logo" src={logo}></img>
                    </Link>
                    <ul id="nav-mobile" className="right hide-on-med-and-down">
                        <li key="6"><Link to='/login'><i className="material-icons">login</i></Link></li>
                        <li key="7"><Link to="/register">Register</Link></li>
                    </ul>
                </div>
            </nav>
            <div className="landing-page">
                <div className="cont s-signup">
                    <div className="sub-cont">
                        <div className="img">
                            <div className="img-text2 m-in">
                                <h2>One of us?</h2>
                                <p>If you already has an account, just sign in. We've missed you!</p>
                                <h5><Link to='/login'>Already have an Account?</Link></h5>
                                </div>
                            </div>
                            <div className="form sign-up">
                                <h2>Sign Up</h2>
            <label>
                <span>Name</span>
                <input type="text"placeholder='Enter name (min contain 3 characters)' value={name} onChange={(e) => setName(e.target.value)} />
            </label>
            <label>
                <span>Email</span>
                <input type="email" placeholder='Enter a valid email' value={email} onChange={(e) => setEmail(e.target.value)}/>
            </label>
            <label>
                <span>Password</span>
                <input type="password" placeholder='Password'value={password}
                     onChange={(e) => setPassword(e.target.value)} />
            </label>
            <label>
                <span>Confirm Password</span>
                <input type="password"placeholder='Ponfirm password'
                     value={password2}
                    onChange={(e) => setPassword2(e.target.value)}/>
            </label>
            <div className="file-field input-field">
                        <div className="btn #42a5f5 blue lighten-1">
                             <span>Upload Pic</span>
                                 <input type="file" onChange={(e) =>setImage(e.target.files[0])}/>
                         </div>
                         <div className="file-path-wrapper">
                             <input className="file-path validate" placeholder='Optional' type="text" />
                         </div>
                     </div>
            <button type="button" className="submit" onClick={() =>PostData()}>Sign Up Now</button>
        </div>
    </div>
</div>
        </div>
        </>
        )
    }
    


export default Register;