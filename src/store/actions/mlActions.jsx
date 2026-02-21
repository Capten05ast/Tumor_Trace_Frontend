

import axios from "../../api/axiosconfig";
// Send ML result from frontend → backend

export const asyncSendMLResult = ({
  fileId,
  age,
  gender,
  imageUrl,
  prediction
}) => async (dispatch, getState) => {
  try {
    // AXIOS, FRONTEND TO BACKEND CALL :-
    // Here we are using base URL from axiosconfig.js as baseURL: "https://tumor-trace-backend.onrender.com"
    // and further appending the /api/ml/result endpoint. to update the ML result for a user uploaded image
    await axios.post("/api/ml/result", {
      fileId,
      age,
      gender,
      imageUrl,
      prediction
    });

    // optional: toast / redux state update later
  } catch (error) {
    console.error("Failed to send ML result:", error);
  }
};

