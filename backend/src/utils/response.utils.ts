export const sendSuccess = (res, message = 'Success', data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const sendError = (res, message = 'Error occurred', statusCode = 500, errors = null) => {
  const response: any = {
    success: false,
    message,
  };
  
  if (errors) {
    response.errors = errors;
  }

  return res.status(statusCode).json(response);
};
