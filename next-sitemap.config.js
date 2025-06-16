/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://kimshotel.net',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/dashboard/*',
    '/dashboard/hotes/*', // ← corrigé ici
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'Googlebot', disallow: '/dashboard' },
    ],
  },
  transform: async (config, url) => {
    // Force l’ajout de "/" si jamais il est ignoré
    return {
      loc: url,
      changefreq: 'weekly',
      priority: url === `${config.siteUrl}/` ? 1.0 : 0.7, // Home avec priorité haute
      lastmod: new Date().toISOString(),
    };
  },
};
