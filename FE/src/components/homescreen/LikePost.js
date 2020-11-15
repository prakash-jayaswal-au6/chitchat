import React,{useState,useEffect,useContext} from 'react'
import {UserContext} from '../../App'


const LikePost  = ()=>{
    const [items,setItems] = useState([])
    const {state,dispatch} = useContext(UserContext)
    useEffect(()=>{
       fetch('/getsubpost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
          // console.log(result)
           setItems(result.posts)
       })
    },[])

    const likePost = (id)=>{
          fetch('/like',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=>res.json())
          .then(data=>{
                    // console.log(data)
            const newData = items.map(item=>{
                if(item._id == data._id){
                    return data
                }else{
                    return item
                }
            })
            setItems(newData)
          }).catch(err=>{
              console.log(err)
          })
    }

    const unlikePost = (id)=>{
          fetch('/unlike',{
              method:"put",
              headers:{
                  "Content-Type":"application/json",
                  "Authorization":"Bearer "+localStorage.getItem("jwt")
              },
              body:JSON.stringify({
                  postId:id
              })
          }).then(res=>res.json())
          .then(data=>{
              //console.log(data)
            const newData = items.map(item=>{
                if(item._id == data._id){
                    return data
                }else{
                    return item
                }
            })
            setItems(newData)
          }).catch(err=>{
            console.log(err)
        })
    }
 
    return (
       <div className="home">
           {items.map(item=>{
                   return(
                       <div className="card home-card" key={item._id}>                      
                            <div className="card-image">
                                <img src={item.photo}/>
                            </div>
                            <div className="card-content">
                            
                            {item.likes.includes(state._id)
                            ?                             
                             <i className="material-icons" style={{ color:"blue"}}
                                    onClick={()=>{unlikePost(item._id)}}
                              >favorite_border</i>
                            :             
                            <i className="material-icons" style={{ color:"red"}}
                            onClick={()=>{likePost(item._id)}}
                            >favorite</i>
               }  
                                <h6>{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                <form>
                                  <input type="text" placeholder="add a comment" />  
                                </form>       
                            </div>
                        </div> 
                   )
               })
           }         
       </div>
   )
}


export default LikePost;