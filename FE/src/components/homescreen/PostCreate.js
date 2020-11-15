import React,{useState, useEffect} from 'react';
import M from 'materialize-css';
import { useHistory } from 'react-router-dom'

const PostCreate = () =>{
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [image, setImage] = useState("")
    const [url, setUrl] = useState("")
    useEffect(() => {
        //console.log(url)
        if(url){
            const token = localStorage.jwt
            fetch('/createpost', {
                method:"post",
                headers: {
                    "Content-Type":"application/json",
                    "Authorization":`jwt ${token}`
                },
                body:JSON.stringify({
                   title,
                   body,
                   photo:url
                })
                }).then(res =>res.json())
                .then(data => {
                    //console.log(data)
                   if(data.error) {
                        M.toast({html: data.error, classes:"#f44336 red"})
                   }
                   else {
                       M.toast({html:"Post created successfully",classes:"#43a047 green darken-1"})
                       history.push('/explore')
                   }
                }).catch(err => {
                    console.log(err)
                })
        }
        },
     [url])

    const postDetails = () => { 
        if(!title||!body || !image){
            M.toast({html: "Please Fill all details", classes:"#f44336 red"})
            return
        }
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
 
    return (
        <div className='card input-field'
        style={{ margin:"30px auto", maxWidth:"500px",
        padding:"20px",textAlign:"center"}}>
            <input  type='text' 
            placeholder='Title'
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            />
            <input  type='text' 
            placeholder='Description'
            value={body}
            onChange={(e) => setBody(e.target.value)}
            />
            <div className="file-field input-field">
            <div className="btn #42a5f5 blue lighten-1">
                <span>Upload Image</span>
                <input type="file" onChange={(e) =>setImage(e.target.files[0])}/>
            </div>
            <div className="file-path-wrapper">
                <input placeholder="Choose Image" className="file-path validate" type="text" />
            </div>
            </div>
            <button className='btn waves-effect waves-light #42a5f5 lighten-1'
            onClick={() => postDetails()}>Submit post</button>
            
        </div>
    )
}

export default PostCreate;