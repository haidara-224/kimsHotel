// app/sitemap.xml/route.ts

export async function GET() {
    const urls = [
      {
        loc: "https://kimshotel.com",
        lastmod: new Date().toISOString(),
        changefreq: "yearly",
        priority: 1.0,
      },
      {
        loc: "https://kimshotel.com/favorites",
        lastmod: new Date().toISOString(),
        changefreq: "monthly",
        priority: 0.8,
      },
    
    ];
  
    const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
      ${urls
        .map(
          ({ loc, lastmod, changefreq, priority }) => `
        <url>
          <loc>${loc}</loc>
          <lastmod>${lastmod}</lastmod>
          <changefreq>${changefreq}</changefreq>
          <priority>${priority}</priority>
        </url>`
        )
        .join("")}
    </urlset>`;
  
    return new Response(xml, {
      headers: {
        "Content-Type": "application/xml",
      },
    });
  }
  