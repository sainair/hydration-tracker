import type { streakState } from "../types";

interface StreakBadgeProps{
    streakState?: streakState;
    count?: number;
}

const StreakBadge = ({streakState, count}: StreakBadgeProps) => {
  return (
    <div className="streak-badge">
       <img src={`/streak-${streakState}.svg`} />
       <span className="streak-count">{count}</span>
    </div>
  )
}

export default StreakBadge