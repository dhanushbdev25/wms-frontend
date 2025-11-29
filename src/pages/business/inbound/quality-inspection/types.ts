import { PutAwaySkuDetails } from "../../../../store/api/inbound-validators/inbound.validator";

export interface MatchedItem {
  id: number | undefined;
  skuName: string;
  sku: string;
  vin_number: string;
  serialized: boolean;
  locationStatus: string;
  packageListItemId: number;
  quantity: number;
  uom: string;
  type: string;
}

export interface ScanDialogProps {
  matchedItems: PutAwaySkuDetails | undefined;
  handleClose: () => void;
  openItem: boolean;
  setMainData: React.Dispatch<React.SetStateAction<PutAwaySkuDetails[]>>;
  setValue: React.Dispatch<React.SetStateAction<string>>;
  serialized: boolean;
  mainData: PutAwaySkuDetails[];
}
