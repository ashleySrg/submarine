export const parseISO8601Duration = (duration: string): number => {
  const regex: RegExp = /P(?:([\d.]+)D)?(?:T(?:(\d+)H)?(?:(\d+)M)?(?:(\d+(?:\.\d+)?)S)?)?/;
  const matches: RegExpExecArray | null = regex.exec(duration);
  if (!matches) throw new Error('Invalid duration format');

  const days = parseFloat(matches[1] || '0');
  const hours = parseFloat(matches[2] || '0');
  const minutes = parseFloat(matches[3] || '0');
  const seconds = parseFloat(matches[4] || '0');

  const totalSeconds = hours * 3600 + minutes * 60 + seconds;
  const totalMilliseconds = (days * 24 * 60 * 60 + totalSeconds) * 1000;

  return totalMilliseconds;
}
