exports.success = (res, data, message = "Berhasil") => {
    res.json({
        status: "success",
        message,
        data
    });
};

exports.error = (res, message = "Terjadi kesalahan", code = 500) => {
    res.status(code).json({
        status: "error",
        message
    });
};