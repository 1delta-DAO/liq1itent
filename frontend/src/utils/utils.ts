export const formatNumbersWithDotDelimiter = (value: number): string => {
  return new Intl.NumberFormat("en-US").format(Math.floor(100 * value) / 100);
};

export const formatNumbersWithAbbreviation = (value: number): string | void => {
  if (value > 999 && value < 1000000) {
    return (value / 1000).toFixed(0) + "K";
  } else if (value >= 1000000) {
    return (value / 1000000).toFixed(0) + "M";
  } else if (value < 900) {
    return String(value);
  }
};

export const uuidv4 = (): string => {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0,
      v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
};

export const round = (x: number, decimals = 2): number =>
  Math.round((x + Number.EPSILON) * Math.pow(10, decimals)) /
  Math.pow(10, decimals);
