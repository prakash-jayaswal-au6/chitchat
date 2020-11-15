import React,{useEffect, useState, useContext} from 'react';
import { UserContext } from '../../App';
import { useParams ,Link} from 'react-router-dom';


const Profile = () => {
    const [userProfile, setUserProfile] = useState(null)
    const {state, dispatch } = useContext(UserContext)
    const{userid} = useParams()
    const [showFollow,setShowFollow] =  useState(state?state.following.includes(userid):true)   
   // console.log(showFollow)
    useEffect(() => {
        fetch(`/user/${userid}`, {
            headers:{
                "Authorization": "jwt "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(result => {
            //console.log(result) 
            setUserProfile(result)
            //setUserPost(result.posts)
            // console.log(userProfile.user.followers)
        })
    }, [])

    

    const followUser =()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "jwt "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=> res.json())
        .then(data=>{
            //console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            setUserProfile((prevState)=>{
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:[...prevState.user.followers,data._id]
                    }
                }
            })
            setShowFollow(false)
        })
    }

    
    const unfollowUser =()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization": "jwt "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=> res.json())
        .then(data=>{
            //console.log(data)
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
            localStorage.setItem("user",JSON.stringify(data))
            
            setUserProfile((prevState)=>{
                const newFolllower = prevState.user.followers.filter(item=>item !== data._id)
                return{
                    ...prevState,
                    user:{
                        ...prevState.user,
                        followers:newFolllower
                        }
                }
            })
            setShowFollow(true)
        })
    }

    
    return (
       <>
        {userProfile?  
        <>
        <div style={{maxWidth:"550px",margin:"0px auto",marginTop:"100px"}}>
            <div style={{display:"flex",justifyContent:"space-around",margin:"18px 0px", }}>
                <div className="prof">
                    <img className="imgg" style={{width:"170px",height:"170px",borderRadius:"90px",borderColor:"black",
                    marginTop:"15px",}} alt="profile" src = {userProfile.user.pic} />
                </div>
                <div>
                    <div className="pname" 
                       style={{fontSize:"35px",marginTop:"10px"}}>
                           {userProfile.user.name}
                    </div>
                    <p className="ppn" 
                       style={{display:"flex"}}>
                        <i className="icons material-icons">
                            email
                        </i>&nbsp;
                        {userProfile.user.email}
                    </p>
                    <div style={{display:"flex",
                               justifyContent:"space-between",
                               width:"108%",
                               marginTop:"0px"}}>
                        <div>
                            {userProfile.posts.length} Posts
                        </div>
                        <div >
                            {userProfile.user.followers.length} Followers   
                        </div>
                        <div >
                            {userProfile.user.following.length} Following  
                        </div>
                    </div>
                    
                    <div style={{display:"flex",
                               justifyContent:"space-between",
                               width:"108%",
                               marginTop:"0px"}}>
                        <div>
                            {userProfile.user.followers.includes(state._id)?
                            <Link className="waves-effect waves-light btn-small" style={{margin:"20px"}} onClick={() =>unfollowUser()} >Unfollow</Link>
                            : <Link className="waves-effect waves-light btn-small" style={{margin:"20px"}} onClick={() =>followUser()} >Follow</Link>
                                }
                        </div>
                        <div>
                            <Link to={`/privateChat/${userProfile.user.name}/${userProfile.user._id}`}>
                                <a className="waves-effect waves-light blue btn-small" style={{margin:"20px"}}>Send Message</a>
                            </Link>
                        </div>
                    </div>                
            </div>
        </div>    
    </div>
    <div className="gallery">
        {
            userProfile.posts.map(item=>{
                return(
                    <img key={item._id} 
                         data-target="welcome"  
                         className='picture' 
                         src={item.photo} alt={item.title}/>   
                        )
                    })
                }
    </div>
    </>:""}
    </>
    )
}

export default Profile;