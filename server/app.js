const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());
let Room = [];
let Client = []
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  socket.on("create_room",(data)=>{
    const valid = Room.some((element)=>{
      return element.roomNo===data.roomNo;
    })
    if(valid)
    {
      socket.emit("response-create-fail","Invalid");
    }
    else{
      const newData = {
        name:data.name,
        roomNo:data.roomNo,
        id:data.id
      }
      Room.push(newData);
     
      socket.emit("response-create",{roomNo:data.roomNo});
    }
      
  })

  socket.on("join_room", (data) => {
   
    const isValid = Room.some((element)=>{
      
      return element.roomNo === data.roomNo;
    })

    if(isValid)
    {   const clientData = {
      id:data.id,
      name:data.name,
      roomNo:data.roomNo
    }
    Client.push(clientData);
   
      socket.emit("response-join",{roomNo:data.roomNo});
      
    }
    else{
      socket.emit("response-join-fail",isValid);
    }
      
    
  });

  socket.on("verify", (data) => {
    const isValid = Room.find((element)=>{
      return ((element.id===data.id)&&(element.roomNo===data.roomNo))
    })
    if(isValid)
    {
      socket.emit("verify-result",{name:isValid.name});
    }
    else{
      socket.emit("verify-result",false);
    }
    
   
    
  });

  socket.on("verify-client",(data)=>{
    const isValid = Client.find((element)=>{
      return ((element.id===data.id)&&(element.roomNo===data.roomNo))
    })
    if(isValid)
    {
      const room = Room.find((element)=>{
        return element.roomNo===data.roomNo;
      })
  
      const details = {
        name:isValid.name,
        roomNo:data.roomNo,
        questionDetails:{
          question:room.question,
          option1:room.option1,
          option2:room.option2,
          option3:room.option3,
          option4:room.option4
  
        }
      }
      socket.emit("verify-result-client",details);
    }
    else{
      socket.emit("verify-result-client-fail",isValid);
    }
    
    
  })

  socket.on("question-form",(data)=>{

    const index = Room.findIndex((element)=>{
      return (element.id===data.id && element.roomNo===data.roomNo)
    })
    let changedData = Room[index];
 
    changedData  = {
      ...changedData,
      question:data.question,
      option1:data.option1,
      option2:data.option2,
      option3:data.option3,
      option4:data.option4,
      answer:data.answer
    }

    Room[index] = changedData;

    
    
  })

  socket.on("result",(data)=>{
     const index =  Client.findIndex((element)=>{
        return (element.id===data.id && element.name===data.name && element.roomNo===data.roomNo)
      })

      const client = Client[index];
      const changedData = {
        ...client,
        answer:data.ans
      }
      const room = Room.find((element)=>{
        return element.roomNo===data.roomNo;
      })
      let score;

      room.answer===data.ans ? score=1 : score=0;
      
      const resultAnalysis = {
        YourAnswer:data.ans,
        CorrectAns:room.answer,
        Score:score
      } 

      const ownerAnalysis = {
        YourAnswer:data.ans,
        Name:client.name,
        Score:score
      }
      socket.emit("result-analysis",resultAnalysis);
      // socket.emit("result-analysis-owner",ownerAnalysis);
  })

  socket.on("disconnect", () => {
    
    Room = Room.filter((element)=>{
      
      return element.id!==socket.id;
    })
    Client = Client.filter((element)=>{
      return element.id!==socket.id;
      
    })
   
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});