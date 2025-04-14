import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images:{
    remotePatterns:[
      {
        protocol: 'https',
        hostname: 'a0.muscache.com',
        port: '',
        pathname: '/**',
      }
    ],
    domains: ['unxovct6jcrhoof5.public.blob.vercel-storage.com',"img.clerk.com",'images.unsplash.com', 'encrypted-tbn0.gstatic.com'],
  
  },
  experimental: {
    authInterrupts: true,
    
    //ppr: true

  },
};

export default nextConfig;
