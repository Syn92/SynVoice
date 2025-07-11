import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://synai.pro';
  const currentDate = new Date().toISOString();

  // Define the routes for each language
  const routes = [
    {
      url: `${baseUrl}/en`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          fr: `${baseUrl}/fr`,
        },
      },
    },
    {
      url: `${baseUrl}/en/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/contact`,
          fr: `${baseUrl}/fr/contact`,
        },
      },
    },
    {
      url: `${baseUrl}/en/booking`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/booking`,
          fr: `${baseUrl}/fr/booking`,
        },
      },
    },
    {
      url: `${baseUrl}/en/confirmation`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/en/confirmation`,
          fr: `${baseUrl}/fr/confirmation`,
        },
      },
    },
    {
      url: `${baseUrl}/fr`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 1.0,
      alternates: {
        languages: {
          en: `${baseUrl}/en`,
          fr: `${baseUrl}/fr`,
        },
      },
    },
    {
      url: `${baseUrl}/fr/contact`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/contact`,
          fr: `${baseUrl}/fr/contact`,
        },
      },
    },
    {
      url: `${baseUrl}/fr/booking`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.8,
      alternates: {
        languages: {
          en: `${baseUrl}/en/booking`,
          fr: `${baseUrl}/fr/booking`,
        },
      },
    },
    {
      url: `${baseUrl}/fr/confirmation`,
      lastModified: currentDate,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
      alternates: {
        languages: {
          en: `${baseUrl}/en/confirmation`,
          fr: `${baseUrl}/fr/confirmation`,
        },
      },
    },
  ];

  return routes;
} 