import type { NextFunction, Request, Response } from "express";

// Sifat OOP-nya bisa dikendalikan dari level interface dan type saja.
// Dengan begini setiap controller bisa lebih konsisten karena harus memiliki method-method yang sama,
// misal getAll, getById, create, update, delete

interface IBaseController {
	getAll(req: Request, res: Response, next: NextFunction): Promise<void>;
	getById(req: Request, res: Response, next: NextFunction): Promise<void>;
	create(req: Request, res: Response, next: NextFunction): Promise<void>;
	update(req: Request, res: Response, next: NextFunction): Promise<void>;
	delete(req: Request, res: Response, next: NextFunction): Promise<void>;
}

interface IBaseControllerSoftDelete extends IBaseController {
	restore(req: Request, res: Response, next: NextFunction): Promise<void>;
}

export type { IBaseController, IBaseControllerSoftDelete };
