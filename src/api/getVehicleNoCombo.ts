import axios from "axios";
import Swal from "sweetalert2";

export const getVehicleNoCombo: any = async () => {
  try {
    const result = await axios.get(`${process.env.REACT_APP_API_URL}/getVehicleNoCombo`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
      },
    });
    return result.data.data; // Return the data from the Axios response
  } catch (error: any) {
    
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: error?.response.data.message,
    });
    throw error; // Throw the error to be caught by the caller
  }
};
