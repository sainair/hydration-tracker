interface HeaderProps{
  onClick: () => void;
}

const Header = ({onClick}: HeaderProps) => {


  return (
    <div className="header-bar">
        <img className="header-logo" src="/glass-logo-lockup.svg"/>
        <h1 className="app-header" style={{fontSize: '50px'}}>
          {`Welcome to Glass.dev!`}
        </h1>

        <button type="button" className="btn logout" onClick={onClick}>Logout</button>
    </div>
  )
}

export default Header