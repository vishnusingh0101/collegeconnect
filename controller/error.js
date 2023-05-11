// control to handle 404 error
exports.get404 = (req, res, next) => {
    res.status(404).send('<h1>Page Not Found</h1>');
}