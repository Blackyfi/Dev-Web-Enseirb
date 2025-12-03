// On exporte de nouvelles erreurs en utilisant Error
export class BadRequestError extends Error {
  constructor(message = 'Requête invalide') {
    super(message);
    this.name = 'BadRequestError';
    this.status = 400;
  }
}

export class UnauthorizedError extends Error {
  constructor(message = 'Non authentifié') {
    super(message);
    this.name = 'UnauthorizedError';
    this.status = 401;
  }
}

export class NotFoundError extends Error {
  constructor(message = 'Ressource non trouvée') {
    super(message);
    this.name = 'NotFoundError';
    this.status = 404;
  }
}

export class ConflictError extends Error {
  constructor(message = 'Conflit - La ressource existe déjà') {
    super(message);
    this.name = 'ConflictError';
    this.status = 409;
  }
}

export class InternalServerError extends Error {
  constructor(message = 'Erreur interne du serveur') {
    super(message);
    this.name = 'InternalServerError';
    this.status = 500;
  }
}

export class TooManyRequestsError extends Error {
  constructor(message = 'Trop de requêtes, veuillez réessayer plus tard') {
    super(message);
    this.name = 'TooManyRequestsError';
    this.status = 429;
  }
}

export class ServiceUnavailableError extends Error {
  constructor(message = 'Service temporairement indisponible') {
    super(message);
    this.name = 'ServiceUnavailableError';
    this.status = 503;
  }
}

export class TmdbApiError extends Error {
  constructor(statusCode, message, originalError = null) {
    super(message);
    this.name = 'TmdbApiError';
    this.status = statusCode;
    this.originalError = originalError;
  }
}

// Error Handler Middleware
export const errorHandler = (err, req, res, next) => {
  // Log l'erreur pour le débogage
  console.error(`[${err.name || 'Error'}] ${err.message}`);
  console.error(err.stack);

  // Gestion des erreurs du sujet
  // On utilise instanceof pour s'assurerer que c'est la bonne erreur (nom, type et hérédition)
  if (err instanceof BadRequestError) {
    return res.status(400).json({
      error: {
        message: err.message,
        status: 400
      }
    });
  }

  if (err instanceof UnauthorizedError) {
    return res.status(401).json({
      error: {
        message: err.message,
        status: 401
      }
    });
  }

  if (err instanceof NotFoundError) {
    return res.status(404).json({
      error: {
        message: err.message,
        status: 404
      }
    });
  }

  if (err instanceof ConflictError) {
    return res.status(409).json({
      error: {
        message: err.message,
        status: 409
      }
    });
  }

  if (err instanceof InternalServerError) {
    return res.status(500).json({
      error: {
        message: err.message,
        status: 500
      }
    });
  }

  if (err instanceof TooManyRequestsError) {
    return res.status(429).json({
      error: {
        message: err.message,
        status: 429
      }
    });
  }

  if (err instanceof ServiceUnavailableError) {
    return res.status(503).json({
      error: {
        message: err.message,
        status: 503
      }
    });
  }

  if (err instanceof TmdbApiError) {
    return res.status(err.status).json({
      error: {
        message: err.message,
        status: err.status,
        service: 'TMDB'
      }
    });
  }

  // Erreur par défaut (500) pour toutes les autres erreurs non gérées
  return res.status(err.status || 500).json({
    error: {
      message: err.message || 'Erreur interne du serveur',
      status: err.status || 500
    }
  });
};
