import { useFormContext } from "react-hook-form";
import {hotelTypes} from "../../config/hotel-options-config";
import { HotelFormData } from "./ManageHotelForm";

const TypeSection = () =>{
    const {register, watch , formState: {errors} } = useFormContext<HotelFormData>(); 
    //register: to track the selected hotel type   watch: to get hold of selected type value
    const typeWatch = watch("type"); //when type in form field changes we get hold of the new type in typeWatch variable

    return (
        <div>
            <h2 className = "text-2xl font-bold mb-3 ">Type</h2>
            <div className="grid grid-cols-5 gap-2">
                {hotelTypes.map((type) => (
                    <label className={
                        typeWatch === type 
                        ? "cursor-pointer bg-blue-300 text-sm rounded-full px-4 py-2 font-semibold" 
                        : "cursor-pointer bg-gray-300 text-sm rounded-full px-4 py-2 font-semibold"
                    }>
                        <input
                            type="radio"
                            value={type}
                            {...register("type",{
                                required: "This field is required",
                            })}
                            className="hidden"
                        />
                        <span>{type}</span>
                    </label>
                ))}
            </div>
            {errors.type && (
                <span className="text-red-500 text-sm font-bold">
                    {errors.type.message}
                </span>
            )}
        </div>
    );
};

export default TypeSection;