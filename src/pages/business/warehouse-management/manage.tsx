import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Grid, Card, CardContent, Radio, Box, Typography } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import {
  Form,
  FormRef,
  Select,
  TextField,
} from "../../../components/common/form";
import Header from "../../../components/common/header";
import BackdropLoader from "../../../components/third-party/BackdropLoader";
import { displayError } from "../../../utils/helpers";
import {
  useGetAllUserQuery,
  useLazyGetWarehouseDetailsQuery,
  useManageWarehouseMutation,
} from "../../../store/api/warehouse-management/warehouseApi";
import { warehouseSchema } from "../../../store/api/warehouse-management-validators/warehouse.validator";

const defaultValues = {
  warehouseName: "",
  warehouseCode: "",
  status: "",
  address: "",
  state: "",
  city: "",
  pinCode: "",
  managerId: "",
  warehouseType: "Standard",
};

const warehouseTypeOptions = [
  {
    value: "Standard",
    title: "Standard Warehouse",
    description: "Items are stored and processed in a standard way.",
  },
  {
    value: "Flow Through",
    title: "Flow Through Warehouse",
    description: "Items pass through quickly without long-term storage.",
  },
];

const ManageWarehouseManagement = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formRef = useRef<FormRef>(null);

  const [getWarehouseDetails, { isLoading }] =
    useLazyGetWarehouseDetailsQuery();
  const [
    manageWarehouse,
    { isLoading: isActionLoading, isSuccess, error, isError, data },
  ] = useManageWarehouseMutation();
  const { data: users } = useGetAllUserQuery();

  const [warehouseType, setWarehouseType] = useState("Standard");

  // fetch warehouse details if editing
  useEffect(() => {
    if (id) {
      getWarehouseDetails(+id).then((res) => {
        if (res.data) {
          const { data } = res.data;
          setWarehouseType(data.WAREHOUSE_TYPE || "Standard");
          formRef.current?.setFormValues({
            warehouseName: data.WAREHOUSE_NAME,
            warehouseCode: data.WAREHOUSE_CODE,
            status: data.STATUS,
            address: data.ADDRESS,
            state: data.STATE,
            city: data.CITY,
            pinCode: data.PIN_CODE,
            managerId: data.MANAGER_ID?.toString(),
            warehouseType: data.WAREHOUSE_TYPE || "Standard",
          });
        }
      });
    }
  }, [id, getWarehouseDetails]);

  useEffect(() => {
    if (isSuccess) {
      navigate(-1);
    } else if (isError) {
      displayError(error);
    }
  }, [isSuccess, isError, error, data, navigate, dispatch]);

  return (
    <>
      <BackdropLoader openStates={isLoading || isActionLoading} />
      <Grid item xs={12} container alignItems="center">
        <Grid item xs={12}>
          <Header
            onBack={() => navigate(-1)}
            title="Warehouse Management"
            buttons={[
              {
                label: "Discard",
                variant: "outlined",
                onClick: () => navigate(-1),
                icon: <CloseIcon />,
              },
              {
                label: id ? "Save Changes" : "Create",
                color: "primary",
                variant: "contained",
                onClick: () => formRef.current?.submitForm(),
                icon: id ? <SaveIcon /> : <CheckIcon />,
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Form
            ref={formRef}
            defaultValues={defaultValues}
            validationSchema={warehouseSchema}
            onSubmit={(data) => {
              data.managerId = +data.managerId;
              const payload = {
                WAREHOUSE_CODE: data.warehouseCode,
                WAREHOUSE_NAME: data.warehouseName,
                STATUS: data.status,
                STATE: data.state,
                CITY: data.city,
                PIN_CODE: data.pinCode,
                ADDRESS: data.address,
                MANAGER_ID: Number(data.managerId),
                WAREHOUSE_TYPE: warehouseType,
              };

              if (id) {
                manageWarehouse({ id: +id, ...payload }).unwrap();
              } else {
                manageWarehouse(payload).unwrap();
              }
            }}
          >
            <TextField label="Warehouse Name" name="warehouseName" required />
            <TextField label="Warehouse Code" name="warehouseCode" required />

            {/* Warehouse Type Cards */}
            {/* <Grid item xs={12} sx={{ mb: 2 }}> */}
            <Grid item container spacing={2} sx={{ mb: 2 }}>
              <Grid item xs={12} sm={3}>
                <label
                  style={{
                    color: "#626F86",
                    fontSize: "14px",
                    fontWeight: 600,
                    lineHeight: "14px",
                  }}
                >
                  Warehouse Type<span style={{ color: "red" }}> *</span>
                </label>
              </Grid>
              <Grid item xs={12} sm={9}>
                <Grid container spacing={2}>
                  {warehouseTypeOptions.map((opt) => (
                    <Grid item xs={12} sm={6} key={opt.value}>
                      <Card
                        variant="outlined"
                        sx={{
                          borderRadius: 2,
                          cursor: "pointer",
                          borderColor:
                            warehouseType === opt.value
                              ? "primary.main"
                              : "grey.300",
                          borderWidth: 2,
                          boxShadow:
                            warehouseType === opt.value
                              ? "0 0 8px rgba(25, 118, 210, 0.4)"
                              : "",
                          transition: "all 0.2s ease-in-out",
                          display: "flex",
                        }}
                        onClick={() => setWarehouseType(opt.value)}
                      >
                        <CardContent
                          sx={{ display: "flex", alignItems: "flex-start" }}
                        >
                          <Radio
                            checked={warehouseType === opt.value}
                            value={opt.value}
                            onChange={() => setWarehouseType(opt.value)}
                            color="primary"
                            sx={{ mt: 0.5 }}
                          />
                          <Box sx={{ ml: 2 }}>
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 500 }}
                            >
                              {opt.title}
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{ color: "#626F86", mt: 0.5 }}
                            >
                              {opt.description}
                            </Typography>
                          </Box>
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            </Grid>
            {/* </Grid> */}
            <Select
              label="Status"
              name="status"
              data={["Active", "Inactive"]}
              required
            />
            <TextField label="Address" name="address" fullWidth required />
            <TextField label="State" name="state" required />
            <TextField label="City" name="city" required />
            <TextField label="Pin Code" name="pinCode" required />
            <Select
              label="Manager"
              name="managerId"
              labelKey="name"
              valueKey="id"
              data={
                users?.data.map((user) => ({
                  id: user.ID,
                  name: user.USER.USERNAME,
                })) || []
              }
              required
            />
          </Form>
        </Grid>
      </Grid>
    </>
  );
};

export default ManageWarehouseManagement;
