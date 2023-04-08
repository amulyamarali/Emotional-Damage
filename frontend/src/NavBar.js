import { useNavigate } from 'react-router-dom'
import './NavBar.css'

export default function(){

	// const navigate = useNavigate();
	// const gotoHome = ()=>{navigate('/home')}
	// const gotoProducts = ()=>{navigate('/products')}
	// const gotoAnalyse = ()=>{navigate('/analyse')}

	return(
		<div className='NavBar'>
			<div id='left'>
				<p id='title' className='NavbarText'>Damage</p>
				<p className='NavbarText'>Home</p>
				<p className='NavbarText'>Analyse</p>
				<p className='NavbarText'>About</p>
			</div>
			<div id='right'>
				<p className='NavbarText'>Log In</p>
			</div>
		</div>
	)
}