import { Box, Divider, Typography } from "@mui/material";

import ContainerInspection from "./quality-inspection-form";
import QualityinspectionTable from "./quality-inspection-table";
import { PackageApiResponse } from "../../../../store/api/inbound-validators/inbound.validator";
import { usePostContainerQualityInspectionMutation } from "../../../../store/api/Inbound/inboundApi";

type Props = {
  qualityData?: PackageApiResponse["data"];
  setEnablePutAway?: React.Dispatch<React.SetStateAction<boolean>>;
};

const Qualityinspection = ({ qualityData,setEnablePutAway }: Props) => {

  const [postContainerQualityInspection, { data: responsedata ,isLoading:postloading }] =
    usePostContainerQualityInspectionMutation();

  if (!qualityData) {
    return (
      <Box p={2}>
        <Typography variant="body2" color="textSecondary">
          No inspection data available
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <ContainerInspection
        containerData={qualityData?.CONTAINER_QUALITY_INSPECTION ?? []}
        postContainerQualityInspection={postContainerQualityInspection}
        responsedata={responsedata}
        postloading={postloading}
      />
      <Divider variant="middle" />

      <QualityinspectionTable
        inspectionData={qualityData?.ITEM_QUALITY_INSPECTION ?? []}
        ID = {qualityData.ID}
        serialized ={ qualityData?.SERIALIZED}
        disabled={
        !(
           ( qualityData?.CONTAINER_QUALITY_INSPECTION?.INSPECTION?.toLowerCase() === "completed" ||
            responsedata?.data?.CONTAINER_QUALITY_INSPECTION?.INSPECTION?.toLowerCase() === "completed" )
            &&
           ( qualityData?.CONTAINER_QUALITY_INSPECTION?.STATUS?.toLowerCase() === "qi-passed" ||
            responsedata?.data?.CONTAINER_QUALITY_INSPECTION?.STATUS?.toLowerCase() === "qi-passed")
          )
        }
        setEnablePutAway={setEnablePutAway}
      />
    </Box>
  );
};

export default Qualityinspection;
