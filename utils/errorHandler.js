module.exports = (res, error) => {
    res.status(500).json({
        success: false, // new error видає помилку з полем message
        message: error.message ? error.message: error
    })
}
