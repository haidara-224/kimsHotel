/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: 'https://kimshotel.net', // Replace with your actual domain
    generateRobotsTxt: true, // (optional)
    sitemapSize: 7000, // (optional)
    changefreq: 'weekly',
    priority: 0.7,
    exclude: [
         '/dashboard/*','/dasboard/hotes/*', 
    ],
    robotsTxtOptions: {
        policies: [
            { userAgent: '*', allow: '/' },
             { userAgent: 'Googlebot', disallow: '/dashboard' },
        ],
    },
};