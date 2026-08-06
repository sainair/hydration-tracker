//import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css'

//Component imports
import Header from './components/Header';
import Card from './components/Card';
import CurrentDate from './components/CurrentDate';



function App() {
  //const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Card 
      topContent={
        <div className='d-flex justify-content-between align-items-center mb-2'>
          <p className='today'><strong>Today</strong></p>
          <CurrentDate className='test-date'/>
        </div>
      } heading='X out of Y cups' className="card-test">
        
        <div className="d-flex justify-content-center">
          <button type='button' className="btn btn-success add-btn">+Add a cup</button>
        </div>
        <a className="undo">Undo</a>

      </Card>
    </>
    
  )
}

export default App
