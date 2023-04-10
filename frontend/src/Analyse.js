import { useNavigate, useSearchParams} from 'react-router-dom'
import NavBar from './NavBar';
import './Analyse.css'
import { useState, useEffect } from 'react';
import axios from 'axios';

import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import Divider from '@mui/material/Divider';

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
	const [commentData, setCommentData] = useState([])
	const [loading, setloading] = useState(false); //for gif

	const [searchParams] = useSearchParams();
  	// console.log(searchParams, searchParams.get('url'));

	const [forBar, setForBar] = useState([0, 0, 0, 0, 0])

	let temp = getBarData(forBar)
	const [barData, setBarData] = useState(temp);
	const [commentDisp, setCommentDisp] = useState([])
	const [range, setRange] = useState(3)


	const fetchFromBackend = (url)=> {
		// setBarData(getBarData([1, 5, 3, 2, 3]))
		// return;
		
		setloading(true);
		let inp = document.getElementById('url-in')

		// console.log(inp.value)
		axios.post("http://192.168.3.3:5000/", {
			"url": inp.value
		})
		.then((res)=>{
			// console.log(res["data"][0], res["data"][1])
			
			let initVals = [0, 0, 0, 0, 0];
			let ind;
			let comments = (res["data"])[0]
			let scores = (res["data"])[1]
			setCommentData(scores)
			for (let i=0; i<scores.length; i++){
				ind = scores[i]-1
				initVals[ind] += 1
				// console.log(ind)
			}
			// console.log('testing', initVals)

			// res["data"][1].forEach((e, i)=>{
			// 	// commentDispTemp[e[1]-1].push(e[0])
			// 	temp[e[1]-1] += 1
			// })
			// setCommentDisp(commentDispTemp)

			let temp2 = getBarData(initVals)
			setBarData(temp2)
			setCommentDisp(comments)
			// console.log(JSON.parse(res["data"]))
			setloading(false);
			setRange(3)
		})
		.catch(e=>{
			console.error(e)
			setloading(false)
		})
		
	}
useEffect(()=>{
	setTimeout(() => {
		if (searchParams.get('url')){
			let inp = document.getElementById('url-in')
			if (inp){
				inp.value = searchParams.get('url')
				fetchFromBackend()
			}
			// console.log('fuiyoooh', searchParams.get('url'))
		}
	}, 100);
},[])

	// const getSliderValue = (value) =>{
	// 	return value
	// }
	const setRangeVal = (e) => {
		// console.log('changed', e.target.value)
		setRange(e.target.value)
	}

	const getCommentDisp = (val) => {
		let out = [];
		for (let i=0; i<commentDisp.length; i++){
			if (commentData[i] == range){
				out.push(
					<ListItem key={2*i}>
						<p dangerouslySetInnerHTML={{__html: commentDisp[i]}}></p>
					</ListItem>
					)
				out.push(<Divider key={2*i+1}></Divider>)
			}
		}
		return out
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
			{loading?
				<div id='graph-ctn'>
					<img id='giffy' width={100} src="https://cdn.pixabay.com/animation/2022/10/11/03/16/03-16-39-160_512.gif"/>
				</div>
				:
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
			}
			
			<div id='comdisp-ctn'>
				<p>Comments</p>
				<Box sx={{ width: 300 }}>
					<Slider
						aria-label="Temperature"
						defaultValue={30}
						// getAriaValueText={getCommentDisp}
						onChange={setRangeVal}
						valueLabelDisplay="on"
						valueLabelFormat={(n)=>{
							return ["Terrible", "Unhappy", "Neutral", "Happy", "Awesome"][n-1]
						}}
						step={1}
						marks
						min={1}
						max={5}
					/>
				</Box>
				<div id='comdisp'>
					<Box sx={{ width: '100%' }}>
						<List>
							{getCommentDisp()}
						</List>
					</Box>
				</div>
			</div>
		</div>
	)
}

export default Analyse;