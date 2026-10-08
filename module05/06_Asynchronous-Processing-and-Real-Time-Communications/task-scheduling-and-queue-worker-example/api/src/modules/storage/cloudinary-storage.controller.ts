import type { NextFunction, Request, Response } from "express";
import AppError from "../../errors/app.error.ts";
import Cloudinary from "../../libs/cloudinary.js";
import { Readable } from "stream";
import EmailService from "../../modules/email/email.service.ts";
import renderTemplate from "../../libs/handlebars.js";

const baseDir = "jcwd-blog-2026";

const CloudinaryStorageController = {
	uploadPostImage: (req: Request, res: Response, next: NextFunction) => {
		const { email } = req.auth;

		if (!req.file) throw new AppError("No file uploaded", 400);

		const stream = Cloudinary.uploader.upload_stream(
			{ folder: `${baseDir}/posts/${email}/images` },
			(err, result) => {
				if (err || !result)
					return next(new AppError("Upload failed", 500, err));

				return res.send({
					status: 200,
					message: "Image uploaded successfully!",
					data: { url: result.secure_url },
				});
			},
		);

		Readable.from(req.file?.buffer).pipe(stream);
	},
};

export default CloudinaryStorageController;
