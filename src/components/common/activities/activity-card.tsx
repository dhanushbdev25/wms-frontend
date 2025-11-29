import { Box, Typography } from "@mui/material";
import Inbound from "../../../assets/images/svg/inbound.svg";
import Outbound from "../../../assets/images/svg/outbound.svg";
import { ActivityDetail } from "../../../types";

type Props = {
  activity: ActivityDetail;
};

const ActivityCard = ({ activity }: Props) => (
  <Box
    display="flex"
    padding="12px 8px"
    flexDirection="column"
    justifyContent="center"
    alignItems="flex-start"
    gap="10px"
    marginBottom="10px"
    alignSelf="stretch"
    borderRadius="6px"
    bgcolor="#FFF"
  >
    <Box display="flex" padding="6px 0" gap={0} alignSelf="stretch">
      {activity.type === "Inbound" && <img src={Inbound} alt="Inbound" />}
      {activity.type === "Outbound" && <img src={Outbound} alt="Outbound" />}
      <Box
        display="flex"
        flexDirection="column"
        alignItems="flex-start"
        alignSelf="stretch"
      >
        <Typography
          color="#172B4D"
          fontSize="14px"
          fontStyle="normal"
          fontWeight="700"
          lineHeight="14px"
        >
          {activity.title}
        </Typography>
        <Typography
          color="#626F86"
          fontSize="11px"
          fontStyle="normal"
          fontWeight="600"
          lineHeight="11px"
        >
          {activity.type}
        </Typography>
      </Box>
      <Box
        flex={1}
        display="flex"
        justifyContent="flex-end"
        alignItems="flex-end"
      >
        <Typography
          color="#626F86"
          fontSize="11px"
          fontStyle="normal"
          fontWeight="600"
          lineHeight="11px"
        >
          {activity.date}
        </Typography>
      </Box>
    </Box>
    <Box
      display="flex"
      paddingLeft="24px"
      flexDirection="column"
      justifyContent="center"
      alignItems="flex-start"
      gap="8px"
      alignSelf="stretch"
    >
      <Box display="flex" width="100%">
        <Box flex={1} minWidth={0} sx={{ wordBreak: "break-word" }}>
          <Typography
            component="span"
            color="#172B4D"
            fontSize="12px"
            fontStyle="normal"
            fontWeight="500"
            lineHeight="12px"
          >
            Total Quantity:
          </Typography>
        </Box>
        <Box flexShrink={0} marginLeft={2}>
          <Typography
            component="span"
            color="#172B4D"
            fontSize="12px"
            fontStyle="normal"
            fontWeight="600"
            lineHeight="12px"
          >
            {activity.total}
          </Typography>
        </Box>
      </Box>
      {activity.items.map((item, index) => (
        <Box key={index + 1} display="flex" width="100%">
          <Box flex={1} minWidth={0} sx={{ wordBreak: "break-word" }}>
            <Typography
              component="span"
              color="#626F86"
              fontSize="10px"
              fontStyle="normal"
              fontWeight="500"
              lineHeight="10px"
            >
              {item.name}
            </Typography>
          </Box>
          <Box flexShrink={0} marginLeft={2}>
            <Typography
              component="span"
              color="#172B4D"
              fontSize="11px"
              fontStyle="normal"
              fontWeight="600"
              lineHeight="11px"
            >
              {item.qty}
            </Typography>
          </Box>
        </Box>
      ))}
    </Box>
  </Box>
);

export default ActivityCard;
