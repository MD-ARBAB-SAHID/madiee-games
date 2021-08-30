import React, { useEffect,useRef,useState} from "react"
import {  useParams } from "react-router-dom";
import Styles from "./Room.module.css"

const CreatorRoom = (props)=>{
    const {socket} = props;
   
    const params = useParams();
    const [questionAdded,setQuestionAdded] = useState(false);
    const creator = socket.id;
    const roomNo = params.roomNo;
    const [isValid,setIsValid] = useState(false);
    const [isError,setIsError] = useState(null);
    const [isLoading,setIsLoading] = useState(false);
    const Question = useRef();
    const option1 = useRef();
    const option2 = useRef();
    const option3 = useRef();
    const option4 = useRef();
    const Answer = useRef();
   
   

    const submitHandler = (event)=>{
        event.preventDefault();

        const data = {
            id:socket.id,
            question:Question.current.value,
            option1:option1.current.value,
            option2:option2.current.value,
            option3:option3.current.value,
            option4:option4.current.value,
            answer:Answer.current.value,
            roomNo:roomNo
        }

        socket.emit("question-form",data);
        setQuestionAdded(true);
    }

    useEffect(()=>{
        setIsLoading(true);

        socket.emit("verify",{id:creator,roomNo:roomNo});


        socket.on("verify-result",(validity)=>{
            setIsLoading(false);
          
            if(validity)
            {   
                setIsValid(validity);
                
            }
            else{
                setIsValid(false);
                setIsError(true);
            }
        })
        
    },[socket,creator,roomNo])


      
      
    let content = 
    <div className={Styles.form}>
        
        {!questionAdded && <form onSubmit={submitHandler}>
         <h1>{isValid.name},Welcome To Room {roomNo}</h1>
            <input type="text" placeholder="Enter Your Question" id="Question" name="Question" ref={Question}/>
        
           
            <input type="text" placeholder="Enter Option 1" id="option1" name="option1" ref={option1} />
           
            <input type="text" placeholder="Enter Option 2" id="option2" name="option2" ref={option2} />
      
            <input type="text" placeholder="Enter Option 3" id="option3" name="option3" ref={option3} />
        
            <input type="text" placeholder="Enter Option 4" id="option4" name="option4" ref={option4} />
           
            <input type="text" placeholder="Enter Correct Answer" id="Answer" name="Answer" ref={Answer}/>
            <button type="text">Post Question</button>
        </form>
        }
        {
            questionAdded && <>
            <div className={Styles.success}>
            <h1>Question Added.Thank You</h1>
            </div>
           
           

            </>
        
        }
    </div>
    return (
        <>
        {isLoading && !isError && <p>Loading</p>}
        {!isLoading && isError && <p>Invalid Creator</p>}
        {!isLoading && !isError && isValid && content}
       
       
        </>
       
        
        
    )
}


export default CreatorRoom;