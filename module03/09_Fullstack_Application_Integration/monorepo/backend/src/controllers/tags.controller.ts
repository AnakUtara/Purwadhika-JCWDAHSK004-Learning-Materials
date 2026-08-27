import type { NextFunction, Request, Response } from "express";
import type { IBaseControllerSoftDelete } from "../interfaces/base-controller.interface.js";

// Contoh handling jika tidak seluruh method di interface IBaseControllerSoftDelete diimplementasikan
// di object literal TagsController.
// Diberikan Partial generic type supaya semua method di interface IBaseControllerSoftDelete
// menjadi optional di object literal TagsController.
const TagsController: Partial<IBaseControllerSoftDelete> = {
	async getAll(
		req: Request,
		res: Response,
		next: NextFunction,
	): Promise<void> {},
};

export default TagsController;
