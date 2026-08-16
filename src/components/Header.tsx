import StreakBadge from "./StreakBadge";
import type { streakState } from "../types";

interface HeaderProps{
  onClick: () => void;
  currentStreakState?: streakState;
  count: number
}

const APP_NAME = import.meta.env.VITE_APP_NAME;

const Header = ({onClick, count, currentStreakState}: HeaderProps) => {

  //const [currentStreakState, setStreakState] = useState<streakState>('dead');

  return (
    <div className="header-bar">
        <img className="header-logo" src="/glass-logo-lockup.svg"/>
        <h1 className="app-header" style={{fontSize: '50px'}}>
          {`Welcome to ${APP_NAME}!`}<StreakBadge streakState={currentStreakState} count={count}/>
        </h1>

        <button type="button" className="btn logout" onClick={onClick}>Logout</button>
    </div>
  )
}

export default Header