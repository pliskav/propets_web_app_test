const convertTime = (postDate) => {
  const millis = Date.now() - Date.parse(postDate)
    const days = Math.floor(millis / (24 * 60 * 60 * 1000));
    const daysms = millis % (24 * 60 * 60 * 1000);
    const hours = Math.floor((daysms) / (60 * 60 * 1000));
    return days === 0 ? `${hours} hours` : `${days} days ${hours} hours`;
}

export default convertTime