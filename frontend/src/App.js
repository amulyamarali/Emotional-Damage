import logo from './logo.svg';
import './App.css';
import NavBar from './NavBar'
import { gotoAnalyse } from './NavBar';
import { useNavigate } from 'react-router-dom'

function App() {

  // const navigate = useNavigate(); 

	// const gotoAnalyse = navigate('/analyse')

  return (
    <div className="App">
      <NavBar></NavBar>
      <div id='heading-img-ctn'>
        <h1 onClick={gotoAnalyse}>Damage</h1>
        <img src={require('./assets/homeimg-removebg.png')} ></img>
      </div>
    </div>
  );
}

export default App;
