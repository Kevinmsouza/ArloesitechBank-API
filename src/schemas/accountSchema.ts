import joi from "joi";

export default joi.object({
  number: joi.string().min(5).required(),
  agency: joi.string().min(3).required()
});
