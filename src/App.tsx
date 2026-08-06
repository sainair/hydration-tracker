import { useState } from 'react'
import './App.css'
import Header from './components/Header';
import Card from './components/Card';
import 'bootstrap/dist/css/bootstrap.min.css'


function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <Header />
      <Card heading='Test Card' body='Test this card out with some text'>
        <button type='button' className="btn btn-info">Test</button>
      </Card>
    </>
    
  )
}

export default App
