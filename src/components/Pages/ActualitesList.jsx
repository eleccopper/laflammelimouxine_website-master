

import React, { useEffect, useState } from 'react';
import { fetchActualites } from '../../api/actualitesApi';

const ActualitesList = () => {
  const [actualites, setActualites] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchActualites().then(data => {
      if (mounted) {
        setActualites(data);
        setLoading(false);
      }
    });
    return () => { mounted = false; };
  }, []);

  if (loading || !actualites) {
    return (
      <div className="actualites-list">
        <div className="loader">Chargement...</div>
      </div>
    );
  }

  return (
    <div className="actualites-list">
      {actualites.map((actu) => (
        <div className="actualite-item" key={actu.id}>
          <h2 className="actualite-title">{actu.titre}</h2>
          <div className="actualite-date">
            {new Date(actu.date).toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </div>
          <div className="actualite-description">{actu.descriptionCourte}</div>
          <a href={`/actualites/${actu.id}`} className="actualite-link">Lire plus</a>
        </div>
      ))}
    </div>
  );
};

export default ActualitesList;