import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'), // File đầu vào
      name: 'CartLib',
      fileName: (format) => `cart-lib.${format}.js` // Tên file đầu ra
    },
    rollupOptions: {
      // Đảm bảo không đóng gói React vào thư viện (dùng React của dự án chính)
      external: ['react', 'react-dom', 'styled-components', '@apollo/client', 'graphql'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled',
          '@apollo/client': 'ApolloClient',
          'graphql': 'GraphQL'
        }
      }
    }
  }
});