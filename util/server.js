module.exports.server = (http, port) => {
  http.listen(port, () => {
    console.log(`server is listening on port ${port}`);
  });
};
