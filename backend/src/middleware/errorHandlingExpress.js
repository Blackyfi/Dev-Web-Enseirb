// On exporte de nouvelles erreurs en utilisant Error
export class BadRequestError extends Error {
  constructor(message = 'Requête invalide') {// message par défaut Requête invalide
    // On ajoute 2 nouveaux paramètres à notre Erreur
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

export class InternalServerError extends Error {
  constructor(message = 'Erreur interne du serveur') {
    super(message);
    this.name = 'InternalServerError';
    this.status = 500;
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

  if (err instanceof InternalServerError) {
    return res.status(500).json({
      error: {
        message: err.message,
        status: 500
      }
    });
  }

  // Erreur par défaut (500) pour toutes les autres erreurs non gérées
  return res.status(500).json({
    error: {
      message: 'Erreur interne du serveur',
      status: 500
    }
  });
};
