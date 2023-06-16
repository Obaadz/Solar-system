export default function secondsToHoursMinutesSeconds(totalSeconds) {
  const totalMinutes = Math.floor(totalSeconds / 60);

  const seconds = totalSeconds % 60,
    hours = Math.floor(totalMinutes / 60),
    minutes = totalMinutes % 60;

  return { hours, minutes, seconds };
}
