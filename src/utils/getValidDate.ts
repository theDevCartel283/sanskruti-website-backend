export const getValidDate = (trans_date: string) => {
  const dateString = trans_date;
  const [datePart, timePart] = dateString.split(" ");

  const [day, month, year] = datePart.split("/").map((val) => Number(val));
  const [hours, minutes, seconds] = timePart
    .split(":")
    .map((val) => Number(val));

  const validDate = new Date(
    year,
    month - 1,
    day,
    hours,
    minutes,
    seconds
  ).toString();
  return validDate;
};
