const { error } = require('../utils/responseHelper');

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    const errorMessages = err.errors.map((e) => ({
      field: e.path.join('.'),
      message: e.message
    }));
    return error(res, 'Validation failed', 400, { details: errorMessages });
  }
};

module.exports = validate;
