


import { ToastContainer } from "react-toastify"
import { toast } from "react-toastify"
import { loadXray } from "../reducers/xraySlice"
import { removeXray } from "../reducers/xraySlice"

import axios from "../../api/axiosconfig"
// import { updateUser } from "./userActions"

// BACKEND API :-
import { asyncUpdateUserBackend } from "./userActions"


export const UploadXray = (url, id, obj) => async (dispatchEvent, getState) => {
    try {
        const user = getState().userReducer.users;
        console.log(user)

        const copyuser = {...user, images: [...user.images]}
        copyuser.images.push( {url, obj})
        console.log(copyuser);

        localStorage.setItem("user", JSON.stringify(copyuser));
        const res = await axios.patch("/xray_images/" + id, copyuser)
        // updateUser(copyuser)

        // BACKEND API :-
        asyncUpdateUserBackend(copyuser);

        console.log(res);
        toast.success("Xray Uploaded Successfully!")
    } catch (error) {
        console.log(error);
    }
}