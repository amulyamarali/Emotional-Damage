/*global chrome*/
import { useState } from 'react';
import './App.css';
// const axios = require('axios/dist/browser/axios.cjs')
import axios from "axios";

import {Bar, Doughnut} from 'react-chartjs-2'
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	PointElement,
	LineElement,
	Title,
	Tooltip,
	Legend,
	BarController,
	BarElement
  } from 'chart.js/auto';

ChartJS.register(
CategoryScale,
LinearScale,
PointElement,
LineElement,
Title,
Tooltip,
Legend,
);

const barOptions = {
	plugins: {
		title: {
			display: true,
			text: "Bar Chart"
		},
		legend: {
			display: false
		}
	},
}

const DoughnutOptions = {
	plugins: {
		title: {
			display: true,
			text: "Doughnut"
		},
		legend: {
			display: false
		}
	},
}

const getBarData = (forBar)=>{
	return {
		labels: ["Terrible", "Unhappy", "Neutral", "Happy", "Awesome"],
		datasets: [
			{
				label: 'Reviews',
				// borderColor: '#000000',
				data: forBar,
				backgroundColor: [
					'#E34141',
					'#F6D96F',
					'#C1D1F0',
					'#A8E08E',
					'#0DC309',
				],
				borderWidth: 1
			}
		]
	}
}

function App() {
  const [first, setfirst] = useState(1);
  const [loading, setloading] = useState(false);
  let userurl=null;

  const [forBar, setForBar] = useState([0,0,0,0,0])

	let temp = getBarData(forBar)
	const [barData, setBarData] = useState(temp);

  function getopenedurl(){
    return  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      userurl = tabs[0].url;
  });
  }
  
  function posttobknd(obj){
    let backurl = "http://172.16.128.15:5000/";
    console.log("sending to bakck",obj["url"])
    // setBarData(getBarData([1, 5, 3, 2, 3]))
		// return;
    axios.post(backurl,obj,{headers : {"Content-Type" : "application/json"}})
    .then(res=>{
      //fetching from backend code
		console.log(res)
        let temp3 = [0, 0, 0, 0, 0];
        res["data"][1].forEach(e=>{
          temp3[e-1] += 1
        })

        let temp2 = getBarData(temp3)
        setBarData(temp2)
		stopgif()
    })
    
    }

	function startgif(){
		setloading(true)
	}
	function stopgif(){
		setloading(false)
	}

  function openurlsendback(){
    getopenedurl();
	startgif();
    setTimeout(() => {
      posttobknd({"url" : userurl})
	 
	  
    }, 80);
	// setTimeout(() => {
	// 	stopgif();
	// }, 1250);
    
  }

  function wr(){
    setfirst(first+1)

    openurlsendback();
  
  }
  function redirect2web(){
    getopenedurl();
    setTimeout(() => {
      window.open("http://localhost:3000/analyse/?url="+userurl,"__blank")
    }, 80);
    
  
  }

  if (first == 1){
	  wr()
  }
    

  return (
    <div id='App'>
      {/* <p>I am sathvik {first}</p> */}
      <p>Damage</p>
      {/* <div id='analyse-btn-ctn'>
		<p  id='analyse-btn' onClick={wr}>Analyse</p>
		</div> */}
		<br></br>
      <div id='analyse-btn-ctn'>
      <p  id='analyse-btn' onClick={redirect2web}>Go to website</p>
		
		</div>
		{loading?<img width={50} src="https://cdn.pixabay.com/animation/2022/10/11/03/16/03-16-39-160_512.gif" >

</img>:<></>}
      <Bar
        data={barData}
        options={barOptions}
		></Bar>
    </div>
  );
}

export default App;
