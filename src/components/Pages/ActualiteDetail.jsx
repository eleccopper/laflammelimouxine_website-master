import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchActualiteBySlug } from "../../api/articles";
import { absoluteMediaUrl } from "../../utils/strapiUrl";
import "../../styles/articles.css";

// Page détail d'une actualité : /actualites/:slug
export default function ActualiteDetail() {
  const { slug } = useParams();
  const [state, setState] = useState({ loading: true, error: null, item: null });

  useEffect(() => {
    let alive = true;
    setState((s) => ({ ...s, loading: true, error: null }));

    (async () => {
      try {
        const article = await fetchActualiteBySlug(slug);
        if (!alive) return;
        if (!article) {
          setState({ loading: false, error: new Error("Introuvable"), item: null });
        } else {
          setState({ loading: false, error: null, item: article });
          // Petit bonus SEO/accessibilité : mettre le titre dans l'onglet
          try { document.title = `${article.title} – Actualités`; } catch {}
        }
      } catch (err) {
        if (!alive) return;
        setState({ loading: false, error: err, item: null });
      }
    })();

    return () => { alive = false; };
  }, [slug]);

  const { loading, error, item } = state;

  const coverUrl = useMemo(() => {
    const media = item?.image || item?.cover; // compat image/cover
    if (!media) return null;
    const url = media?.formats?.large?.url || media?.formats?.medium?.url || media?.url;
    return url ? absoluteMediaUrl(url) : null;
  }, [item]);

  if (loading) {
    return (
      <main className="container page--article">
        <div className="lfl-skeleton lfl-skeleton--title" />
        <div className="lfl-skeleton lfl-skeleton--block" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="container page--article">
        <h1>Actualité</h1>
        <p role="alert">Une erreur est survenue : {error.message}</p>
        <p><Link to="/actualites">← Retour aux actualités</Link></p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="container page--article">
        <h1>Actualité introuvable</h1>
        <p><Link to="/actualites">← Retour aux actualités</Link></p>
      </main>
    );
  }

  const published = formatDate(item.publishedAt || item.date || item.createdAt);

  return (
    <main className="article-detail page--article">
      <nav aria-label="Fil d’ariane" className="breadcrumb">
        <Link to="/">Accueil</Link>
        <span> / </span>
        <Link to="/actualites">Actualités</Link>
        <span> / </span>
        <span aria-current="page">{item.title}</span>
      </nav>

      <article>
        <header className="actualite-header">
          <h1 className="actualite-title">{item.title}</h1>
          {published && (
            <time dateTime={item.publishedAt} className="actualite-date">
              {published}
            </time>
          )}
          {coverUrl && (
            <figure className="actualite-cover">
              <img
                src={coverUrl}
                alt={item.title || "Image d’illustration de l’article"}
                loading="eager"
                className="article-detail-hero"
              />
            </figure>
          )}
        </header>

        {item.excerpt && <p className="actualite-excerpt">{item.excerpt}</p>}

        <section className="actualite-content">
          {typeof item.content === "string" ? (
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          ) : Array.isArray(item.content) ? (
            item.content.map((block, idx) => <p key={idx}>{String(block)}</p>)
          ) : item.content ? (
            <p>{String(item.content)}</p>
          ) : null}
        </section>

        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <footer className="actualite-tags">
            <strong>Mots-clés :</strong>{" "}
            {item.tags.map((t, i) => {
              const label = typeof t === "string" ? t : t?.name || t?.title || "";
              return (
                <span key={label + i} className="tag">
                  {label}
                  {i < item.tags.length - 1 ? ", " : ""}
                </span>
              );
            })}
          </footer>
        )}
      </article>

      <p className="back-link">
        <Link to="/actualites">← Toutes les actualités</Link>
      </p>
    </main>
  );
}

function formatDate(iso) {
  try {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}
