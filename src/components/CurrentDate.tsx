interface DateProps{
    className?: string;
}

const CurrentDate = ({className}: DateProps) => {

    const todayDate = new Date();

    const weekday = todayDate.toLocaleDateString('en-US', {weekday: 'short'});
    const day = todayDate.toLocaleDateString('en-US', {day: '2-digit'});
    const month = todayDate.toLocaleDateString('en-US', {month: 'short'});

    const todayString = `${weekday} ${day} ${month}`;

  return (
   <p className={className}>{todayString}</p>
  )
}

export default CurrentDate