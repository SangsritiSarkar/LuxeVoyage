import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";
import * as apiClient from "../api-client";
import { useAppContext } from "../contexts/AppContext";
import { useNavigate } from "react-router-dom";

export type SignInFormData = {
    email: string;
    password: string;
}

const SignIn = () => {
    const {showToast} = useAppContext();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const {
        register, 
        formState : { errors }, 
        handleSubmit
    } = useForm<SignInFormData>();

    const mutation = useMutation(apiClient.signIn, {
        onSuccess: async()=>{
            //1. Show toast
            showToast({message: "Sign in successful", type: "SUCCESS"});
            //2. navigate to home page
               //invalidate query before navigating
               await queryClient.invalidateQueries("validateToken"); 
            navigate("/");
        },
        onError: (error: Error) => {
            //show toast
            showToast({message: error.message, type: "ERROR"});
        },
    });

    const onSubmit = handleSubmit((data)=>{
        mutation.mutate(data)
    });

    return (
        <form className="flex flex-col gap-5" onSubmit={onSubmit}>
            <h2 className="text-3xl font-bold">Sign In</h2>

            <label className="text-gray-700 text-sm font-bold flex-1">
                Email
                <input 
                    type="email"
                    className="border rounded w-full py-1 px-2 font-normal"
                    {...register("email" , 
                        {required: "This field is required"}
                    )}
                ></input>
                {errors.email && (
                    <span className="text-red-500">{errors.email.message}</span>
                )}
            </label>
            <label className="text-gray-700 text-sm font-bold flex-1">
                Password
                <input 
                    type="password"
                    className="border rounded w-full py-1 px-2 font-normal"
                    autoComplete="new-password"
                    {...register("password" , 
                        {
                            required: "This field is required",
                            minLength: {
                                value:6,
                                message: "Password must be atleast 6 characters",
                            },
                        }
                    )}
                ></input>
                {errors.password && (
                    <span className="text-red-500">{errors.password.message}</span>
                )}
            </label>
            <span>
                <button 
                    type="submit"
                    className="bg-pink-700 text-white p-2 font-bold hover:bg-pink-500 text-xl"
                >
                    Login 
                </button>
            </span>
        </form>
    )
}

export default SignIn;