export const formatDateDisplay = (TaskDeadline: Date) => {
  // Retrieve and Format Date & Time

  const year = TaskDeadline.getFullYear();

  const month = (TaskDeadline.getMonth() + 1).toString().padStart(2, "0");

  const day = TaskDeadline.getDate().toString().padStart(2, "0");

  let hour = TaskDeadline.getHours();
  const minutes = TaskDeadline.getMinutes().toString().padStart(2, "0");
  const timeSuffix = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12;
  // Set Formatted Date and Time
  const formattedDate = `${year}/${month}/${day}`;
  const formattedTime = `${
    hour < 10 ? `0${hour}` : hour
  }:${minutes} ${timeSuffix}`;

  return { formattedDate, formattedTime };
};

// Function to ensure accurate date and time by offset
export const formatDateInput = (editedTaskDeadline: string) => {
  const editedDate = new Date(editedTaskDeadline);
  const offsetDate = new Date(
    editedDate.getTime() - editedDate.getTimezoneOffset() * 60000
  );
  return offsetDate.toISOString().slice(0, 16); // Format as YYYY-MM-DDTHH:mm
};

// For Smooth Page Transition
export const pageVariants = {
  initial: {
    opacity: 0,
    x: "-100vw",
  },
  in: {
    opacity: 1,
    x: 0,
  },
  out: {
    opacity: 0,
    x: "100vw",
  },
};

export const pageTransition = {
  type: "spring",
  stiffness: 260, // How stiff the spring is
  damping: 30, // The amount of drag on the spring
};
