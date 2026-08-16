import StreakBadge from "./StreakBadge";
import type { streakState } from "../types";

interface HeaderProps{
  onClick: () => void;
  currentStreakState?: streakState;
  count: number
}

const Header = ({onClick, count, currentStreakState}: HeaderProps) => {

  //const [currentStreakState, setStreakState] = useState<streakState>('dead');

  return (
    <div className="header-bar">
        <img className="header-logo" src="/glass-logo-lockup.svg"/>
        <h1 className="app-header" style={{fontSize: '50px'}}>
          {`Welcome to Glass.dev!`}<StreakBadge streakState={currentStreakState} count={count}/>
        </h1>

        <button type="button" className="btn logout" onClick={onClick}>Logout</button>
    </div>
  )
}

export default Header