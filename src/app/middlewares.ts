import { RequestHandler } from 'express';
import { validationResult, ValidationError } from 'express-validator';

type BadRequestResponse = {
  errors: ValidationError[];
};

export const validateInput: RequestHandler<
  never,
  BadRequestResponse
> = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};