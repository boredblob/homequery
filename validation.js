const Joi = require("@hapi/joi");

const dvdValidation = (data) => {
  const schema = Joi.object({
    name: Joi.string()
      .min(3)
      .max(30)
      .required()
  })
  return schema.validate(data);
};

module.exports.dvdValidation = dvdValidation;