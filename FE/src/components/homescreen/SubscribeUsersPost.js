import React, {useState, useEffect, useContext} from 'react';
import {UserContext} from '../../App'
import {Link} from 'react-router-dom'

const Home = () => {
    const [items, setItems] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [show,setShow] = useState(false)
    //to see all post on home
    useEffect(() => {
        fetch('/subscriptionpost', {
            headers: {
                "Authorization": "jwt "+localStorage.getItem("jwt")
            }
        }).then(res => res.json())
        .then(data => {
           // console.log(data)
            setItems(data.posts)
        })

    }, [])

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
          //  console.log(result)
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
         // console.log(result )
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
          const newData = items.filter(item=>{
              return item._id !==result._id
          })
          setItems(newData)
      })
  }

  const toogle=()=>{
    setShow(!show)
}

    return (
        <div className='home'>
            {items.length==0?
            <div class="row" style={{margin:"10%",width:"100%"}}>
            <div class="col s12 m6">
              <div class="card green darken-1">
                <div class="card-content white-text">
            <span class="card-title">no post found...</span>
            <Link to="/explore" className="page" style={{color:"black"}}>Explore and follow people to see their posts</Link>
                </div>
              </div>
            </div>
          </div>:
              <> {
              items.map(item => { 
                    return ( 
                        <div className='card home-card' key={item._id}>
                            <div className="home-image-upper-box">
                                <div style={{display:"flex",justifyContent:"left"}}>
                                    <img id="home-user-image" src={item.postedBy.pic} />
                                    <h5><Link sty to={item.postedBy._id !== state._id ? '/profile/'+item.postedBy._id : '/profile'}
                                 >{item.postedBy.name}</Link></h5>
                                </div>
                            </div>   

                            <div className='image-card'>
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">
                            <p id ="time">uploaded on :{item.createdAt}</p> 
                            <h6 id="img-title">title:{item.title}</h6>
                            <p className="comment-body">desc:{item.body}</p>
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
                                            {show?<h6 className="comment-body" key={record._id}><span style={{fontWeight:"bold"}}>{record.postedBy.name}&nbsp;</span>{record.text}</h6>:""}
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
                 </> 
                }
        </div>
            
    )
}

export default Home;