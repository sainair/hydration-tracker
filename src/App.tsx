//import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

//Component imports
import Header from './components/Header';
import Card from './components/Card';
import CurrentDate from './components/CurrentDate';
import Login from './components/Login';

import { useEffect, useState } from 'react';



function App() {

  //API
  const API = "http://localhost:8000"

  //STATES
  //loading state so that unloaded values are not flashed to the user
  const [loading, setLoading] = useState(true);
  const [token ,setToken] = useState<string | null>(null)
  //Attempt to add functionality to the buttons
  const [entries, setEntries] = useState([])
  const count = entries.length;
  const target = 7;


  const loadEntries = async () => {
    const res = await fetch(`${API}/entries/today`, {
      method: "GET",
      headers: {Authorization: `Bearer ${token}`}
    });
    const data = await res.json();
    setEntries(data);
    setLoading(false);
  }

  useEffect(() => {
    if (!token) return;
    loadEntries();
  }, [token]);

  const addCup = async () => {
    if(count >= target) return;
    const res = await fetch(`${API}/entries/`, {
      method: "POST",
      headers: {Authorization: `Bearer ${token}`}
    });
    const entry = await res.json();
    setEntries([...entries, entry]);
  }

  const undoCup = async () => {
    if(entries.length === 0) {
      console.log("Nothing to UNDO!");
      return;
    };

    const recent = entries[entries.length - 1];

    await fetch(`${API}/entries/${recent.id}`, {
      method: "DELETE",
      headers: {Authorization: `Bearer ${token}`}
    });

    setEntries(entries.filter((entry) => entry.id !== recent.id));
  }

  if(!token)
  {
    return(
      <Login onLogin={setToken}/>
    )
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
      } heading={loading ? "Loading..." :`${count} out of ${target} cups`} className="card-test">

        {loading ? <p>Loading...</p> : <div className='log-container'>
          {Array.from({length: target}, (_, i) => (
            <div key={i} className={(i+1) <= count ? 'cup-filled' : 'cup-empty'} />
          ))}
        </div>}
        <div className="d-flex justify-content-center">
          
          <button type='button' className="btn btn-success add-btn" onClick={addCup}>+Add a cup</button>
        </div>
        <button className="undo" onClick={undoCup}>Undo</button>

      </Card>
    </>
    
  )
}

export default App
