import React from "react"
import {useState} from "react"
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import Styles from "./CreateRoom.module.css"
const CreateRoom = (props)=>{
    const {socket} = props;
    const name = useRef();
    const roomNo = useRef();
    const history = useHistory();
    const [isValid,setIsValid] = useState();
    const submitHandler = (event)=>{
        event.preventDefault();
        if(name.current.value.trim().length===0 || name.current.value.trim() === "")
        {
            console.log("Enter valid details");
            return;
        }
        if(roomNo.current.value.trim().length===0 || roomNo.current.value.trim()==="")
        { console.log("Enter valid details");
            return;
        }
        else{
           
            const details = {
                name:name.current.value,
                roomNo:roomNo.current.value,
                id:socket.id
        }
            socket.emit("create_room",details);
            socket.on("response-create-fail",(data)=>{
                setIsValid("Invalid")
            })
            socket.on("response-create",(response)=>{
                setIsValid("Valid")
                history.push(`/creator-room/${socket.id}/${response.roomNo}`)
            })

            
        }


        



    }
    return (
        <div className={Styles.form}>
        <form onClick={submitHandler}>
                <h1>Create A Room</h1>
            <input type="text" placeholder="Enter your name " ref={name}/>
            <input type="text" placeholder="Create digit room code" ref={roomNo}/>
            {isValid==="Invalid" && <p>Room code already exist,Try another Room code</p>}
            <button type="submit">Submit</button>
        </form>
        </div>
    
    )
}


export default CreateRoom;