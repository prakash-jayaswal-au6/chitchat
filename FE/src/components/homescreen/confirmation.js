import React,{useEffect, useState} from 'react';
import {useParams } from 'react-router-dom';

const Confimation = () => {
    const [userConfimation, setUserConfirmation] = useState(0)
    const {token } = useParams()
    console.log(token)
    
    useEffect(() => {
        fetch(`/confirmation/${token}`, {
            method:"GET",
            headers:{
                "Content-Type":"application/json"
            }
        }).then(res => res.json())
        .then(result => {
           // console.log(result)
            if(result.message){
                setUserConfirmation(result.message)
            }else{
                setUserConfirmation(result.error)
            }
            
        })
    }, [])
    console.log(userConfimation)
    return (
        <>
            <div className="row">
                <div className="col s12 m6">
                    <div className="card green darken-1">
                        <div className="card-content white-text">
                            <span className="card-title">{userConfimation}</span>
                            <p>Thank You</p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Confimation;