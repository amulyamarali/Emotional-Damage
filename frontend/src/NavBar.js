import { useNavigate } from 'react-router-dom'
import './NavBar.css'

let navigate, gotoHome, gotoAnalyse


const NavBar = ()=>{
	navigate = useNavigate();
	gotoHome = ()=>{navigate('/')}
	gotoAnalyse = ()=>{navigate('/analyse')}


	return(
		<div className='NavBar'>
			<div id='left'>
				<p id='title' className='NavbarText' onClick={gotoHome}>Damage</p>
				<p className='NavbarText' onClick={gotoHome}>Home</p>
				<p className='NavbarText' onClick={gotoAnalyse}>Analyse</p>
				<p className='NavbarText' onClick={gotoHome}>About</p>
			</div>
			<div id='right'>
				<p className='NavbarText'>Log In</p>
			</div>
		</div>
	)
}

export {gotoHome, gotoAnalyse}
export default NavBar
