import {NextFunction, Request, Response} from 'express';
import {ObjectSchema} from 'joi';

const validate = (schema: ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const {error} = schema.validate(req.body, {abortEarly: false});
    if (error) {
      res.status(400).json({error: 'Validation for endpoint failed'});
      return;
    }
    next();
  };
};

export default validate;
