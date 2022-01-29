import joi from "joi";

export default joi.object({
  number: joi.string().pattern(/^([0-9]+)-([0-9]|X)$/).length(7).required(),
  agency: joi.string().pattern(/^[0-9]+$/).length(4).required()
});
