export type LocationStatus =
  | "QI-Passed"
  | "QI-Failed"
  | "Damaged"
  | "Not-Found"
  | "QI-Pending"
  | "Placed"
  | "Received"
  | "New"
  | "unKnown";

export const mapStatusToLocationStatus = (status: string): LocationStatus => {
  switch (status) {
    case "QI-PASSED":
      return "QI-Passed";
    case "QI-FAILED":
      // return "QI-Failed";
    case "DAMAGED":
      return "Damaged";
    case "NOT-FOUND":
      return "Not-Found";
    case "QI-PENDING":
      return "QI-Pending";
    case "PLACED":
      return "Placed";
    case "RECEIVED":
      return "Received";
    case "NEW":
      return "New";
    default:
      return "unKnown";
  }
};
