import joi from "joi";

export default joi.object({
  value: joi.number().positive().precision(2).required(),
  targetAccount: joi.object({
    number: joi.string().min(5).required(),
    agency: joi.string().min(3).required()
  })
});
