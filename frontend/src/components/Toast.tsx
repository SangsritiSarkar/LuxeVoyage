import { useEffect } from "react";

type ToastProps = {
    message: string;
    type: "SUCCESS" |"ERROR";
    onClose: ()=>void;
}

const Toast =({message, type, onClose} : ToastProps)=>{

    useEffect(()=>{
        const timer = setTimeout(()=>{
            onClose()
        },5000);

        //reset timer
        return ()=>{
            clearTimeout(timer);
        };
    },[onClose]); //[onClose] so it renders only for the first time

    //depending on type diff bg color
    const styles = type === "SUCCESS"
        ? "fixed top-4 right-4 z-50 p-4 rounded-md bg-green-400 text-white max-w-md"
        : "fixed top-4 right-4 z-50 p-4 rounded-md bg-red-400 text-white max-w-md"
    return(
        <div className={styles}>
            <div className="flex justify-center items-center">
                <span className="text-lg font-semibold">{message}</span>
            </div>
        </div>
    )
}

export default Toast;