/** @type {import('next').NextConfig} */
const nextConfig = {
    api: {
      bodyParser: {
        sizeLimit: '10mb' // ou 20mb se quiser
      }
    }
  }
  
  export default nextConfig;
  