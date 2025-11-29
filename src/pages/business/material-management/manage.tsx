import { useEffect, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Grid } from "@mui/material";
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
  useLazyGetMaterialDetailsQuery,
  useManageMaterialMutation,
} from "../../../store/api/material-management/api";
import {
  MaterialFormValues,
  schema,
} from "../../../store/api/meterial-management-validators/materialform.validator";

const defaultValues: MaterialFormValues = {
  materialCode: "",
  variantCode: "",
  variantName: "",
  variantDescription: "",
  status: "",
  uom: "",
};

const ManageMaterial = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const formRef = useRef<FormRef>(null);
  const [getMaterialDetails, { isLoading }] = useLazyGetMaterialDetailsQuery();

  const [
    manageMaterial,
    { isLoading: isActionLoading, isSuccess, error, isError },
  ] = useManageMaterialMutation();

  useEffect(() => {
    if (id) {
      getMaterialDetails(+id).then((res) => {
        if (res.data) {
          const { data } = res.data;

          formRef.current?.setFormValues({
            materialCode: data.MATERIAL_CODE || "",
            variantCode: data.VARIANT_CODE || "",
            variantName: data.VARIANT_NAME || "",
            variantDescription: data.DESCRIPTION || "",
            status: data.STATUS || "",
            uom: data.UOM || "",
          });
        }
      });
    }
  }, [id]);

  useEffect(() => {
    if (isSuccess) {
      navigate(-1);
    } else if (isError) {
      displayError(error);
    }
  }, [isSuccess, isError, error, navigate, dispatch]);

  const handleSubmit = (data: MaterialFormValues) => {
    const payload = {
      ...(id ? { id: +id } : {}),
      MATERIAL_CODE: data.materialCode,
      VARIANT_CODE: data.variantCode,
      VARIANT_NAME: data.variantName,
      DESCRIPTION: data.variantDescription,
      STATUS: data.status,
      UOM: data.uom,
    };

    console.log("Payload:", payload);

    manageMaterial(payload);
  };

  return (
    <>
      <BackdropLoader openStates={isLoading || isActionLoading} />
      <Grid item xs={12} container alignItems="center">
        <Grid item xs={12}>
          <Header
            onBack={() => navigate(-1)}
            title={id ? "Update Material" : "Create Material"}
            buttons={[
              {
                label: "Discard",
                color: "secondary",
                onClick: () => navigate(-1),
                icon: <CloseIcon />,
              },
              {
                label: id ? "Save Changes" : "Create",
                color: "primary",
                variant: "contained",
                onClick: () => formRef.current?.submitForm(),
                icon: id ? <SaveIcon /> : <CheckIcon />,
                disabled: isLoading || isActionLoading,
              },
            ]}
          />
        </Grid>
        <Grid item xs={12}>
          <Form
            ref={formRef}
            defaultValues={defaultValues}
            validationSchema={schema}
            onSubmit={handleSubmit}
          >
            <Select
              label="Material Code"
              name="materialCode"
              data={["CKD", "SPARE", "FG"]}
              required
            />
            <TextField label="Variant Code" name="variantCode" required />
            <TextField
              label="Variant Name"
              name="variantName"
              required
              fullWidth
            />
            <TextField
              label="Description"
              name="variantDescription"
              required
              fullWidth
            />
            <Select
              label="Status"
              name="status"
              data={["Active", "Inactive"]}
              required
            />
            <TextField label="Unit of Measure" name="uom" required />
            {/* <TextField label="Material Group" name="materialGroup" />
            <Grid item xs={12}>
              <Heading>Properties</Heading>
            </Grid>
            <TextField label="Dimensions" name="dimensions" />
            <TextField type="number" label="Volume" name="volume" />
            <SwitchField label="Fragile" name="fragile" />
            <SwitchField label="Returnable" name="returnable" />
            <TextField label="Storage Condition" name="storageCondition" />
            <TextField type="date" label="Expiry Date" name="expiryDate" />
            <TextField
              type="date"
              label="Warranty Applicable"
              name="warrantyApplicable"
            />
            <Grid item xs={12}>
              <Heading>Valuation</Heading>
            </Grid>
            <TextField label="Valuation Type" name="valuationType" />
            <TextField label="Valuation Class" name="valuationClass" />
            <TextField label="Plant" name="plant" />
            <TextField label="MRP Type" name="mrpType" />
            <TextField type="number" label="Price" name="price" />
            <TextField label="Currency" name="currency" required/>
            <TextField type="number" label="Price Unit" name="priceUnit" required />
            <TextField label="Price Control" name="priceControl" />
            <TextField label="ABC Indicator" name="abcIndicator" />
            <TextField type="number" label="Putaway Strategy" name="putawayId" />
            <TextField type="number" label="Pickup Strategy" name="pickupId" /> */}
          </Form>
        </Grid>
      </Grid>
    </>
  );
};

export default ManageMaterial;
