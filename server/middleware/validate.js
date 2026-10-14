const { error } = require('../utils/responseHelper');

const validate = (schema) => (req, res, next) => {
  try {
    req.body = schema.parse(req.body);
    next();
  } catch (err) {
    if (err && (err.name === 'ZodError' || Array.isArray(err.issues) || Array.isArray(err.errors))) {
      const issues = Array.isArray(err.issues) ? err.issues : (Array.isArray(err.errors) ? err.errors : []);
      const errorMessages = issues.map((e) => ({
        field: Array.isArray(e.path) ? e.path.join('.') : String(e.path || ''),
        message: e.message || 'Validation error'
      }));
      return error(res, 'Validation failed', 400, { details: errorMessages });
    }
    next(err);
  }
};

module.exports = validate;
