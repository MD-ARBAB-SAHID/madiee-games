import React, { useEffect,useState,useRef } from "react"
import { useParams } from "react-router-dom";
import Styles from "./ClientRoom.module.css"
const ClientRoom = (props)=>{
    
    const {socket} = props
    const params = useParams();
    const client = socket.id;
    const roomNo = params.roomNo;
    const [isValid,setIsValid] = useState(false);
    const[details,setDetails] = useState();
    const [isError,setIsError] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const answer = useRef();
    
    const [result,setResult]  =useState();

const submitHandler = (event)=>{
    event.preventDefault();
    const result = {
        id:socket.id,
        name:details.name,
        roomNo:roomNo,
        ans:answer.current.value
    }

    socket.emit("result",result);
}
    useEffect(()=>{
        setIsLoading(true);

        socket.emit("verify-client",{id:client,roomNo:roomNo});


        socket.on("verify-result-client",(details)=>{
            setIsLoading(false);
            setIsValid(true);
           
            setDetails(details);
           
        })
        socket.on("verify-result-client-fail",(validity)=>{
            setIsLoading(false);
            setIsError(true);
        })
        
    },[socket,client,roomNo])

    useEffect(()=>{
        
        socket.on("result-analysis",(data)=>{
            setResult(data);
        })
       
    },[socket])
    return (
        <>
        {isLoading && !isError && <p>Loading</p>}
        {!isLoading && isError && <p>Invalid Creator</p>}
        {!isLoading && !isError && isValid && details && !result && <div className={Styles.form}>
        
        
        
        <form onSubmit={submitHandler}>
        <h1>{details.name} Welcome to Room : {roomNo}</h1>
        <h3>Question : {details.questionDetails.question}</h3>
        <h3>Select Your Answer From the options given below</h3>
        <select name="selected-answer" id="selcted-answer" defaultValue={null} ref={answer}>
            <option value="Not-Selected" >Select Your Answer</option>
            <option value={details.questionDetails.option1}>{details.questionDetails.option1}</option>
            <option value={details.questionDetails.option2}>{details.questionDetails.option2}</option>
            <option value={details.questionDetails.option3}>{details.questionDetails.option3}</option>
            <option value={details.questionDetails.option4}>{details.questionDetails.option4}</option>
        </select>
        
        <button type="submit">Submit Answer</button>
        </form>
     
        </div>
        }
        {
            result && <div className={Styles.success}>
        <div>
        <h3>Your Answer : {result.YourAnswer}</h3>
        <h3>Correct Answer : {result.CorrectAns}</h3>
        <h3>Score : {result.Score}</h3>
    </div>
    </div>
        }
        </>
        
        
    )
}


export default ClientRoom;