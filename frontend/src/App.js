import logo from './logo.svg';
import './App.css';
import NavBar from './NavBar'

function App() {
  return (
    <div className="App">
      <NavBar></NavBar>
      <div id='heading-img-ctn'>
        <h1>Damage</h1>
        <img src={require('./assets/homeimg.jpg')} ></img>
      </div>
      {/* <h1>hello</h1> */}
    </div>
  );
}

export default App;
