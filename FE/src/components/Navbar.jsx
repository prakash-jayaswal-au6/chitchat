import React,{useContext,useRef,useEffect,useState} from 'react';
import { Link, useHistory} from 'react-router-dom';
import { UserContext } from '../App';
import M from 'materialize-css'
import logo from './Chit2.png'

const Navbar = () => {
  const searchModal = useRef(null)
  const [search,setSearch] = useState('')
  const [userDetails,setUserDetails] = useState([])
  const {state, dispatch } = useContext(UserContext)
  const history = useHistory()
  useEffect(()=>{
      M.Modal.init(searchModal.current)
  },[])

  const renderList = () => {
    if(state) {
      return [
        <li><input type="text" value={search} placeholder="search person" onChange={(e) => fetchUsers(e.target.value)} /></li>,
        <li key="1" id ="search-btn"><i data-target="modal1" className="material-icons modal-trigger">search</i></li>,
        <li key="2"><Link to="/explore"><i className="material-icons">explore</i></Link></li>,
        <li key="3"><Link to='/create'><i className="material-icons">camera_alt</i></Link></li>,
        <li key="4"><Link to="/profile"><i className="material-icons">person</i></Link></li>,
        <li key="5">
          <button className='btn waves-effect waves-light logout'
                    onClick={() =>{
                    localStorage.clear()
                    dispatch({type:"CLEAR"})
                    history.push("/login")
                    }}> <i className="material-icons">power_settings_new</i></button>
        </li>,
        
      ]
    }
  }

  const fetchUsers =(query)=>{
    setSearch(query)
    fetch('/search-users',{
      method:"post",
      headers:{
        "Content-Type":"application/json",
        "Authorization":"jwt "+localStorage.getItem("jwt")
      },
      body:JSON.stringify({
        query
      })
    }).then(res=>res.json())
    .then(results=>{
      console.log(results)
      setUserDetails(results.user)
    }).catch(err=>{
      console.log(err)
    })
  }

    return (
        <nav>
        <div className="nav-wrapper #e8eaf6 indigo lighten-5">
          <Link to={state? "/":"/login"} className="brand-logo left">
            <img className="nav-logo" src={logo}></img>
          </Link>
          <ul id="nav-mobile" className="right hide-on-med-and-down">
            {renderList()}
          </ul>
        </div>
    
    <div id="modal1" className="modal" ref={searchModal} style={{color:"black"}}>
    <div className="modal-content">
        <input type="text" value={search} placeholder="search person" onChange={(e) => fetchUsers(e.target.value)} />
        <ul className="collection">
          {userDetails.map(item=>{
            return  <Link to={item._id != state._id ?"/profile/"+item._id:'/profile'} 
            onClick={()=>{M.Modal.getInstance(searchModal.current).close()
              setSearch('')
            }}>
              <li className="collection-item">{item.email}</li></Link>
          })}
        </ul>
    </div>

    <div className="modal-footer">
      <button className="modal-close waves-effect waves-green btn-flat" onClick={()=>setSearch('')}>Close</button>
    </div>
  </div>
      </nav>
    )
}
export default Navbar;