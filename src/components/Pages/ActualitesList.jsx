

import React, { useEffect, useState } from 'react';
import { fetchActualites } from '../../api/articles';
import { absoluteMediaUrl } from '../../utils/strapiUrl';

const ActualitesList = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const { items } = await fetchActualites({ page: 1, pageSize: 12 });
        if (mounted) {
          setItems(items || []);
          setLoading(false);
        }
      } catch (e) {
        console.error(e);
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  if (loading) {
    return (
      <div className="actualites-list">
        <div className="loader">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="actualites-list">
      {items.map((actu) => {
        const date = actu.publishedAt
          ? new Date(actu.publishedAt).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })
          : '';
        const coverUrl = actu.cover?.formats?.medium?.url || actu.cover?.url || '';
        return (
          <div className="actualite-item" key={actu.id}>
            {coverUrl && (
              <div className="actualite-cover">
                <img src={absoluteMediaUrl(coverUrl)} alt={actu.title} />
              </div>
            )}
            <h2 className="actualite-title">{actu.title}</h2>
            {date && <div className="actualite-date">{date}</div>}
            {actu.excerpt && (
              <div className="actualite-description">{actu.excerpt}</div>
            )}
            <a href={`/actualites/${actu.slug}`} className="actualite-link">Lire plus</a>
          </div>
        );
      })}
    </div>
  );
};

export default ActualitesList;