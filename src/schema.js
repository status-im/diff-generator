const Joi = require('joi')

const builds = Joi.object().pattern(/^/, Joi.string().uri().allow(null))
 
const commit = Joi.object().keys({
  build_id: Joi.alternatives().try(Joi.number().positive(), Joi.string()).required(),
  build_url: Joi.string().uri().required(),
  artifacts: builds,
})

const manual = Joi.object().keys({
  options: Joi.array().items(Joi.string()),
  files: Joi.array().items(Joi.string().uri()),
})


module.exports = { builds, commit, manual }
