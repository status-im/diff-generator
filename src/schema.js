const Joi = require('joi')

const artifacts = Joi.object().pattern(/^/, Joi.string().uri().allow(null))
 
const build = Joi.object().keys({
  build_id: Joi.alternatives().try(Joi.number().positive(), Joi.string()).required(),
  build_url: Joi.string().uri().required(),
  artifacts: artifacts,
})

const manual = Joi.object().keys({
  options: Joi.array().items(Joi.string()),
  files: Joi.array().items(Joi.string().uri()),
})


module.exports = { artifacts, build, manual }
