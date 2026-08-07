import { type ReactNode } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css'

interface CardProps{
    heading: string;
    body?: string;
    topContent?: ReactNode;
    children?: ReactNode;
    className?: string;
}

const Card = ({heading, body, topContent, children, className}:CardProps) => {
  return (
    <div className={`card ${className}`.trim()} style={{width: "18rem"}}>
        <div className={`card-body`}>
            {topContent}
            <h5 className='card-title'>{heading}</h5>
            <p className='card-text'>{body}</p>
            {children}
        </div>
    </div>
  )
}

export default Card