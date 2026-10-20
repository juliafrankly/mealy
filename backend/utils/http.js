// Sends a generic 500 response and logs the real error for the developer
function serverError(res, err) {
    console.error(err);
    res.status(500).json({ message: "Something went wrong. Please try again." });
}

// Reads :id from the URL. If it is not a whole number, a 400 response is
// sent and null is returned, so the caller can simply stop.
function parseId(req, res, message = "Invalid recipe id.") {
    const id = Number(req.params.id);
    if (!Number.isInteger(id)) {
        res.status(400).json({ message });
        return null;
    }
    return id;
}

module.exports = { serverError, parseId };