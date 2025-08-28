import React, { useEffect, useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
// API (sera créé juste après)
import { fetchActualiteBySlug } from "../../api/articles";
// Helper URL absolue (sera créé si absent)
import { absoluteMediaUrl } from "../../utils/strapiUrl";

// Composant détail d'une actualité (article)
// URL attendue: /actualites/:slug
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
        }
      } catch (err) {
        if (!alive) return;
        setState({ loading: false, error: err, item: null });
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  const { loading, error, item } = state;

  const coverUrl = useMemo(() => {
    const media = item?.image || item?.cover; // accepte `image` (v5) ou `cover` (ancien)
    if (!media) return null;
    const url = media.formats?.large?.url || media.formats?.medium?.url || media.url;
    return absoluteMediaUrl(url);
  }, [item]);

  if (loading) {
    return (
      <main className="container">
        <div className="lfl-skeleton lfl-skeleton--title" />
        <div className="lfl-skeleton lfl-skeleton--block" />
      </main>
    );
  }

  if (error) {
    return (
      <main className="container">
        <h1>Actualité</h1>
        <p role="alert">Une erreur est survenue : {error.message}</p>
        <p><Link to="/actualites">← Retour aux actualités</Link></p>
      </main>
    );
  }

  if (!item) {
    return (
      <main className="container">
        <h1>Actualité introuvable</h1>
        <p><Link to="/actualites">← Retour aux actualités</Link></p>
      </main>
    );
  }

  const published = formatDate(item.publishedAt);

  return (
    <main className="container actualite-detail">
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
          {published && <time dateTime={item.publishedAt} className="actualite-date">{published}</time>}
          {coverUrl && (
            <div className="actualite-cover" aria-hidden={false}>
              <img src={coverUrl} alt={item.title || "Image d’illustration de l’article"} loading="eager" />
            </div>
          )}
        </header>

        {item.excerpt && <p className="actualite-excerpt">{item.excerpt}</p>}

        <section className="actualite-content">
          {/* Le contenu est supposé venir au format HTML (Rich Text Strapi). */}
          {typeof item.content === "string" ? (
            <div dangerouslySetInnerHTML={{ __html: item.content }} />
          ) : Array.isArray(item.content) ? (
            item.content.map((block, idx) => (
              <p key={idx}>{String(block)}</p>
            ))
          ) : (
            <p>{item.content}</p>
          )}
        </section>

        {Array.isArray(item.tags) && item.tags.length > 0 && (
          <footer className="actualite-tags">
            <strong>Mots-clés :</strong>{" "}
            {item.tags.map((t, i) => {
              const label = typeof t === "string" ? t : (t?.name || t?.title || "");
              return (
                <span key={label + i} className="tag">
                  {label}{i < item.tags.length - 1 ? ", " : ""}
                </span>
              );
            })}
          </footer>
        )}
      </article>

      <p className="back-link"><Link to="/actualites">← Toutes les actualités</Link></p>

      <style>{`
        .breadcrumb { margin: .75rem 0; color: #666; font-size: .95rem; }
        .actualite-title { margin: .25rem 0 .25rem; font-size: clamp(1.5rem, 3.2vw, 2.25rem); line-height: 1.2; }
        .actualite-date { color: #666; display:block; margin-bottom: .75rem; }
        .actualite-cover { margin: 1rem 0; }
        .actualite-cover img { width: 100%; height: auto; border-radius: 10px; display:block; }
        .actualite-excerpt { font-size: 1.05rem; color: #333; margin: .5rem 0 1rem; }
        .actualite-content { color: #222; line-height: 1.7; }
        .actualite-content p { margin: .75rem 0; }
        .actualite-tags { margin-top: 1.25rem; color: #555; }
        .tag { display: inline-block; background:#f2f2f2; border:1px solid #eaeaea; padding: .1rem .4rem; border-radius: 4px; margin-right: .25rem; }
        .back-link { margin-top: 1.5rem; }
        /* skeletons */
        .lfl-skeleton { background: #f3f3f3; border-radius: 8px; }
        .lfl-skeleton--title { height: 28px; width: 60%; margin: 1rem 0; }
        .lfl-skeleton--block { height: 180px; width: 100%; }
        .container.actualite-detail { max-width: 1000px; margin-inline: auto; padding-inline: 1rem; }
        .actualite-header { margin-top: .25rem; }
      `}</style>
    </main>
  );
}

function formatDate(iso) {
  try {
    if (!iso) return "";
    const d = new Date(iso);
    return d.toLocaleDateString("fr-FR", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return "";
  }
}
