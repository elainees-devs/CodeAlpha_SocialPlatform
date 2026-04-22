// src/middlewares/validate.middleware.ts
import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils";

export const validate =
  <T>(schema: ZodSchema<T>) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const result = schema.safeParse(req.body);

    if (!result.success) {
      return next(
        new ApiError(400, "Validation failed", result.error.flatten())
      );
    }

    req.body = result.data;
    next();
  };