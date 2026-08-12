//import { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'

//Component imports
import Header from './components/Header';
import Card from './components/MainCard';
import CurrentDate from './components/CurrentDate';
import Login from './components/Login';

import { useEffect, useState } from 'react';
import { Recents } from './components/Recents';
import Pace from './components/Pace';
import Stats from './components/Stats';

interface DayTotal{
  day: string;
  total: number; 
}

interface Entry{
  amount: number;
  habit_id: number;
  id: number;
  logged_at: string;
}

function App() {

  //API
  const API = "http://localhost:8000"

  //STATES
  //loading state so that unloaded values are not flashed to the user
  const [loading, setLoading] = useState(true);
  const [token ,setToken] = useState<string | null>(null)
  //Attempt to add functionality to the buttons
  const [entries, setEntries] = useState<Entry[]>([]);
  const [history, setHistory] = useState<DayTotal[]>([]);
  
  const [error, setError] = useState("");

  const count = entries.length;
  const target = 7;
  const currentTime = new Date().getHours();

  const loadEntries = async () => {
    try{
      const res = await fetch(`${API}/entries/today`, {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`}
      });
      if(res.status === 401)
      {
        setError("Session expired, logging out")
        setToken(null);
      }
      if(!res.ok)
      {
        setError("Could not fetch today's entries");
        return;
      }
      const data = await res.json();
      setEntries(data);
    }catch{
      setError("Couldn't reach the server");
    }finally{
      setLoading(false);
    }
  }

  const loadHistory = async () => {
    try{
      const res = await fetch(`${API}/history/`, {
        method: "GET",
        headers: {Authorization: `Bearer ${token}`}
      });

      if(res.status === 401)
      {
        setError("Session expired, logging out");
        setToken(null);
        return;
      }

      if(!res.ok){
        setError("Couldn't load activity")
        return;
      }

      const data = await res.json();
      setHistory(data)
    }catch{
      setError("Couldn't reach server")
    }
  }

  useEffect(() => {
    if (!token) return;
    loadEntries();
    loadHistory();
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
      <Header onClick={() => setToken(null)}/>
        {error && <div className="error-ctr">{error}<button className='error-close' onClick={()=>setError("")}>x</button></div>}
      <div className="core-ctr">
        <Stats className="stats-today" count={count} deficit={currentTime < 8 ? 0 : Math.max(0, Math.min(target, Math.round(((currentTime-8)*target)/14)-count))}/>

        <Card
        topContent={
          <div className='d-flex justify-content-between align-items-center mb-2'>
            <p className='today'><strong>Today</strong></p>
            <CurrentDate className='test-date'/>
          </div>
        } heading={loading ? "Loading..." :`${count} out of ${target} cups`} className="card-tracker">
          {loading ? <p>Loading...</p> : <><Pace count={count} />
            <div className='log-container'>
            
            {Array.from({length: target}, (_, i) => (
              <div key={i} className={(i+1) <= count ? 'cup-filled' : 'cup-empty'} />
            ))}
          </div></>}

          <div className="d-flex justify-content-center">
        
            <button type='button' className="btn btn-success add-btn" onClick={addCup}>+Add a cup</button>
          </div>
          <button className="undo" onClick={undoCup}>Undo</button>
        </Card>
        <Recents history={history} className="recent-log"></Recents>
      </div>
    </>
    
  )
}

export default App
