const formateDate = (ts) => {
  const d = new Date(ts);
  let fillZero = (num) => {
    return num < 10 ? "0" + num : num;
  };
  return (
      d.getFullYear() +
      "/" +
      fillZero(d.getMonth() + 1) +
      "/" +
      fillZero(d.getDate()) +
      " " +
      fillZero(d.getHours()) +
      ":" +
      fillZero(d.getMinutes()) +
      ":" +
      fillZero(d.getSeconds())
  );
};

export default {
  formateDate
}