import { Box, Grid, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";

import Header from "../../../../components/common/header";

import Allocation from "./allocation";
import Pickup from "./pickup";
import Waybill from "./waybill";

type InfoFieldProps = {
  label: string;
  value: string | number;
  gridSize?: number;
};

const InfoField = ({ label, value, gridSize = 4 }: InfoFieldProps) => {
  const theme = useTheme();
  return (
    <Grid item xs={12} sm={gridSize}>
      <Box sx={{ bgcolor: theme.palette.background.paper, p: 1.5, borderRadius: 1 }}>
        <Box
          component="p"
          sx={{ fontSize: 14, color: "text.secondary", mb: 0.5 }}
        >
          {label}
        </Box>
        <Box component="p" sx={{ fontWeight: 600 }}>
          {value}
        </Box>
      </Box>
    </Grid>
  );
};
const Summary = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const orderId = "SOJCKD202305070007";
  const requestedItems = 500;
  const allocatedItems = 450;
  const dispatchedItems = 45;

  const allocationData = [
    {
      allocationId: "A0001",
      performedBy: "jin.doe@thepm.com",
      date: "01/08/2023 12:23",
      items: [
        {
          skuName: "HUNTER 100 TAXI DRS C VIBRANT BLUE MET LX",
          skuCode: "EC1HTHMTAXDRSCCVRBLU",
          quantity: 20,
          uom: "Cartons",
        },
        {
          skuName: "HUNTER 100 RBR DRS ST PANTHER BLK",
          skuCode: "ESNHNDRDSDSCPBRK",
          quantity: 5,
          uom: "Cartons",
        },
      ],
    },
    {
      allocationId: "A0002",
      performedBy: "jin.doe@thepm.com",
      date: "01/08/2023 12:23",
      items: [
        {
          skuName: "HUNTER 160 TAXI DRS C VIBRANT BLUE MET LX",
          skuCode: "EC1HTHMDRSACDCRVBLU",
          quantity: 15,
          uom: "Cartons",
        },
        {
          skuName: "HUNTER 160 DRS RF DRT SST PANTHER BLK",
          skuCode: "ESNHMDRSCDSSCPRBK",
          quantity: 10,
          uom: "Cartons",
        },
      ],
    },
  ];

  const pickupData = [
    {
      pickupId: "A0001",
      performedBy: "jin.doe@thepm.com",
      date: "01/08/2023 12:23",
      items: [
        {
          skuName: "HUNTER 100 TAXI DRS C VIBRANT BLUE MET LX",
          skuCode: "EC1HTHMTAXDRSCCVRBLU",
          vinNumber: "MBJ1JH0H5A004994",
          storage: "1001",
        },
        {
          skuName: "HUNTER 100 TAXI DRS C VIBRANT BLUE MET LX",
          skuCode: "EC1HTHMTAXDRSCCVRBLU",
          vinNumber: "MBJ1JH0H5A004995",
          storage: "1001",
        },
      ],
    },
    {
      pickupId: "A0002",
      performedBy: "jin.doe@thepm.com",
      date: "01/08/2023 12:23",
      items: [
        {
          skuName: "HUNTER 160 TAXI DRS C VIBRANT BLUE MET LX",
          skuCode: "EC1HTHMDRSACDCRVBLU",
          vinNumber: "MBJ1JH0H5A005001",
          storage: "1002",
        },
        {
          skuName: "HUNTER 160 TAXI DRS C VIBRANT BLUE MET LX",
          skuCode: "EC1HTHMDRSACDCRVBLU",
          vinNumber: "MBJ1JH0H5A005002",
          storage: "1002",
        },
      ],
    },
  ];
  const waybillData = {
    performedBy: "phind@eiffel.com",
    date: "01/01/2023 12:23",
    items: [
      {
        skuName: "HUNTER 100 TAXI DRS C VIBRANT BLUE MET LX",
        skuCode: "EC1HTHMTAXDRSCCVRBLU",
        vinNumber: "MBJ1JH0H5A004994",
      },
      {
        skuName: "HUNTER 100 TAXI DRS C VIBRANT BLUE MET LX",
        skuCode: "EC1HTHMTAXDRSCCVRBLU",
        vinNumber: "MBJ1JH0H5A004995",
      },
    ],
  };

  return (
    <>
      <Header title="Summary" onBack={() => navigate(-1)} buttons={[]} />

      <Box sx={{ px: 2, py: 2, bgcolor: theme.palette.background.paper }}>
        {/* Top summary */}
        <Grid container spacing={2} sx={{ mb: 1 }}>
          <InfoField label="Order ID" value={orderId} gridSize={4} />
        </Grid>
        <Grid container spacing={2}>
          <InfoField
            label="Requested Items"
            value={requestedItems}
            gridSize={4}
          />
          <InfoField
            label="Allocated Items"
            value={allocatedItems}
            gridSize={4}
          />
          <InfoField
            label="Dispatched Items"
            value={dispatchedItems}
            gridSize={4}
          />
        </Grid>

        {/* Alternating Allocation + Pickup */}
        <Box sx={{ mt: 3 }}>
          {allocationData.map((alloc, index) => (
            <Box key={alloc.allocationId} sx={{ mb: 3 }}>
              <Allocation
                allocationId={alloc.allocationId}
                performedBy={alloc.performedBy}
                date={alloc.date}
                items={alloc.items}
              />
              {pickupData[index] && (
                <Pickup
                  pickupId={pickupData[index].pickupId}
                  performedBy={pickupData[index].performedBy}
                  date={pickupData[index].date}
                  items={pickupData[index].items}
                />
              )}
            </Box>
          ))}
        </Box>
        <Waybill
          performedBy={waybillData.performedBy}
          date={waybillData.date}
          items={waybillData.items}
        />
      </Box>
    </>
  );
};

export default Summary;
