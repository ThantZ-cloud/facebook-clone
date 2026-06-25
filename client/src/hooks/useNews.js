import { useState, useEffect } from 'react';
import api from '../services/api';

/**
 * Custom hook for fetching news.
 * Fetches from our backend proxy (which caches for 10 minutes).
 * Returns: news array, loading state, error
 */
const useNews = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    try {
      setLoading(true);
      const response = await api.get('/news');
      setNews(response.data.data);
      setError(null);
    } catch (err) {
      console.error('Fetch news error:', err);
      setError('Failed to load news');
    } finally {
      setLoading(false);
    }
  };

  return { news, loading, error, refetch: fetchNews };
};

export default useNews;
