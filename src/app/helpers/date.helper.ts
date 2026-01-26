
export function diffInDaysFromToday(date: Date) {
  const target = new Date(date);
  const today = new Date();
  const timeDiff = target.getTime() - today.getTime();
  return Math.ceil(timeDiff / (1000 * 3600 * 24));
}
