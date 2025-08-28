import React, { useEffect, useState, Fragment } from 'react';
import { Link } from 'react-router-dom';
import { fetchActualites } from '../../api/articles';
import { absoluteMediaUrl } from '../../utils/strapiUrl';
import '../../styles/articles.css';

/**
 * Liste des actualités
 * - Grille responsive 1/2/3 colonnes
 * - Cartes avec image de couverture, titre, date, extrait + lien "Lire plus"
 * - Skeleton loader pendant le chargement
 * - Message vide lorsqu'il n'y a pas d'articles
 */
const ActualitesList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { items } = await fetchActualites({ page: 1, pageSize: 12 });
        if (!mounted) return;
        setItems(items || []);
      } catch (e) {
        console.error('Actualités – fetch error:', e);
        if (mounted) setError('Impossible de récupérer les actualités pour le moment.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const SkeletonCard = () => (
    <div className="article-card skeleton">
      <div className="actu-cover" />
      <div className="article-card-content">
        <div className="actu-date sk-block" />
        <div className="actu-title sk-block" />
        <div className="actu-excerpt sk-block" />
      </div>
    </div>
  );

  const formatDate = (iso) =>
    iso ? new Date(iso).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' }) : '';

  return (
    <div className="actualites-wrapper">
      {/* En‑tête de section */}
      <header className="actualites-hero">
        <div className="container">
          <p className="overline">La Flamme Limouxine</p>
          <h1 className="section-title">Actualités</h1>
          <p className="subtitle">
            Nos chantiers, conseils, nouveautés produits et infos locales autour du poêle et du chauffage.
          </p>
        </div>
      </header>

      {/* Contenu */}
      <main className="container">
        {loading ? (
          <div className="articles-list">
            {Array.from({ length: 6 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="actu-empty">
            <p>{error}</p>
            <Link className="btn" to="/">Retour à l’accueil</Link>
          </div>
        ) : items.length === 0 ? (
          <div className="actu-empty">
            <p>Aucune actualité pour le moment.</p>
            <Link className="btn" to="/">Retour à l’accueil</Link>
          </div>
        ) : (
          <div className="articles-list">
            {items.map((actu) => {
              const cover =
                actu.cover?.formats?.large?.url ||
                actu.cover?.formats?.medium?.url ||
                actu.cover?.url ||
                null;

              return (
                <article className="article-card" key={actu.id}>
                  <Link to={`/actualites/${actu.slug}`} className="actu-cover-link" aria-label={actu.title}>
                    <div className="actu-cover">
                      {cover ? (
                        <img
                          src={absoluteMediaUrl(cover)}
                          alt={actu.title}
                          loading="lazy"
                        />
                      ) : (
                        <div className="actu-cover placeholder" aria-hidden="true" />
                      )}
                    </div>
                  </Link>

                  <div className="article-card-content">
                    <time className="actu-date" dateTime={actu.publishedAt || ''}>
                      {formatDate(actu.publishedAt)}
                    </time>
                    <h2 className="actu-title">
                      <Link to={`/actualites/${actu.slug}`}>{actu.title}</Link>
                    </h2>
                    {actu.excerpt && <p className="actu-excerpt">{actu.excerpt}</p>}
                    <div className="actu-actions">
                      <Link className="btn btn-link" to={`/actualites/${actu.slug}`}>
                        Lire plus
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default ActualitesList;