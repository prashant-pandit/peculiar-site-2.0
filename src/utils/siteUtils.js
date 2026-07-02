export const monthFormatter = new Intl.DateTimeFormat("en-US", {
  month: "long",
  year: "numeric",
});

export const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

export function formatBookingMessage({
  name,
  eventDate,
  eventType,
  contactMethod,
  contactValue,
  projectDetails,
}) {
  return `New Booking Inquiry

Name / Organization: ${name}
Event Date: ${eventDate}
Event Type: ${eventType}
Contact (${contactMethod}): ${contactValue}

Event Details:
${projectDetails}`;
}

export function formatDate(date) {
  return date.toLocaleDateString("en-US", {
    month: "2-digit",
    day: "2-digit",
    year: "numeric",
  });
}

export function isSameDate(date, comparisonDate) {
  return (
    date.getFullYear() === comparisonDate.getFullYear() &&
    date.getMonth() === comparisonDate.getMonth() &&
    date.getDate() === comparisonDate.getDate()
  );
}
