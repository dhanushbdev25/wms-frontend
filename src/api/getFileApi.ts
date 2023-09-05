import axios from "axios";
import Swal from "sweetalert2";

export async function getFileApi(waybillNo: any, sysID?: any) {
  try {
    console.log("Inside File API", sysID, waybillNo);
    const result = await axios.get(`${process.env.REACT_APP_API_URL}/getFile`, {
      params: { waybillNo: waybillNo },
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
    });
    if (result?.status == 200)
      return result.data.data; // Return the data from the Axios response
    else {
      console.log("no file found", result);
      return result?.data?.message;
    }
  } catch (error: any) {
    if (error?.response?.status == 500)
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Something went wrong!",
        footer: error?.response.data.message,
      });
    // throw error; // Throw the error to be caught by the caller
  }
}
