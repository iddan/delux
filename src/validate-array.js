module.exports = function validateArray (a) {
    if (Array.isArray(a)) {
        return a;
    }
    else {
        return [a];
    }
};
