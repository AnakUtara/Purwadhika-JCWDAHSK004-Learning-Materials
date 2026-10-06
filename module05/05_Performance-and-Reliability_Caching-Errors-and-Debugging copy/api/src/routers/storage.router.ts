import { Router } from "express";
import { roleGuard, verifyToken } from "../middlewares/auth.middleware.ts";
import cloudinaryStorageController from "../modules/storage/cloudinary-storage.controller.ts";
import { imageUploader } from "../middlewares/uploader.middleware.ts";

const storageRouter = Router();

storageRouter.use(verifyToken("access"), roleGuard("EDITOR"));

storageRouter.post(
	"/images",
	imageUploader().single("cover"),
	cloudinaryStorageController.uploadPostImage,
);

export default storageRouter;
