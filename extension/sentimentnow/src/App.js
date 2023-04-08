/*global chrome*/
import { useState } from 'react';
import './App.css';
// const axios = require('axios/dist/browser/axios.cjs')
import axios from "axios";

function App() {
  const [first, setfirst] = useState(1);
  let userurl=null;
  function getopenedurl(){
    return  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      userurl = tabs[0].url;
  });
  }
  function posttobknd(obj){
let backurl = "http://172.16.128.38:5000/";
console.log("sending to bakck",obj["url"])
axios.post(backurl,obj,{headers : {"Content-Type" : "application/json"}})
  }
  function openurlsendback(){
     getopenedurl();
    setTimeout(() => {
      posttobknd({"url" : userurl})
    }, 400);
    
  }

  function wr(){
    setfirst(first+1)

    openurlsendback();
   
  }
  

  return (
    <div >
     <p>I am sathvik {first}</p>
     <button onClick={wr} >er</button>
    </div>
  );
}

export default App;
