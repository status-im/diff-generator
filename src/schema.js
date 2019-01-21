const Joi = require('joi')

const artifact = Joi.string().uri().allow(null)

const artifacts = Joi.object().pattern(/^/, artifact)
 
const build = Joi.object().keys({
  commit: Joi.string().regex(/^[a-zA-Z0-9]{6,40}$/).required(),
  build_id: Joi.alternatives().try(Joi.number().positive(), Joi.string()).required(),
  build_url: Joi.string().uri().required(),
  platform: Joi.string().valid('ios', 'android', 'linux', 'windows', 'macos'),
  artifact_url: artifact,
})

const builds = Joi.object().keys({
  build_id: Joi.alternatives().try(Joi.number().positive(), Joi.string()).required(),
  build_url: Joi.string().uri().required(),
  artifacts: artifacts,
})

const manual = Joi.object().keys({
  options: Joi.array().items(Joi.string()).valid(null),
  left: Joi.string().uri().required(),
  right: Joi.string().uri().required(),
})


module.exports = { artifact, artifacts, build, builds, manual }
