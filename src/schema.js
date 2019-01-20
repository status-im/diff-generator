const Joi = require('joi')
 
const commit = Joi.object().keys({
  build_id: Joi.alternatives().try(Joi.number().positive(), Joi.string()).required(),
  commit: Joi.string().regex(/^[a-zA-Z0-9]{6,40}$/).required(),
  artifacts: Joi.object().pattern(/^/, Joi.string().uri().allow(null)),
})

const manual = Joi.object().keys({
  options: Joi.array().items(Joi.string()),
  files: Joi.array().items(Joi.string().uri()),
})


module.exports = { schema, manual }
