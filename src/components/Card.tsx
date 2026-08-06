import { type ReactNode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

interface CardProps{
    heading: string;
    body: string;
    children?: ReactNode;
}

const Card = ({heading, body, children}:CardProps) => {
  return (
    <div className="card" style={{width: "8 rem"}}>
        <div className="card-body">
            <h5 className='card-title'>{heading}</h5>
            <p className='card-text'>{body}</p>
            {children}
        </div>
    </div>
  )
}

export default Card