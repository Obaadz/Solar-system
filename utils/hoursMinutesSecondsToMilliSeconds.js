export default function hoursMinutesSecondsToMilliSeconds(time) {
  const hoursInMS = time.hours * 60 * 60 * 1000;
  const minutesInMS = time.minutes * 60 * 1000;
  const secondsInMS = time.seconds * 1000;

  return hoursInMS + minutesInMS + secondsInMS;
}
