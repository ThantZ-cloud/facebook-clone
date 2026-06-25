import { Box, Typography, Avatar, CircularProgress } from '@mui/material';
import {
  Article as NewsIcon,
  OpenInNew as ExternalLinkIcon,
} from '@mui/icons-material';
import useNews from '../hooks/useNews';

// Truncate text to 3 sentences
const truncateToSentences = (text, maxSentences = 3) => {
  if (!text) return '';
  // Split by sentence endings
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text];
  const truncated = sentences.slice(0, maxSentences).join(' ').trim();
  // Add ellipsis if we cut it short
  return sentences.length > maxSentences ? truncated + '...' : truncated;
};

// Format time ago
const formatTimeAgo = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

const LeftSidebar = () => {
  const { news, loading, error } = useNews();

  // Handle clicking a news item — open original article in new tab
  const handleClick = (url) => {
    if (url) {
      window.open(url, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: 64,
        height: 'calc(100vh - 64px)',
        overflowY: 'auto',
        py: 2,
        '&::-webkit-scrollbar': { display: 'none' },
        scrollbarWidth: 'none',
      }}
    >
      {/* Header */}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, px: 2, mb: 1.5 }}>
        <NewsIcon sx={{ fontSize: 20, color: '#1877F2' }} />
        <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
          News
        </Typography>
      </Box>

      {/* Loading state */}
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress size={28} />
        </Box>
      )}

      {/* Error state */}
      {error && (
        <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            {error}
          </Typography>
        </Box>
      )}

      {/* News list */}
      {!loading && !error && news.length === 0 && (
        <Box sx={{ px: 2, py: 3, textAlign: 'center' }}>
          <NewsIcon sx={{ fontSize: 40, color: '#BCC0C4', mb: 1 }} />
          <Typography variant="body2" color="text.secondary">
            No news available
          </Typography>
          <Typography variant="caption" color="text.secondary">
            Add your GNews API key to see news here
          </Typography>
        </Box>
      )}

      {!loading && news.length > 0 && (
        <Box>
          {news.map((article, index) => (
            <Box
              key={index}
              onClick={() => handleClick(article.url)}
              sx={{
                display: 'flex',
                gap: 1.5,
                px: 2,
                py: 1.5,
                cursor: 'pointer',
                // Bottom border/underline between items
                borderBottom: '1px solid #E4E6EB',
                '&:hover': { bgcolor: '#F0F2F5' },
                '&:last-child': { borderBottom: 'none' },
              }}
            >
              {/* Thumbnail */}
              {article.image && (
                <Box
                  sx={{
                    width: 64,
                    height: 64,
                    borderRadius: 1.5,
                    overflow: 'hidden',
                    flexShrink: 0,
                  }}
                >
                  <img
                    src={article.image}
                    alt=""
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                    onError={(e) => { e.target.style.display = 'none'; }}
                  />
                </Box>
              )}

              {/* Text content */}
              <Box sx={{ flex: 1, minWidth: 0 }}>
                {/* Title */}
                <Typography
                  variant="subtitle2"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.82rem',
                    lineHeight: 1.3,
                    mb: 0.5,
                    // Limit to 2 lines
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {article.title}
                </Typography>

                {/* 3-sentence preview */}
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{
                    fontSize: '0.75rem',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}
                >
                  {truncateToSentences(article.description, 3)}
                </Typography>

                {/* Source + time */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#65676B' }}>
                    {article.source?.name || 'Unknown'}
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#BCC0C4' }}>
                    ·
                  </Typography>
                  <Typography variant="caption" sx={{ fontSize: '0.7rem', color: '#65676B' }}>
                    {formatTimeAgo(article.publishedAt)}
                  </Typography>
                </Box>
              </Box>
            </Box>
          ))}
        </Box>
      )}

      {/* Footer */}
      <Box sx={{ px: 3, mt: 2 }}>
        <Typography variant="caption" color="text.secondary">
          Privacy · Terms · Advertising · Cookies · More · Meta © 2024
        </Typography>
      </Box>
    </Box>
  );
};

export default LeftSidebar;
