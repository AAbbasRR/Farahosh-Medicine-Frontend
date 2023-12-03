export const dateToPersian = (date, option) => {
  if (!date) return;

  date = new Date(date);
  if (isNaN(date)) return;

  return date.toLocaleDateString('fa-IR', option ?? {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
};

export const formatToIso = (date) => {
  return new Date(date).toISOString().slice(0, 10);
};

export const betweenDateTime = (date) => {
  return date ? new Date(date.setHours(0, 0, 0, 0)).toISOString().slice(0, 19).replace('T', ' ') : null;
};
