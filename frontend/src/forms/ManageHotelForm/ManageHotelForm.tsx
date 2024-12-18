import { FormProvider, useForm } from "react-hook-form";
import DetailsSection from "./DetailsSection";
import TypeSection from "./TypeSection";
import FacilitiesSection from "./FacilitiesSection";
import GuestsSection from "./GuestsSection";
import ImagesSection from "./ImagesSection";

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

type Props = {
    onSave: (hotelFormData: FormData)=>void
    isLoading: boolean
}

const ManageHotelForm = ({onSave, isLoading}: Props)=>{
    const formMethods = useForm<HotelFormData>(); //getting stuff out of useform and sending it to formMethods
    const { handleSubmit } =formMethods;

    const onSubmit = handleSubmit((formDataJson: HotelFormData)=>{
        //create new FormData object & call our API
        const formData = new FormData();
        formData.append("name", formDataJson.name)
        formData.append("city", formDataJson.city)
        formData.append("country", formDataJson.country)
        formData.append("description", formDataJson.description)
        formData.append("type", formDataJson.type)
        formData.append("pricePerNight", formDataJson.pricePerNight.toString())
        formData.append("starRating", formDataJson.starRating.toString())
        formData.append("adultCount", formDataJson.adultCount.toString())
        formData.append("childCount", formDataJson.childCount.toString())

        formDataJson.facilities.forEach((facility, index)=>{
            formData.append(`facilities[${index}]`, facility)
        });

        //converting imageList i.e. a fileLsit to an array
        Array.from(formDataJson.imageFiles).forEach((imageFile)=>{
            formData.append(`imageFiles`, imageFile);
        });

        onSave(formData);
    });

    return ( //spreading all these properties of formMethods to formProvider (just like react context api)
        <FormProvider {...formMethods}> 
            <form className="flex flex-col gap-10" onSubmit={onSubmit}>
                <DetailsSection />
                <TypeSection />
                <FacilitiesSection />
                <GuestsSection />
                <ImagesSection />
                <span className="flex justify-end"> 
                    <button 
                        disabled={isLoading}
                        type="submit"
                        className="bg-pink-700 text-white p-2 font-bold hover:bg-pink-500 text-xl disabled:bg-gray-500"
                    >
                        {isLoading? "Saving...": "Save"}
                    </button>
                </span>
            </form>
        </FormProvider> //all these individual child sections inside of this form..it can use formMethods from useForm hook
    );
};

export default ManageHotelForm;