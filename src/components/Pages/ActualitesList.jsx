import React, { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { fetchActualites } from '../../api/articles';
import { absoluteMediaUrl } from '../../utils/strapiUrl';
import '../../styles/articles.css';

/**
 * Page: Liste des Actualités
 * Objectif: charger et afficher TOUTES les actualités (pas seulement 12).
 * - Récupération par lots jusqu'à épuisement (page++ tant qu'il y a des résultats)
 * - Grille responsive
 * - Skeletons, gestion erreurs
 * - Fallback visuel quand pas d'image
 */
const ActualitesList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Affichage progressif (front-only): 10 items au départ puis "Voir plus"
  const [visibleCount, setVisibleCount] = useState(10);
  useEffect(() => {
    // Réinitialise l'affichage quand une nouvelle liste arrive
    setVisibleCount(10);
  }, [items]);

  // Scroll en haut à l'ouverture de la page (comme sur Produits)
  useEffect(() => {
    try {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' });
    } catch (_) {
      window.scrollTo(0, 0);
    }
  }, []);

  // --- Helpers to normalize Strapi v4/v5 responses & media ---
  const pickMediaUrl = (media) => {
    if (!media) return null;
    // Strapi upload object from Cloudinary or local:
    // - direct: { url, formats }
    // - nested: { data: { attributes: { url, formats } } }
    const node = media?.data?.attributes || media;
    const candidate =
      node?.formats?.large?.url ||
      node?.formats?.medium?.url ||
      node?.formats?.small?.url ||
      node?.url ||
      null;
    if (!candidate) return null;
    // Si c'est un asset front (/images/...), on garde tel quel; sinon on absolutise avec le backend
    return typeof candidate === 'string' && candidate.startsWith('/images/')
      ? candidate
      : absoluteMediaUrl(candidate);
  };

  const normalizeArticle = (raw) => {
    // Accepte soit un item aplati, soit { id, attributes } de Strapi
    const a = raw?.attributes ? { id: raw.id, ...raw.attributes } : raw || {};
    return {
      id: a.documentId || a.id,
      title: a.title || '',
      slug: a.slug || a.documentId || (a.id && String(a.id)) || '',
      excerpt: a.excerpt || '',
      content: a.content || '',
      publishedAt: a.publishedAt || a.createdAt || null,
      coverUrl: pickMediaUrl(a.cover) || pickMediaUrl(a.image) || '/images/news-placeholder.jpg',
      _alt: a.cover?.alternativeText || a.image?.alternativeText || a.title || 'Actualité',
    };
  };

  // Format de date FR mémorisé
  const formatDate = useMemo(
    () => (iso) =>
      iso
        ? new Date(iso).toLocaleDateString('fr-FR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })
        : '',
    []
  );

  // Charge TOUTES les actualités par lots de PAGE_SIZE
  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const PAGE_SIZE = 50; // lot assez grand pour limiter les requêtes
        let page = 1;
        const all = [];

        // on boucle jusqu'à ce qu'un lot revienne vide (ou plus petit que PAGE_SIZE)
        // fetchActualites doit renvoyer { items: [...] } ; si ce n'est pas le cas,
        // on sécurise avec une valeur par défaut []
        while (true) {
          const res = await fetchActualites({ page, pageSize: PAGE_SIZE });
          const batch = Array.isArray(res?.items) ? res.items : [];
          if (!batch.length) break;
          all.push(...batch);
          if (batch.length < PAGE_SIZE) break;
          page += 1;
        }

        if (!cancelled) setItems(all);
      } catch (e) {
        console.error('Actualités – fetch error:', e);
        if (!cancelled) setError("Impossible de récupérer les actualités pour le moment.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, []);

  const SkeletonCard = () => (
    <article className="article-card skeleton" aria-hidden="true">
      <div className="actu-cover" />
      <div className="article-card-content">
        <div className="sk-line sk-w-40" />
        <div className="sk-line sk-w-90 sk-lg" />
        <div className="sk-line sk-w-70" />
      </div>
    </article>
  );

  return (
    <div className="page--article actualites-wrapper">
      {/* En‑tête */}
      <header
        className="actualites-hero"
        style={{
          backgroundImage:
            "linear-gradient(to bottom, rgba(0,0,0,.35), rgba(0,0,0,.35)), url('/images/actualites.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          color: "#fff"
        }}
      >
        <div className="container">
          <nav className="breadcrumb" aria-label="Fil d’ariane" style={{ color: "#fff", opacity: 0.9 }}>
            <Link to="/" style={{ color: "#fff" }}>Accueil</Link>
            <span> | </span>
            <span aria-current="page">Actualités</span>
          </nav>
          <h1 className="section-title" style={{ color: "#fff", marginTop: "0.5rem" }}>Actualités</h1>
          <p className="subtitle" style={{ color: "#fff", maxWidth: 900 }}>
            Nos chantiers, conseils, nouveautés produits et infos locales autour du poêle et du chauffage.
          </p>
        </div>
      </header>

      {/* Contenu */}
      <main className="container">
        {loading ? (
          <div className="articles-list">
            {Array.from({ length: 12 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : error ? (
          <div className="actu-empty" role="alert">
            <p>{error}</p>
            <Link className="btn" to="/">Retour à l’accueil</Link>
          </div>
        ) : items.length === 0 ? (
          <div className="actu-empty">
            <p>Aucune actualité pour le moment.</p>
            <Link className="btn" to="/">Retour à l’accueil</Link>
          </div>
        ) : (
          <>
            <p className="actu-count" style={{ margin: '16px 0 24px', opacity: 0.7 }}>
              Affichage de {Math.min(visibleCount, items.length)} / {items.length} actualit{items.length > 1 ? 'és' : 'é'}.
            </p>
            <div className="articles-list">
              {items.slice(0, visibleCount).map((raw) => {
                const item = normalizeArticle(raw);
                return (
                  <article className="article-card" key={item.id}>
                    <Link to={`/actualites/${item.slug}`} className="actu-cover-link" aria-label={item.title}>
                      <div className="actu-cover">
                        {item.coverUrl ? (
                          <img
                            src={item.coverUrl}
                            alt={item._alt}
                            loading="lazy"
                          />
                        ) : (
                          <div className="actu-cover placeholder" aria-hidden="true" />
                        )}
                      </div>
                    </Link>

                    <div className="article-card-content">
                      <time className="actu-date" dateTime={item.publishedAt || ''}>
                        {formatDate(item.publishedAt)}
                      </time>
                      <h2 className="actu-title">
                        <Link to={`/actualites/${item.slug}`}>{item.title}</Link>
                      </h2>
                      {item.excerpt && <p className="actu-excerpt">{item.excerpt}</p>}
                      <div className="actu-actions">
                        <Link className="btn btn-link" to={`/actualites/${item.slug}`}>
                          Lire plus
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            {visibleCount < items.length && (
              <div className="text-center" style={{ marginTop: '24px' }}>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setVisibleCount((n) => n + 10)}
                  aria-label="Charger plus d’actualités"
                >
                  Voir plus
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
};

export default ActualitesList;