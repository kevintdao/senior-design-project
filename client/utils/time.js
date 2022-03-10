const formatTime = (hour, min) => {
  let ampm = hour < 12 ? "AM" : "PM";
  let h = hour == 0 ? 12 : hour;
  h = ampm == 'AM' ? h : h - 12;
  h = ampm == 'PM' && h == 0 ? 12 : h;
  let m = min <= 9 ? `0${min}` : min;

  return `${h}:${m} ${ampm}`;
}

export { formatTime }