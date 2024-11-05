import express, {Request, Response} from "express";
import cloudinary from "cloudinary";
import multer from "multer";
import Hotel, { HotelType } from "../models/hotel";
import verifyToken from "../middleware/auth";
import { body } from "express-validator";


const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 //5MB
    }
})

// api/my-hotels
router.post(
    "/", 
    verifyToken,[ 
        body("name").notEmpty().withMessage('Name is required'),
        body("city").notEmpty().withMessage('City is required'),
        body("country").notEmpty().withMessage('Country is required'),
        body("description").notEmpty().withMessage('Description is required'),
        body("type").notEmpty().withMessage('Hotel type is required'),
        body("pricePerNight")
            .notEmpty()
            .isNumeric()
            .withMessage('Price Per Night is required and must be a number'),
        body("facilities")
            .notEmpty()
            .isArray()
            .withMessage('Facilities are required'),
    ],
    upload.array("imageFiles", 6), 
    async(req: Request, res: Response)=>{
        try{
            const imageFiles = req.files as Express.Multer.File[];
            const newHotel: HotelType = req.body;

            //1. upload images to cloudinary
            const uploadPromises = imageFiles.map(async(image)=>{
                const b64 = Buffer.from(image.buffer).toString("base64"); // encode image to base64 string to be easily hosted to cloudinary
                let dataURI="data:"+ image.mimetype + ";base64," + b64; //data->metainfo of the image and mimetype is jpeg or png etc.
                const res = await cloudinary.v2.uploader.upload(dataURI); // upload to cloudianry
                return res.url; // need url of the hosted image to MongoDB
            }); // doing this to each item(image) in the imageFiles array --> giving an array of promises as uploads are async ..all exec(6 img upload) at same time
            
            const imageURLs = await Promise.all(uploadPromises); //waits for all imgs to be uploaded
            
            //2. if upload was successful, add the URLs to the new Hotel object
            newHotel.imageURLs = imageURLs;
            newHotel.lastUpdated = new Date();
            newHotel.userId = req.userId as string;

            //3. save the new hotel in our database
            const hotel = new Hotel(newHotel); //hotel schema document object
            await hotel.save();

            //4. return 201 status
            res.status(201).send(hotel); //created successfully
        }catch (e) {
            console.log("Error creating Hotel: ",e);
            res.status(500).json({message: "Something went wrong"});
        }
});

export default router;