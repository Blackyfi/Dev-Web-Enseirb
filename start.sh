#!/bin/bash

# Script de démarrage SeenFlix
# Usage: ./start.sh dev | prod | stop

case "$1" in
  dev)
    echo "🚀 Démarrage en mode DÉVELOPPEMENT..."

    # Vérifier que .env.development existe
    if [ ! -f .env.local ]; then
      echo "❌ Fichier .env.local introuvable. Copie depuis .env.example..."
      cp .env.example .env.local
      echo "✅ .env.local créé. Pensez à le configurer."
    fi

    # Démarrer uniquement la database via Docker
    echo "📦 Démarrage de la base de données..."
    docker-compose up -d database

    # Attendre que la DB soit prête
    echo "⏳ Attente de la base de données..."
    sleep 5

    # Démarrer le backend en local
    echo "🔧 Démarrage du backend..."
    cd backend/src && npm install
    npm run dev
    ;;

  prod)
    echo "🚀 Démarrage en mode PRODUCTION..."

    # Vérifier que .env existe
    if [ ! -f .env ]; then
      echo "❌ Fichier .env introuvable. Copie depuis .env.example..."
      cp .env.example .env
      echo "✅ .env créé. Pensez à le configurer avec vos secrets de production."
    fi

    # Démarrer tous les services via Docker
    docker-compose up --build -d
    echo "✅ Application démarrée en production"
    docker-compose ps
    ;;

  stop)
    echo "🛑 Arrêt de tous les services..."
    docker-compose down
    echo "✅ Services arrêtés"
    ;;

  logs)
    docker-compose logs -f
    ;;

  *)
    echo "Usage: ./start.sh {dev|prod|stop|logs}"
    echo ""
    echo "  dev   - Lance la DB via Docker + backend en local (hot reload)"
    echo "  prod  - Lance tout via Docker (database + backend)"
    echo "  stop  - Arrête tous les conteneurs"
    echo "  logs  - Affiche les logs des conteneurs"
    exit 1
    ;;
esac
