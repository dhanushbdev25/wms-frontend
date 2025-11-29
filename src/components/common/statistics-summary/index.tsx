import { Box, Typography } from "@mui/material";

type StatisticItem = { label?: string; key?: string; value: number };

type Props = {
  data: StatisticItem[];
};
const StatisticsSummary = ({ data }: Props) => {
  return (
    <Box
      display="flex"
      padding="20px"
      alignItems="center"
      gap={0}
      borderRadius="8px"
      border="1px solid rgba(9, 30, 66, 0.14)"
      bgcolor="#FFF"
      width="100%"
      marginBottom="20px"
    >
      {data.map((item, id) => (
        <Box
          key={id + 1}
          display="flex"
          padding="6px 0"
          flexDirection="column"
          justifyContent="center"
          alignItems="center"
          gap="6px"
          flex="1 0 0"
          borderRight={
            id < data.length - 1 ? "1px solid rgba(9, 30, 66, 0.14)" : "none"
          }
        >
          <Typography
            color="#626F86"
            fontSize="14px"
            fontStyle="normal"
            fontWeight="600"
            lineHeight="14px"
          >
            {item.label ||item.key}
          </Typography>
          <Typography
            color="#172B4D"
            fontSize="22px"
            fontStyle="normal"
            fontWeight="700"
            lineHeight="22px"
          >
            {item.value}
          </Typography>
        </Box>
      ))}
    </Box>
  );
};

export default StatisticsSummary;
