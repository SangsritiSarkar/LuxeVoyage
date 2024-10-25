import {Link} from "react-router-dom";
import { useAppContext } from "../contexts/AppContext";
import SignOutButton from "./SignOutButton";

const Header=()=>{
    const {isLoggedIn} = useAppContext();
    return(
        <div className="bg-pink-800 py-6 ">
            <div className="container mx-auto flex justify-between">
                <span className="text-3xl text-white font-bold tracking-tight">
                    <Link to="/">LuxeVoyage.com</Link>
                </span>
                <span className="flex  space-x-2 items-center">
                    {isLoggedIn ? (
                        <>
                            <Link to="/my-bookings">My Bookings</Link>
                            <Link to="/my-hotels">My Hotels</Link>
                            <SignOutButton />
                        </>
                        ): (
                        <Link 
                            to="/sign-in" 
                            className="flex bg-white items-center text-pink-600 px-3 py-1 font-bold hover:bg-gray-100 text-lg"
                        >
                        Sign In
                        </Link>
                    )}  
                </span>
            </div>
        </div>
    );
};

export default Header; 