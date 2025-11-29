export type FormDataType = {
  engineNumber: string;
  jobCardNumber: string;
  vinNumber: string;
  invoiceNumber: string;
  invoicedate: string;
  invoicefile?: UploadedFile | null;
  defectfile?: UploadedFile | null;
  physicaldefect: string;
  claimtype: string;
  pdisold?: string | null;
  registrationno?: string | null;
  jobcarddate: string;
  dealercode?: string |null;
  maldate: string;
  claimdate: string;
  repairdate: string;
  malfunctionkm: string;
  repairkm: string;
  symptoms: string;
  cushis?: string | null;
  genuineoil?: boolean | null;
  oilgrade: string;
  oilmake: string;
  bathis?: string |null;
}
export type UploadedFile =
  | File
  | {
      file: File;
      storageName: string;
      blobUrl: string;
    };
