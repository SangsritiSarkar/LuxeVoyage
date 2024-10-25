import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";

const SignOutButton = () => {
    //global query
    const queryClient = useQueryClient();
    //import toast
    const { showToast } = useAppContext();

    //to call logout endpoint
    const mutation = useMutation(apiClient.signOut, {
        onSuccess: async ()=>{
            //invalidate token to sign out
            await queryClient.invalidateQueries("validateToken"); 
            //show toast
            showToast({message: "Signed Out!", type: "SUCCESS"});
        },
        onError: (error: Error)=>{
            //show toast
            showToast({message: error.message , type: "ERROR"});
        },
    });
    
    //invoke api call and no need to pass data
    const handleClick = () =>{
        mutation.mutate();
    }

    return (
        <button 
            onClick = {handleClick}
            className="text-pink-600 px-2 py-1 font-bold bg-white hover:bg-gray-100">
                Sign Out
        </button>
    );
};

export default SignOutButton;