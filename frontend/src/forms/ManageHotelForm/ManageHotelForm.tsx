import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";

export type HotelFormData = {
    name: string;
    city: string;
    country: string;
    description: string;
    type: string;
    pricePerNight: number;
    starRating: number;
    facilities: string[];
    imageFiles: FileList;
    adultCount: number;
    childCount: number; 
}

const ManageHotelForm = ()=>{
    const formMethods = useForm<HotelFormData>(); //getting stuff out of useform and sending it to formMethods
    return ( //spreading all these properties of formMethods to formProvider (just like react context api)
        <FormProvider {...formMethods}> 
            <form className="flex flex-col gap-10">
                <DetailsSection />
                <TypeSection />
            </form>
        </FormProvider> //all these individual child sections inside of this form..it can use formMethods from useForm hook
    );
};

export default ManageHotelForm;