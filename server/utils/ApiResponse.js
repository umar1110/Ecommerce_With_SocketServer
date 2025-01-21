const ApiResponse = {
  success: (res, { data = null, message = null, statusCode = 200 } = {}) => {
    const response = { success: true, data };

    // Only include message if it’s not null or undefined
    if (message) {
      response.message = message;
    }

    return res.status(statusCode).json(response);
  },
};

module.exports = { ApiResponse };
