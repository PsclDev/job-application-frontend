import path from 'path';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Pages from 'vite-plugin-pages';
import Layouts from 'vite-plugin-vue-layouts';
import Components from 'unplugin-vue-components/vite';
import eslint from 'vite-plugin-eslint';

// https://vitejs.dev/config/
export default defineConfig({
  define: {
    __VUE_I18N_FULL_INSTALL__: true,
    __VUE_I18N_LEGACY_API__: false,
    __INTLIFY_PROD_DEVTOOLS__: false,
  },
  plugins: [
    eslint({
      include: './src',
      emitWarning: false,
      emitError: false,
    }),
    vue(),
    Components({
      dts: true,
    }),
    Pages({
      pagesDir: [
        {
          dir: 'src/pages',
          baseRoute: '',
        },
        {
          dir: 'src/modules/**/**/pages',
          baseRoute: '',
        },
      ],
    }),
    Layouts({
      layoutsDirs: 'src/layouts',
      defaultLayout: 'defaultLayout',
      exclude: [],
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      '@global': path.resolve(__dirname, 'src/components/common'),
      '@module': path.resolve(__dirname, 'src/modules'),
      '@shared': path.resolve(__dirname, 'shared/types'),
    },
  },
  optimizeDeps: {
    include: [
      'date-fns/locale/en-US',
    ],
  },
  build: {
    sourcemap: false,
  },
});
