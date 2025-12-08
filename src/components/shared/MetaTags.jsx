// src/components/shared/MetaTags.jsx
import { Helmet } from 'react-helmet-async';

const MetaTags = ({ 
  title = 'HomeHero - Local Household Service Finder',
  description = 'Find trusted local service providers for your home. Book electricians, plumbers, cleaners and more.',
  image = '/og-image.jpg'
}) => {
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
    </Helmet>
  );
};

export default MetaTags;