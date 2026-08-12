interface DayTotal{
    day: string;
    total: number;
}

interface RecentsProps{
    history: DayTotal[];
    className?: string;
}

const label= (day:string) => {
    const d = new Date(day + "T00:00:00");
    const today = new Date;
    today.setHours(0, 0, 0, 0);
    const diff = Math.round((today.getTime() - d.getTime()) / 86400000);
    if(diff === 0) return "Today";
    if(diff === 1) return "Yesterday";
    return d.toLocaleDateString();
};

export const Recents = ({history, className}: RecentsProps) => {

  return (
    <div className={`card ${className}`}>
        <div className="card-body">
            <p className="recents-log-title">Recent Activity</p>
            <ul className="list-group recents-log-list">
                {history.map((d) => (
                    <li className="list-group-item recents-log-items" key={d.day}>{label(d.day)}: {d.total} cups</li>
                ))}
            </ul>
        </div>
    </div>
  )
}
