export function convertISOtoRFC(isoDate: any) {
  const dateObj = new Date(isoDate);

  // Convert to local time and format it as a readable string
  const readableDate = dateObj.toLocaleString();
  return readableDate;
}
