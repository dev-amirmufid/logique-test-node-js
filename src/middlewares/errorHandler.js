export const errorHandler = (err, req, res) => {
    res.status(500).json({ message: err.message });
};
