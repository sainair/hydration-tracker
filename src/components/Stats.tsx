interface StatsProps{
    className?: string;
    count?: number
    deficit?: number
}

const Stats = ({className, count, deficit}: StatsProps) => {
  return (
    <div className={`card ${className}`}>
    <div className="stats-title">Today</div>
    <div className="stat-row">
        <span className="stat-label">Cups: </span>
        <span className="stat-value">{count}</span>
    </div>
    <div className="stat-row">
        <span className="stat-label">Behind by: </span>
        <span className="stat-value">{deficit}</span>
    </div>
    </div>
  )
}

export default Stats