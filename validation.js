const Joi = require("@hapi/joi");

const dvdValidation = (data) => {
  const schema = Joi.object({
    title: Joi.string()
      .max(50)
      .required()
  })
  return schema.validate(data);
};

module.exports.dvdValidation = dvdValidation;