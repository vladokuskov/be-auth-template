export const getServerHost = () => {
  const isDevelopment = process.env.NODE_ENV === 'development';
  return !isDevelopment ? process.env.SERVER_URL : `${process.env.SERVER_URL}:${process.env.PORT}`;
};
