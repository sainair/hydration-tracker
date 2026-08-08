//import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

//Component imports
import Header from './components/Header';
import Card from './components/Card';
import CurrentDate from './components/CurrentDate';
import { useEffect, useState } from 'react';



function App() {

  //API
  const API = "http://localhost:8000"

  //Attempt to add functionality to the buttons

  const [entries, setEntries] = useState([])
  const count = entries.length;
  const target = 7;

  const loadEntries = async () => {
    const res = await fetch(`${API}/entries/today`, {method: "GET"});
    const data = await res.json();
    setEntries(data);
  }

  useEffect(() => {
    loadEntries();
  }, []);

  const addCup = async () => {
    if(count >= target) return;
    const res = await fetch(`${API}/entries/`, {method: "POST"});
    const entry = await res.json();
    setEntries([...entries, entry]);
  }

  const undoCup = async () => {
    if(entries.length === 0) {
      console.log("Nothing to UNDO!");
      return;
    };
    const recent = entries[entries.length - 1];
    await fetch(`${API}/entries/${recent.id}`, {method: "DELETE"});
    setEntries(entries.filter((entry) => entry.id !== recent.id));
  }

  return (
    <>
      <Header />
      <Card 
      topContent={
        <div className='d-flex justify-content-between align-items-center mb-2'>
          <p className='today'><strong>Today</strong></p>
          <CurrentDate className='test-date'/>
        </div>
      } heading={`${count} out of ${target} cups`} className="card-test">

        <div className='log-container'>
          {Array.from({length: target}, (_, i) => (
            <div key={i} className={(i+1) <= count ? 'cup-filled' : 'cup-empty'} />
          ))}
        </div>
        <div className="d-flex justify-content-center">
          
          <button type='button' className="btn btn-success add-btn" onClick={addCup}>+Add a cup</button>
        </div>
        <button className="undo" onClick={undoCup}>Undo</button>

      </Card>
    </>
    
  )
}

export default App
