/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://kimshotel.net',
  generateRobotsTxt: true,
  sitemapSize: 7000,
  changefreq: 'weekly',
  priority: 0.7,
  exclude: [
    '/dashboard/*',
    '/dashboard/hotes/*',
  ],
  robotsTxtOptions: {
    policies: [
      { userAgent: '*', allow: '/' },
      { userAgent: 'Googlebot', disallow: '/dashboard' },
    ],
  },
  transform: async (config, url) => {
    return {
      loc: url,
      changefreq: 'weekly',
      priority: url === `${config.siteUrl}/` ? 1.0 : 0.7,
      lastmod: new Date().toISOString(),
    };
  },
  additionalPaths: async (config) => [
    await config.transform(config, '/'),
  ],
};
