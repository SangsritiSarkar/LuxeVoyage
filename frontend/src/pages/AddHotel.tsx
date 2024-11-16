import { useMutation } from "react-query";
import ManageHotelForm from "../forms/ManageHotelForm/ManageHotelForm";
import { useAppContext } from "../contexts/AppContext";
import * as apiClient from "../api-client";

const AddHotel = () => {
    const {showToast} = useAppContext();
    
    //link fetch req to useMutation hook
    const { mutate, isLoading } = useMutation(apiClient.addMyHotel, {
        onSuccess: ()=>{
            showToast({message: "Hotel Saved!" , type: "SUCCESS"});
        },
        onError: ()=>{
            showToast({message: "Error saving Hotel", type: "ERROR"});
        },
    });


    //this func calls mutate func
    const handleSave = (hotelFormData: FormData)=>{
        mutate(hotelFormData)
    }

    return <ManageHotelForm onSave={handleSave} isLoading={isLoading}/>;
    //isLoading ... disables the save button when it is loading
};

export default AddHotel;