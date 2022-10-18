export function convertMinutesToHourString(minutesAmount:number){
    const hours:string = Math.floor(minutesAmount/60).toString()
    const minutes:string = ((minutesAmount%60)*60).toString()
    return `${String(hours).padStart(2,'0')}:${String(minutes).padEnd(2,'0')}`
}