import * as React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  SxProps,
  Theme,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

export interface CustomAccordionProps {
  header?: React.ReactNode;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  disableGutters?: boolean;
  square?: boolean;
  expandIcon?: React.ReactNode;
  ariaId: string;
  sx?: SxProps<Theme>; 
}

const CustomAccordion = ({
  header,
  children,
  defaultExpanded = false,
  disableGutters = false,
  square = false,
  expandIcon = <ExpandMoreIcon />,
  ariaId,
  sx,
}: CustomAccordionProps): JSX.Element => {
  return (
    <Accordion
      defaultExpanded={defaultExpanded}
      disableGutters={disableGutters}
      square={square}
      sx={sx} 
    >
      <AccordionSummary
        expandIcon={expandIcon}
        aria-controls={`${ariaId}-content`}
        id={`${ariaId}-header`}
      >
        {typeof header === "string" ? (
          <Typography variant="subtitle1" component="span">
            {header}
          </Typography>
        ) : (
          header
        )}
      </AccordionSummary>
      <AccordionDetails>{children}</AccordionDetails>
    </Accordion>
  );
};

export default CustomAccordion;
