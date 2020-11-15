import React, { useState, useEffect, useRef } from "react";
import io from "socket.io-client";

const Chat = ({match})=> {
  const [yourID, setYourID] = useState();
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [User,setUsers] = useState([])
  
//taking friend id and name from params
const friendId = match.params.id;
const friendName = match.params.name;
//console.log("friend",friendName)
const socketRef = useRef();
  // fetching chats of users
  const getChats = (id) => {
    fetch(`/getChat/${id}`, {
        method:"get",
        headers: { "Authorization":"jwt "+localStorage.getItem("jwt") },
      }).then(res=>res.json())
      .then((response) => {
        //console.log("res",response)
         setMessages(response);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    socketRef.current = io.connect('/');
    const token = localStorage.getItem("jwt") 
    const payload = JSON.parse(atob(token.split(".")[1]));
   // console.log("payload",payload)
    socketRef.current.emit("your id",payload.userId)
      setYourID(payload.userId);
      //console.log("id",payload.userId)
      const user = JSON.parse(localStorage.getItem("user"))
      setUsers(user)
     // console.log(user)
    
    socketRef.current.on("message", ({body,from,to}) => {
        //console.log("here",to,body,from);
        const t={
          body,
          from,
          to,
        }
       // console.log(t)
        receivedMessage(t);
      });
      getChats(match.params.id,match.params.name)
  }, []);

  function receivedMessage(message) {
   // console.log(message)
    setMessages(msgs => [...msgs, message]);
   // console.log(message)
  }

  function sendMessage(e) {
    e.preventDefault();
    const messageObject = {
        body: message,
        from: yourID,
        to:friendId,
        name:friendName
        
      };
      
    //console.log(messageObject)
    let msg = setMessages([...messages, messageObject]);
    //console.log(msg)
    setMessage("");
    socketRef.current.emit("send message", messageObject);
  }

  function handleChange(e) {
    setMessage(e.target.value);
  }
 
  

  return (
    <div className="Page">
       <p className="ppp">{friendName}</p>
      <div className="Container">
        {messages.map((message, index) => {
          if (message.from === yourID) {
            return (
              <>
              <div style={{overflowWrap:"break-word"}} className="MyRow" key={index}>
                <div style={{overflowWrap:"break-word"}} className="MyMessage">
           <div className="mes" style={{overflowWrap:"break-word"}}>&nbsp;&nbsp;{message.body}&nbsp;&nbsp;</div>
           <label style={{float:"right",marginRight:"4px"}}>{User?User.name:""}</label>
                </div>
              </div>
              </>
            )
          }
      else{
        return (
          <>
            <div className="PartnerRow" key={index}>
              <div className="">
              </div>
              <div className="PartnerMessage">
              <div style={{overflowWrap:"break-word"}}  className="mes1">&nbsp;&nbsp;{message.body} &nbsp;&nbsp;</div>
              <label style={{float:"left",marginLeft:"4px"}}>{friendName}</label>
             </div> 
            </div>
            </>
          )
         }
      })}
       </div>
              <form className="Form" onSubmit={sendMessage}>
                <input  className="TextArea" size="4"  value={message} onChange={handleChange} placeholder="Say something..." />
                <button disabled={!message} className="Button" class="btn waves-effect waves-light green" type="submit" name="action">Send
                <i class="material-icons right">send</i>
                </button>
              </form>
              
        </div>
  );
};

export default Chat; 