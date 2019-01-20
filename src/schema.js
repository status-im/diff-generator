const Joi = require('joi')
 
const builds = Joi.object().pattern(
  /^/, Joi.string().uri().allow(null)
)

const manual = Joi.object().keys({
  options: Joi.array().items(Joi.string()),
  files: Joi.array().items(Joi.string().uri()),
})


module.exports = { schema, manual }
