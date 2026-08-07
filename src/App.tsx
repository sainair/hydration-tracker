//import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

//Component imports
import Header from './components/Header';
import Card from './components/Card';
import CurrentDate from './components/CurrentDate';
import { useState } from 'react';



function App() {
  //Attempt to add functionality to the buttons

  const [count, setCount] = useState(0);
  const target = 7;

  return (
    <>
      <Header />
      <Card 
      topContent={
        <div className='d-flex justify-content-between align-items-center mb-2'>
          <p className='today'><strong>Today</strong></p>
          <CurrentDate className='test-date'/>
        </div>
      } heading={(count <= target && count >= 0) ? `${count} out of ${target} cups` : `${target} out of ${target} cups`} className="card-test">

        <div className='log-container'>
          {Array.from({length: target}, (_, i) => (
            <div key={i+1} className={(i+1) <= count ? 'cup-filled' : 'cup-empty'} />
          ))}
        </div>
        <div className="d-flex justify-content-center">
          
          <button type='button' className="btn btn-success add-btn" onClick={count < target ? () => setCount(count+1) : () => setCount(target)}>+Add a cup</button>
        </div>
        <button className="undo" onClick={count > 0 ? () => setCount(count - 1) : () => setCount(0)}>Undo</button>

      </Card>
    </>
    
  )
}

export default App
