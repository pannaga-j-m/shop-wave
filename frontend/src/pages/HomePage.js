import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Rating,
  Skeleton,
  Container,
  Paper
} from '@mui/material';

import {
  ShoppingCart,
  ArrowForward,
  LocalShipping,
  Security,
  Replay,
  Support
} from '@mui/icons-material';

import { productAPI } from '../utils/api';
import { useCartStore } from '../store';
import toast from 'react-hot-toast';

const CATEGORIES = [
  { name: 'Electronics', emoji: '💻', color: '#dbeafe', textColor: '#1e40af' },
  { name: 'Clothing', emoji: '👕', color: '#fce7f3', textColor: '#9d174d' },
  { name: 'Books', emoji: '📚', color: '#dcfce7', textColor: '#166534' },
  { name: 'Sports', emoji: '⚽', color: '#fef9c3', textColor: '#854d0e' },
  { name: 'Home', emoji: '🏠', color: '#ede9fe', textColor: '#5b21b6' },
  { name: 'Beauty', emoji: '💄', color: '#fee2e2', textColor: '#991b1b' },
];

const TRUST = [
  { icon: <LocalShipping />, title: 'Free Shipping', sub: 'Orders over $50' },
  { icon: <Security />, title: 'Secure Payment', sub: '256-bit SSL' },
  { icon: <Replay />, title: 'Easy Returns', sub: '30-day policy' },
  { icon: <Support />, title: '24/7 Support', sub: 'Always here' },
];

function ProductCard({ product }) {
  const nav = useNavigate();
  const add = useCartStore((s) => s.add);

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'transform .15s, box-shadow .15s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: '0 8px 24px rgba(0,0,0,.12)',
        },
      }}
      onClick={() => nav(`/products/${product.id}`)}
    >
      <Box
        sx={{
          height: 200,
          background: `hsl(${((product.id || 1) * 47) % 360},60%,93%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '3.5rem',
        }}
      >
        {product.image_emoji || '📦'}
      </Box>

      <CardContent sx={{ flex: 1, pb: 1 }}>
        <Chip
          label={product.category || 'General'}
          size="small"
          sx={{
            mb: 1,
            fontSize: '0.7rem',
            height: 22,
          }}
        />

        <Typography
          variant="subtitle2"
          fontWeight={600}
          gutterBottom
          sx={{ lineHeight: 1.4 }}
        >
          {product.name || 'Unnamed Product'}
        </Typography>

        <Rating
          value={product.rating || 4.3}
          precision={0.5}
          size="small"
          readOnly
          sx={{ mb: 0.5 }}
        />

        <Typography variant="h6" fontWeight={800}>
          ${parseFloat(product.price || 0).toFixed(2)}
        </Typography>
      </CardContent>

      <CardActions sx={{ px: 2, pb: 2 }}>
        <Button
          fullWidth
          variant="contained"
          size="small"
          startIcon={<ShoppingCart />}
          onClick={(e) => {
            e.stopPropagation();
            add(product);
            toast.success('Added to cart! 🛒');
          }}
          disabled={product.stock === 0}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </Button>
      </CardActions>
    </Card>
  );
}

function ProductSkeleton() {
  return (
    <Card>
      <Skeleton variant="rectangular" height={200} />

      <CardContent>
        <Skeleton width="40%" height={24} sx={{ mb: 1 }} />
        <Skeleton width="80%" height={20} sx={{ mb: 1 }} />
        <Skeleton width="60%" height={20} sx={{ mb: 1 }} />
        <Skeleton width="35%" height={28} />
      </CardContent>
    </Card>
  );
}

export default function HomePage() {
  const nav = useNavigate();

  const { data = [], isLoading } = useQuery({
    queryKey: ['featured'],

    queryFn: async () => {
      try {
        const response = await productAPI.list({ limit: 8 });

        console.log('API RESPONSE:', response.data);

        if (Array.isArray(response.data)) {
          return response.data;
        }

        if (Array.isArray(response.data?.products)) {
          return response.data.products;
        }

        return [];
      } catch (error) {
        console.error('Product fetch failed:', error);
        return [];
      }
    },
  });

  const safeProducts = Array.isArray(data) ? data : [];

  return (
    <Box>

      {/* Hero Section */}

      <Box
        sx={{
          background:
            'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
          color: 'white',
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">

          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              mb: 2,
              fontSize: { xs: '2.2rem', md: '3rem' },
            }}
          >
            Shop Smarter
          </Typography>

          <Typography
            variant="h6"
            sx={{
              opacity: 0.85,
              mb: 4,
            }}
          >
            Modern Microservices E-Commerce Platform
          </Typography>

          <Button
            variant="contained"
            size="large"
            endIcon={<ArrowForward />}
            onClick={() => nav('/products')}
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              fontWeight: 700,
            }}
          >
            Shop Now
          </Button>
        </Container>
      </Box>

      {/* Categories */}

      <Container maxWidth="lg" sx={{ py: 8 }}>

        <Typography
          variant="h4"
          fontWeight={700}
          textAlign="center"
          mb={4}
        >
          Shop by Category
        </Typography>

        <Grid container spacing={2}>

          {CATEGORIES.map((cat) => (

            <Grid item xs={6} sm={4} md={2} key={cat.name}>

              <Card
                component={Link}
                to={`/products?category=${cat.name.toLowerCase()}`}
                sx={{
                  textDecoration: 'none',
                  bgcolor: cat.color,
                  textAlign: 'center',
                  p: 2.5,
                  cursor: 'pointer',
                }}
              >
                <Typography fontSize="2rem">
                  {cat.emoji}
                </Typography>

                <Typography
                  fontWeight={600}
                  fontSize="0.85rem"
                  sx={{ color: cat.textColor }}
                >
                  {cat.name}
                </Typography>

              </Card>

            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Featured Products */}

      <Box sx={{ bgcolor: 'grey.50', py: 8 }}>

        <Container maxWidth="lg">

          <Typography variant="h4" fontWeight={700} mb={4}>
            Featured Products
          </Typography>

          <Grid container spacing={2.5}>

            {isLoading ? (

              [...Array(8)].map((_, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <ProductSkeleton />
                </Grid>
              ))

            ) : (

              safeProducts.slice(0, 8).map((p) => (

                <Grid item xs={12} sm={6} md={3} key={p.id}>
                  <ProductCard product={p} />
                </Grid>

              ))

            )}

          </Grid>

        </Container>

      </Box>

      {/* Trust Section */}

      <Container maxWidth="lg" sx={{ py: 6 }}>

        <Grid container spacing={2}>

          {TRUST.map(({ icon, title, sub }) => (

            <Grid item xs={6} md={3} key={title}>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 1.5,
                  p: 2,
                }}
              >
                <Box sx={{ color: 'primary.main' }}>
                  {icon}
                </Box>

                <Box>

                  <Typography fontWeight={600} fontSize="0.875rem">
                    {title}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    {sub}
                  </Typography>

                </Box>

              </Box>

            </Grid>

          ))}

        </Grid>

      </Container>

    </Box>
  );
}
