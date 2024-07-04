import { format, parseISO } from "date-fns";

export const DateFormat = "MMMM dd, yyyy";
export const TimeFormat = "hh:mm a";

export const formatDateRange = ({ from, to }: { from: string; to: string }) => {
  const fromDate = parseISO(from);
  const toDate = parseISO(to);

  const sameYear = fromDate.getFullYear() === toDate.getFullYear();

  const fromFormat = sameYear ? "MMM dd" : "MMM dd, yyyy";
  const toFormat = "MMM dd, yyyy";

  const formattedFrom = format(fromDate, fromFormat);
  const formattedTo = format(toDate, toFormat);

  return `${formattedFrom} - ${formattedTo}`;
};

export const formatTimestamp = (timestampString: string, toFormat: string) => {
  const timestamp = Number(timestampString);
  const date = new Date(timestamp);
  if (toFormat === "Date") {
    return format(date, DateFormat);
  } else if (toFormat === "Time") {
    return format(date, TimeFormat);
  }
};

export const calculatePercentage = (amount: number, total: number) => {
  if (total === 0) return 0;
  return Math.floor((amount / total) * 100);
};

export const isOverdue = (timestamp: string) => {
  const date = new Date(timestamp);
  const currentDate = new Date();
  const days60Ago = new Date(currentDate.setDate(currentDate.getDate() - 60));

  return date < days60Ago;
}