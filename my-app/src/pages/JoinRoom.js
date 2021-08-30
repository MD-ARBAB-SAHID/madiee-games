import React from "react"
import {useState} from "react"
import { useRef } from "react";
import { useHistory } from "react-router-dom";
import Styles from "./JoinRoom.module.css"
const JoinRoom = (props)=>{
    const {socket} = props;
    const name = useRef();
    const roomNo = useRef();
    const history = useHistory();
    const [isValid,setIsValid] = useState("");
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
            socket.emit("join_room",details);
            socket.on("response-join",(response)=>{
                setIsValid("Valid");
                history.replace(`/client-room/${socket.id}/${response.roomNo}`)

            })
            socket.on("response-join-fail",(isvalid)=>{
                setIsValid("Invalid")
            })
    }

           

    }
        

    return (
        <div className={Styles.form}>
        <form onClick={submitHandler}>
        <h1>Join A Room</h1>
            <input type="text" placeholder="Enter your name " ref={name}/>
            <input type="text" placeholder="Create 6 digit room" ref={roomNo}/>
            {isValid==="Invalid" && <p>Invalid Room Code.Cannot join room</p>}
            <button type="submit">Submit</button>
            </form>
            </div>

    )
}


export default JoinRoom;