import React, { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchActualiteBySlug } from "../../api/articles";
import { absoluteMediaUrl } from "../../utils/strapiUrl";
import "../../styles/articles.css";
import { getBestImageUrl } from "../../utils/images";

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

  // Déduire la meilleure image (src + srcSet) depuis cover/image (Cloudinary ou Strapi local)
  const coverMedia = useMemo(() => {
    if (!item) return { src: null, srcSet: null };

    // 1) media brut depuis l'item (priorité cover, fallback image)
    const media = item.cover || item.image || null;

    // 2) Essayez d'abord l'utilitaire commun
    const bestFromUtil = getBestImageUrl(media);
    if (bestFromUtil) {
      return { src: bestFromUtil, srcSet: null };
    }

    // 3) Récupération de l'objet "attributes" possible (Strapi v4/v5)
    const m =
      (media && media.attributes) ? media.attributes :
      (media && media.data && media.data.attributes) ? media.data.attributes :
      media;

    // 4) Construire src + srcSet à partir des formats (Cloudinary fournit URLs absolues)
    const urlLarge   = m?.formats?.large?.url   || null;
    const urlMedium  = m?.formats?.medium?.url  || null;
    const urlSmall   = m?.formats?.small?.url   || null;
    const urlDefault = m?.url || null;

    // Normaliser en URLs absolues (ne préfixe pas si déjà http)
    const toAbs = (u) => {
      if (!u) return null;
      return /^https?:\/\//i.test(u) ? u : absoluteMediaUrl(u);
    };

    const src = toAbs(urlLarge || urlMedium || urlSmall || urlDefault) || "/images/news-placeholder.jpg";

    // srcSet (si formats dispo) — utile pour netteté et perf
    const srcSetParts = [];
    if (urlSmall)  srcSetParts.push(`${toAbs(urlSmall)} 500w`);
    if (urlMedium) srcSetParts.push(`${toAbs(urlMedium)} 750w`);
    if (urlLarge)  srcSetParts.push(`${toAbs(urlLarge)} 1000w`);
    const srcSet = srcSetParts.length ? srcSetParts.join(", ") : null;

    return { src, srcSet };
  }, [item]);

  if (loading) {
    return (
      <>
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
              <Link to="/actualites" style={{ color: "#fff" }}>Actualités</Link>
            </nav>
            <h1 className="section-title" style={{ color: "#fff", marginTop: "0.5rem" }}>Actualités</h1>
            <p className="subtitle" style={{ color: "#fff", maxWidth: 900 }}>
              Nos chantiers, conseils, nouveautés produits et infos locales autour du poêle et du chauffage.
            </p>
          </div>
        </header>
        <main className="container page--article">
          <div className="lfl-skeleton lfl-skeleton--title" />
          <div className="lfl-skeleton lfl-skeleton--block" />
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
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
              <Link to="/actualites" style={{ color: "#fff" }}>Actualités</Link>
            </nav>
            <h1 className="section-title" style={{ color: "#fff", marginTop: "0.5rem" }}>Actualités</h1>
            <p className="subtitle" style={{ color: "#fff", maxWidth: 900 }}>
              Nos chantiers, conseils, nouveautés produits et infos locales autour du poêle et du chauffage.
            </p>
          </div>
        </header>
        <main className="container page--article">
          <h1>Actualité</h1>
          <p role="alert">Une erreur est survenue : {error.message}</p>
          <p><Link to="/actualites">← Retour aux actualités</Link></p>
        </main>
      </>
    );
  }

  if (!item) {
    return (
      <>
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
              <Link to="/actualites" style={{ color: "#fff" }}>Actualités</Link>
            </nav>
            <h1 className="section-title" style={{ color: "#fff", marginTop: "0.5rem" }}>Actualités</h1>
            <p className="subtitle" style={{ color: "#fff", maxWidth: 900 }}>
              Nos chantiers, conseils, nouveautés produits et infos locales autour du poêle et du chauffage.
            </p>
          </div>
        </header>
        <main className="container page--article">
          <h1>Actualité introuvable</h1>
          <p><Link to="/actualites">← Retour aux actualités</Link></p>
        </main>
      </>
    );
  }

  const published = formatDate(item.publishedAt || item.date || item.createdAt);

  return (
    <>
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
            <Link to="/actualites" style={{ color: "#fff" }}>Actualités</Link>
          </nav>
          <h1 className="section-title" style={{ color: "#fff", marginTop: "0.5rem" }}>Actualités</h1>
          <p className="subtitle" style={{ color: "#fff", maxWidth: 900 }}>
            Nos chantiers, conseils, nouveautés produits et infos locales autour du poêle et du chauffage.
          </p>
        </div>
      </header>
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
              <time dateTime={item.publishedAt || item.date || item.createdAt || ""} className="actualite-date">
                {published}
              </time>
            )}
            {coverMedia?.src && (
              <figure className="actualite-cover">
                <img
                  src={coverMedia.src}
                  srcSet={coverMedia.srcSet || undefined}
                  sizes="(max-width: 768px) 100vw, 900px"
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
    </>
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
