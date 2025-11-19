// Middleware to validate request data (email, password, etc.)

export const validateFavoriteData = (data) => {
    const errors = [];
    if (!data.movie_id) {
        errors.push('(movie_id) est requis');
    } else if (typeof data.movie_id !== 'number' || data.movie_id <= 0) {
        errors.push('(movie_id) doit être un nombre positif');
    }
    if (!data.type) {
        errors.push('(type) est requis');
    } else if (typeof data.type !== 'string') {
        errors.push('(type) doit être une chaîne de caractères');
    } else {
        const validTypes = ['movie', 'serie'];
        const normalizedType = data.type.toLowerCase();
        if (!validTypes.includes(normalizedType)) {
            errors.push('(type) doit être "movie" ou "serie"');
        }
    }
    if (data.rating !== undefined && data.rating !== null) {
        if (typeof data.rating !== 'number') {
            errors.push('(rating) doit être un nombre');
        } else if (data.rating < 0 || data.rating > 10) {
            errors.push('(rating) doit être entre 0 et 10');
        }
    }
    if (data.comment !== undefined && data.comment !== null) {
        if (typeof data.comment !== 'string') {
            errors.push('Le commentaire (comment) doit être une chaîne de caractères');
        } else if (data.comment.length > 1000) {
            errors.push('Le commentaire (comment) ne doit pas dépasser 1000 caractères');
        }
    }
    return {
        isValid: errors.length === 0,
        errors
    };
};
