import React, {useState, useEffect, useContext,useRef} from 'react';
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'
import M from 'materialize-css';


const Home = () => {
    const [items, setItems] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [show,setShow] = useState(false)
    const [users,setUser] = useState([])
    const RecomModal = useRef(null)
    
    useEffect(()=>{
        M.Modal.init(RecomModal.current)
      },[])

    //to see all post on home
    useEffect(() => {
        fetch('/allPost', {
            headers: {
                "Content-Type":"application/json",
                "Authorization": "jwt "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(data => {
           //  console.log(data)
            setItems(data.posts)
        })

    }, [])

    useEffect(()=>{
        fetch("/recomendation",{
            methos:"get",
            headers:{
                "Authorization":"jwt "+localStorage.getItem("jwt")
            }
        }).then(res =>res.json())
        .then(results=>{
            //console.log("users",results)
            setUser(results.users)
        })
    },[])

    //to like post
    const likePost = (id)=>{
        fetch('/like',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"jwt "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
          const newData = items.map(item=>{
              if(item._id == result._id){
                  return result
              }else{
                  return item
              }
          })
          setItems(newData)
        }).catch(err=>{
            console.log(err)
        })
  }
  //to unlicke post
  const unlikePost = (id)=>{
        fetch('/unlike',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"jwt "+localStorage.getItem("jwt")
            },
            body:JSON.stringify({
                postId:id
            })
        }).then(res=>res.json())
        .then(result=>{
            //console.log(result)
          const newData = items.map(item=>{
              if(item._id==result._id){
                  return result
              }else{
                  return item
              }
          })
          setItems(newData)
        }).catch(err=>{
          console.log(err)
      })
  }

  //for create comments
  const makeComments = (text,postId) => {
      fetch('/comment',{
          method:"put",
          headers:{
            "Content-Type":"application/json",
            "Authorization":"jwt "+localStorage.getItem("jwt")
          },
          body:JSON.stringify({
              postId,
              text
          })
      }).then(res=>res.json())
      .then(result=>{
          //console.log(result )
          const newData = items.map(item=>{
            if(item._id==result._id){
                return result
            }else{
                return item
            }
        })
        setItems(newData)
      }).catch(err=>{
          console.log(err)
      })
  }

  //for delete the post
  const deletePost = (postid) => {
      fetch(`/deletepost/${postid}`,{
          method:'delete',
          headers:{
              Authorization:"jwt "+localStorage.getItem("jwt")
          }
      }).then(res=>res.json())
      .then(result=>{
          //console.log(result)
          M.toast({html:"Deleted post successfully",classes:"#43a047 green darken-1"})
          const newData = items.filter(item=>{
              return item._id !==result._id
          })
          setItems(newData)
      })
  }

  const toogle=()=>{
    setShow(!show)
}

console.log(items)

    return (

        <div className="row">

        <div className="col s3">
        <>
 <div className="card1" >
    <div className="header" style={{marginTop:"52px",marginLeft:"0px",fontSize:"26px"}}>Suggested for you</div>
  {users.slice(2,).map(user=>{ return(
    <div className="card horizontal" >  
      <div className="card-image">
        <img style={{width:"60px",height:"60px",borderRadius:"160px",marginTop:"25px",marginLeft:"5px"}}  src={user.pic} />
      </div>
      <Link to={user._id !== state._id?"/profile/"+ user._id:"/profile"}>
        <div className="card-content">
          <p style={{fontWeight:"bold",textAlign:"left",marginTop:"0px"}}>{user.name} </p>
          <h6 style={{textAlign:"left"}}>{user.email}</h6>
        </div>
      {/* </div> */}
      </Link>
    </div>
     )
    })}

<p data-target="modal12"  className=" modal-trigger" style={{marginLeft:"32%",color:"blue"}}>See more</p>
  </div>

  {/* ......modal......... */}
  <div style={{color:"black"}} id="modal12" className="modal" ref={RecomModal}>
    <div className="modal-content">
      <h5>Suggestions for you</h5>
   
    <ul className="collection">
            {users.map(item=>{ 
                 
                return(
            <Link to={item._id !== state._id?"/profile/"+ item._id:"/profile"} onClick={()=>{
            M.Modal.getInstance(RecomModal.current).close()}} ><li className="collection-item avatar">
            <img style={{width:"52px",height:"52px",borderRadius:"190px",marginTop:"8px"}} src={item.pic}  alt="pic" className="circle"/>
            <span className="title"><h6 style={{textAlign:"left",fontWeight:"bold",paddingLeft:"2px"}}>{item.name}</h6></span>
            <span>{item.email}</span>
          </li></Link> 
         )})}  
        
      </ul>
    </div>
    
  </div>
  
</>
        </div>
  
        <div className="col s9">
         <div className='home'>
             {items.map(item => { 
                    return ( 
                        <div className='card home-card' key={item._id}>
                            <div className="home-image-upper-box">
                                <div>
                                    <img id="home-user-image" src={item.postedBy.pic} / >
                                    <h5 style={{display:'inline'    }}><Link to={item.postedBy._id !== state._id ? '/profile/'+item.postedBy._id : '/profile'}>{item.postedBy.name}</Link></h5>
                                </div>
                                    <div>
                                    {item.postedBy._id == state._id && <i className="material-icons" style={{float:"right"}} 
                                    onClick={()=>deletePost(item._id)}>delete</i>}
                                    </div>
                            </div>
                            

                            <div className='image-card'>
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                            <p id ="time">uploaded on :{item.createdAt}</p> 
                            <h6 id="img-title">{item.title}</h6>
                            <p className="comment-body">{item.body}</p>
                                {item.likes.includes(state._id)
                                ? 
                                <i className="material-icons" style={{ color:"blue"}}
                                        onClick={()=>{unlikePost(item._id)}}
                                >thumb_up</i>
                                : 
                                <i className="material-icons"
                                onClick={()=>{likePost(item._id)}}
                                >thumb_up</i> 
                                }
                                <i className="material-icons comments" onClick={()=>toogle()}>comment</i>{item.comments.length}
                                <p>{item.likes.length} likes</p>
                                {
                                    item.comments.map(record=>{
                                        return(
                                            <>
                                            {show?<h6 className="comment-body" key={record._id}><span style={{fontWeight:"bold"}}>{record.postedBy.name}</span>{record.text}</h6>:""}
                                            </>
                                        )
                                    })
                                }
                                {
                                    show?<form onSubmit={(e)=>{
                                            e.preventDefault()
                                            makeComments(e.target[0].value,item._id)
                                            e.target.reset();
                                            }}>
                                            <input type='text' placeholder='Add comment'  />
                                        </form>:""   
                                }
                            </div>
                        </div>
                    )
                 }) 
                
                 } 
            </div>
        </div>
  
      </div>
    )
}

export default Home;