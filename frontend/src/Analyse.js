import { useNavigate } from 'react-router-dom'
import NavBar from './NavBar';
import './Analyse.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

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

const Analyse = ()=> {
	
	const navigate = useNavigate();
	const [commentData, setCommentData] = useState([1, 2, 2, 3, 1, 2, 3, 1, 2, 3, 1])

	const [forBar, setForBar] = useState([2, 3, 1, 4, 5])
	const idk = []

	let temp = getBarData(forBar)
	const [barData, setBarData] = useState(temp);

	const fetchFromBackend = (url)=> {
		setBarData(getBarData([1, 5, 3, 2, 3]))
		return;
		let inp = document.getElementById('inp-in')
		axios.post("http://172.16.128.97:5000/", {
			"url": ""
		})
		.then((res)=>{
			// console.log(res["data"][0], res["data"][1])
			let temp = [0, 0, 0, 0, 0];
			res["data"][1].forEach(e=>{
				temp[e-1] += 1
			})

			let temp2 = getBarData(temp)
			setBarData(temp2)
			// console.log(JSON.parse(res["data"]))
		})
		// console.log('adfkndaskf')
	}

	return (
		<div id='Analyse'>
			<NavBar></NavBar>
			<div  id='input-ctn'>
				{/* <p>URL: </p> */}
				<input id='url-in' type='text' placeholder='URL' ></input>
				<div id='analyse-btn-ctn'>
					<p onClick={fetchFromBackend} id='analyse-btn'>Analyse</p>
				</div>
			</div>
			<div id='graph-ctn'>
				<div id='bar-ctn'>
					<Bar
						data={barData}
						options={barOptions}
					></Bar>
				</div>
				<div id='doughnut-ctn'>
					<Doughnut
						data={barData}
						options={DoughnutOptions}
					></Doughnut>
				</div>
			</div>
		</div>
	)
}

export default Analyse;