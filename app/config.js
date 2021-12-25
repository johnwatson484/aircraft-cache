const Joi = require('joi')
const envs = ['development', 'test', 'production']

// Define config schema
const schema = Joi.object().keys({
  env: Joi.string().valid(...envs).default(envs[0]),
  message: Joi.object({
    host: Joi.string(),
    port: Joi.number().default(5672),
    username: Joi.string(),
    password: Joi.string(),
    exchange: Joi.string().default('aircraft-tracked')
  })
})

// Build config
const config = {
  env: process.env.NODE_ENV,
  message: {
    host: process.env.MESSAGE_HOST,
    port: process.env.MESSAGE_PORT,
    username: process.env.MESSAGE_USERNAME,
    password: process.env.MESSAGE_PASSWORD,
    exchange: process.env.MESSAGE_EXCHANGE
  }
}

// Validate config
const { error, value } = schema.validate(config)

// Throw if config is invalid
if (error) {
  throw new Error(`The server config is invalid. ${error.message}`)
}

value.isDev = value.env === 'development'

module.exports = value
