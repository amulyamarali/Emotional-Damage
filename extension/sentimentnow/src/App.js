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
  let userurl=null;

  const [forBar, setForBar] = useState([2, 3, 1, 4, 5])

	let temp = getBarData(forBar)
	const [barData, setBarData] = useState(temp);

  function getopenedurl(){
    return  chrome.tabs.query({currentWindow: true, active: true}, function(tabs){
      userurl = tabs[0].url;
  });
  }
  
  function posttobknd(obj){
    let backurl = "http://172.16.128.2  8:5000/";
    console.log("sending to bakck",obj["url"])
    // setBarData(getBarData([1, 5, 3, 2, 3]))
		// return;
    axios.post(backurl,obj,{headers : {"Content-Type" : "application/json"}})
    .then(res=>{
      //fetching from backend code
        let temp = [0, 0, 0, 0, 0];
        res["data"][1].forEach(e=>{
          temp[e-1] += 1
        })

        let temp2 = getBarData(temp)
        setBarData(temp2)
    })
    
    }

  function openurlsendback(){
    getopenedurl();
    setTimeout(() => {
      posttobknd({"url" : userurl})
    }, 80);
    
  }

  function wr(){
    setfirst(first+1)

    openurlsendback();
  
  }
    

  return (
    <div id='App'>
      {/* <p>I am sathvik {first}</p> */}
      <p>Damage</p>
      <div id='analyse-btn-ctn'>
					<p onClick={wr} id='analyse-btn'>Analyse</p>
			</div>
      <Bar
        data={barData}
        options={barOptions}
			></Bar>
    </div>
  );
}

export default App;
