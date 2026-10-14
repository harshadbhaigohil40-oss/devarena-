const success = (res, data, statusCode = 200) => {
  res.status(statusCode).json({ success: true, data });
};

const error = (res, message, statusCode = 400, extra = {}) => {
  res.status(statusCode).json({ success: false, error: message, ...extra });
};

const paginated = (res, data, total, page, limit) => {
  res.status(200).json({
    success: true,
    data,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  });
};

module.exports = { success, error, paginated };
