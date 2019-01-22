const Joi = require('joi')

const artifact = Joi.string().uri().allow(null)

const artifacts = Joi.object().pattern(/^/, artifact)
 
const build = Joi.object().keys({
  commit: Joi.string().regex(/^[a-zA-Z0-9]{6,40}$/).required(),
  name: Joi.string().required(),
  url: artifact,
  type: Joi.string().valid('ios', 'android', 'linux', 'windows', 'macos'),
})

const builds = Joi.object().keys({
  build_id: Joi.alternatives().try(Joi.number().positive(), Joi.string()).required(),
  build_url: Joi.string().uri().required(),
  artifacts: artifacts,
})

const manual = Joi.object().keys({
  options: Joi.array().items(Joi.string()).valid(null),
  name: Joi.string().uri().valid(null),
  east: Joi.string().uri().required(),
  west: Joi.string().uri().required(),
})


module.exports = { artifact, artifacts, build, builds, manual }
