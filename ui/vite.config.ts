import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
    resolve: {
        alias: {
            // vue: '@vue/compat',
            '@': path.resolve(__dirname, './src'),
        }
    },
    plugins: [
        vue({
            template: {
                compilerOptions: {
                    compatConfig: {
                        MODE: 2
                    }
                }
            }
        }),
    ],

    server: {
        port: 8081,
        proxy: {
            "^/api": {
                target: "http://localhost:3000"
            },
        }
    },
})
