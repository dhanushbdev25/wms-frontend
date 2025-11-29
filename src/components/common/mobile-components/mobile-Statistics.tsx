import { Box, Typography, Grid } from "@mui/material";

type StatisticItem = { label?: string; key?: string; value: number };

type Props = {
  data: StatisticItem[];
};

const MobileStatisticsSummary = ({ data }: Props) => {
  return (
    <Box
      padding="12px"
      borderRadius="8px"
      border="1px solid rgba(9, 30, 66, 0.14)"
      bgcolor="#FFF"
      width="100%"
      marginBottom="20px"
    >
      <Grid container spacing={1}>
        {data.map((item, id) => (
          <Grid key={id} item xs={4}>
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              padding="8px 0"
              borderRight={
                (id + 1) % 3 !== 0 ? "1px solid rgba(9, 30, 66, 0.14)" : "none"
              }
              borderBottom={
                id < data.length - 3
                  ? "1px solid rgba(9, 30, 66, 0.14)"
                  : "none"
              }
            >
              <Typography
                color="#626F86"
                fontSize="11px"
                fontWeight={600}
                lineHeight="14px"
                textAlign="center"
              >
                {item.label || item.key}
              </Typography>

              <Typography
                color="#172B4D"
                fontSize="18px"
                fontWeight={700}
                lineHeight="20px"
                textAlign="center"
              >
                {item.value}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default MobileStatisticsSummary;
