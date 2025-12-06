import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.js'),
      name: 'CartLib',
      formats: ['es', 'umd'],
      fileName: (format) => `cart-lib.${format === 'es' ? 'es' : 'umd'}.js`
    },
    rollupOptions: {
      // External dependencies
      external: [
        'react',
        'react-dom',
        'styled-components',
      ],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'styled-components': 'styled',
        },
        // Ensure es modules are properly exported
        exports: 'named',
      },
      // Optimize bundle
      treeshake: true,
    },
    // Minify CSS and JS
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true,
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
});