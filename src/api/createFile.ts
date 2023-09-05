import axios from "axios";
import Swal from "sweetalert2";

export async function createFile(formData: any) {
  try {
    const result = await axios.post(
      `${process.env.REACT_APP_API_URL}/createFile`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("jwt")}`,
        },
      }
    );
    Swal.fire({
      icon: "success",
      title: "Success",
      text: result.data.message,
    });
    return result.data.message; // Return the data from the Axios response
  } catch (error: any) {
    
    Swal.fire({
      icon: "error",
      title: "Oops...",
      text: "Something went wrong!",
      footer: error?.response.data.message,
    });
    // throw error; // Throw the error to be caught by the caller
  }
}
