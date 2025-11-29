import moment from "moment";
import Swal, { SweetAlertOptions } from "sweetalert2";

interface ApiError {
  data?: {
    message?: string;
    msg?: string;
    error?: {
      message?: string;
    };
  };
  error?: {
    message?: string;
  };
}

export const displayError = (error: unknown): void => {
  if (!error) return;

  const err = error as ApiError;

  const options: SweetAlertOptions = {
    icon: "error",
    title: "Error",
    text:
      err.data?.message ||
      err.data?.msg ||
      err?.data?.error?.message ||
      err?.error?.message ||
      "An error occurred",
  };

  // explicitly ignore returned promise
  void Swal.fire(options);
};

export const formatDate = (date: Date): string => {
  const options: Intl.DateTimeFormatOptions = {
    month: "long",
    year: "numeric",
  };
  return new Date(date).toLocaleString("en-US", options).replace(/\s/g, "");
};

type DateDiff = {
  displayText: string;
  severity: "low" | "medium" | "high";
};

export const isNull = (value: string | undefined | null): boolean => {
  return value === undefined || value === "" || value === null;
};

export const dateDifferentiator = (claimDateFromDB: Date): DateDiff => {
  const currentDate = new Date();
  const timeDifference = currentDate.getTime() - claimDateFromDB.getTime();

  const hoursDifference = Math.floor(timeDifference / (1000 * 3600));
  const daysDifference = Math.floor(timeDifference / (1000 * 3600 * 24));

  let severity: "low" | "medium" | "high" = "low";
  let displayText = "";

  if (daysDifference < 1) {
    displayText = `${hoursDifference} ${
      hoursDifference === 1 ? "hour" : "hours"
    } ago`;
  } else {
    displayText = `${daysDifference} ${
      daysDifference === 1 ? "day" : "days"
    } ago`;
  }

  if (daysDifference > 2 && daysDifference < 8) {
    severity = "medium";
  }
  if (daysDifference >= 8) {
    severity = "high";
  }

  return { displayText, severity };
};

export const formatDateAndTime = (
  date: string | Date,
  format: string,
): string => {
  return moment(date).isValid() ? moment(date).format(format) : "";
};

export const addPrecisionToNumber = (
  value: number,
  precision: number,
): string => {
  if (typeof value !== "number" || isNaN(value)) {
    return "0";
  }

  if (
    typeof precision !== "number" ||
    isNaN(precision) ||
    !Number.isInteger(precision) ||
    precision < 0
  ) {
    throw new Error("Precision must be a non-negative integer.");
  }

  return value.toFixed(precision);
};

export const addPrecisionToInteger = (
  value: number,
  precision: number,
): string | number => {
  if (typeof value !== "number" || isNaN(value) || !Number.isInteger(value)) {
    return 0;
  }

  if (
    typeof precision !== "number" ||
    isNaN(precision) ||
    !Number.isInteger(precision) ||
    precision < 0
  ) {
    throw new Error("Precision must be a non-negative integer.");
  }

  return `${value}.${"0".repeat(precision)}`;
};

export const formatCurrency = (
  value: number,
  locale = "en-US",
  currency = "USD",
): string => {
  if (typeof value !== "number" || isNaN(value) || value <= 0) {
    return "-";
  }

  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(value);
};

export function truncateString(text: string, maxLength: number): string {
  return text.length <= maxLength ? text : text.slice(0, maxLength) + "...";
}

export const formatNumber = (val: string | number): string | number => {
  const num = typeof val === "string" ? parseFloat(val) : val;
  return !isNaN(num)
    ? new Intl.NumberFormat("en-US", {
        useGrouping: true,
        maximumFractionDigits: 20,
      }).format(num)
    : val;
};
