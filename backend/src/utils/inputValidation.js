function validatefilm_id(film_id) {
    if (film_id === undefined || film_id === null) {
        return { isValid: false, error: 'film_id is required' };
    }
    const id = Number(film_id);
    if (!Number.isInteger(id) || id <= 0) {
        return { isValid: false, error: 'film_id must be a positive integer' };
    }
    return { isValid: true, error: null };
}

function validateType(type) {
    if (type === undefined || type === null || type === '') {
        return { isValid: false, error: 'type is required' };
    }
    if (typeof type !== 'string') {
        return { isValid: false, error: 'type must be a string' };
    }
    const validTypes = ['movie', 'tv'];
    if (!validTypes.includes(type.toLowerCase())) {
        return { isValid: false, error: 'type must be either "movie" or "tv"' };
    }
    return { isValid: true, error: null };
}

function validateRating(rating) {
    if (rating === undefined || rating === null || rating === '') {
        return { isValid: true, error: null };
    }
    const ratingNum = Number(rating);
    if (isNaN(ratingNum)) {
        return { isValid: false, error: 'rating must be a number' };
    }
    if (ratingNum < 0 || ratingNum > 10) {
        return { isValid: false, error: 'rating must be between 0 and 10' };
    }
    return { isValid: true, error: null };
}

function validateComment(comment, maxLength = 1000) {
    if (comment === undefined || comment === null || comment === '') {
        return { isValid: true, error: null };
    }
    if (typeof comment !== 'string') {
        return { isValid: false, error: 'comment must be a string' };
    }
    if (comment.length > maxLength) {
        return { isValid: false, error: `comment must not exceed ${maxLength} characters` };
    }
    if (comment.trim().length === 0) {
        return { isValid: false, error: 'comment cannot be empty or contain only whitespace' };
    }
    return { isValid: true, error: null };
}

function validateFavoriteData(data) {
    const errors = [];
    // Validate required fields
    const film_idValidation = validatefilm_id(data.film_id);
    if (!film_idValidation.isValid) {
        errors.push(film_idValidation.error);
    }
    const typeValidation = validateType(data.type);
    if (!typeValidation.isValid) {
        errors.push(typeValidation.error);
    }
    // Validate optional fields
    const ratingValidation = validateRating(data.rating);
    if (!ratingValidation.isValid) {
        errors.push(ratingValidation.error);
    }
    const commentValidation = validateComment(data.comment);
    if (!commentValidation.isValid) {
        errors.push(commentValidation.error);
    }
    return {
        isValid: errors.length === 0,
        errors: errors.length > 0 ? errors : null
    };
}

module.exports = {
    validatefilm_id,
    validateType,
    validateRating,
    validateComment,
    validateFavoriteData
};
