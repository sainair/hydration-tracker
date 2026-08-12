/* 
I'm going to assume a standard wake up time of 8am, and bed time of 10pm
14 hours to meet your hydration goal of 7 cups a day => at minimum a cup every 2 hours
*/

interface PaceProps{
    count: number;
}

const Pace = ({count}: PaceProps) => {
    const target = 7;
    const start = 8; //8am, day begins
    const awake = 14; //14 hour day assuming a healthy 10pm bed time

    const hours = 12 //new Date().getHours();
    const ideal = Math.min(target, Math.round(((hours - start) * target)/ awake));
    const deficit = ideal - count;
    let message;

    let status;

    if (deficit > 1) {
        status = "#BA7517";
        message = `${deficit} cups behind for this time of day`;
    }
    if (deficit < 1){
        status = "#027067";
        message = "Great pace today!"
    }
    if (deficit === 1){
        status="#027067";
        message = "Remember to drink water!"
    }

  return (
    <div className="pace-ctr">
        <span></span>
        <p className="pace-text" style={{"color": status}}>{message}</p>
    </div>
  )
}

export default Pace