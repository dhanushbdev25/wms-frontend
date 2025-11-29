// ==============================|| DEFAULT THEME - TYPOGRAPHY  ||============================== //

const Typography = (fontFamily: string) => ({
  htmlFontSize: 16,
  fontFamily,
  fontWeightLight: 300,
  fontWeightRegular: 400,
  fontWeightMedium: 500,
  fontWeightBold: 600,
  letterSpacing: "0.01em", // SAP Fiori letter spacing
  h1: {
    fontWeight: 600,
    fontSize: "2.375rem",
    lineHeight: 1.21,
    letterSpacing: "-0.02em",
    color: "#32363A", // SAP Fiori Text
  },
  h2: {
    fontWeight: 600,
    fontSize: "1.875rem",
    lineHeight: 1.27,
    letterSpacing: "-0.01em",
    color: "#32363A",
  },
  h3: {
    fontWeight: 600,
    fontSize: "1.5rem",
    lineHeight: 1.33,
    letterSpacing: "-0.01em",
    color: "#32363A",
  },
  h4: {
    fontWeight: 600,
    fontSize: "1.25rem",
    lineHeight: 1.4,
    letterSpacing: "0em",
    color: "#32363A",
  },
  h5: {
    fontWeight: 600,
    fontSize: "1rem",
    lineHeight: 1.5,
    letterSpacing: "0.01em",
    color: "#32363A",
  },
  h6: {
    fontWeight: 500,
    fontSize: "0.875rem",
    lineHeight: 1.57,
    letterSpacing: "0.01em",
    color: "#32363A",
  },
  caption: {
    fontWeight: 400,
    fontSize: "0.75rem",
    lineHeight: 1.66,
    letterSpacing: "0.01em",
    color: "#6A6D70",
  },
  body1: {
    fontSize: "0.875rem",
    lineHeight: 1.57,
    letterSpacing: "0.01em",
    color: "#32363A",
  },
  body2: {
    fontSize: "0.75rem",
    lineHeight: 1.66,
    letterSpacing: "0.01em",
    color: "#6A6D70",
  },
  subtitle1: {
    fontSize: "0.875rem",
    fontWeight: 600,
    lineHeight: 1.57,
    letterSpacing: "0.01em",
    color: "#32363A",
  },
  subtitle2: {
    fontSize: "0.75rem",
    fontWeight: 500,
    lineHeight: 1.66,
    letterSpacing: "0.01em",
    color: "#32363A",
  },
  overline: {
    lineHeight: 1.66,
    letterSpacing: "0.05em",
    textTransform: "uppercase",
  },
  button: {
    textTransform: "none", // SAP Fiori uses no text transform
    fontWeight: 500,
    letterSpacing: "0.01em",
  },
});

export default Typography;
