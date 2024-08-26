const roleBased = (roles) => {
    return (req, res, next) => {
        try {
            if (roles.includes(req.user.role)) {
                next();
            } else {
                return res.status(403).json({ message: "Access denied 'pass admin not users'" });
            }
        } catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Something went wrong", error: err.message });
        }
    };
};

module.exports = { roleBased };