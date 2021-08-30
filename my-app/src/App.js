import React from "react";

import './App.css';
import io from "socket.io-client";
import {Route} from "react-router-dom"
import { Switch } from "react-router-dom";
import { Link } from "react-router-dom";
import CreateRoom from "./pages/CreateRoom";
import JoinRoom from "./pages/JoinRoom";

import CreatorRoom from "./pages/Room";
import ClientRoom from "./pages/ClientRoom";
const socket = io.connect("http://localhost:3001")

function App() {
 
  return (
  
    <Switch>
      <Route path="/" exact>
      <div className="Outer">
      <div className="Inner">
        <Link to="/create-room" >Create Room</Link>
        <Link to="/join-room" >Join Room</Link>
        </div>
        </div>
      </Route>
      <Route path="/create-room">
        <CreateRoom socket={socket} />
      </Route>
      <Route path="/join-room">
        <JoinRoom socket={socket} />
      </Route>
      <Route path="/creator-room/:creator/:roomNo" exact>
        <CreatorRoom socket={socket}/>
      </Route>
      <Route path="/client-room/:client/:roomNo">
        <ClientRoom socket={socket}/>
      </Route>
   
    </Switch>
  
    
  );
}

export default App;
