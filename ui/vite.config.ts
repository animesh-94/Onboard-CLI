import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tsconfigPaths from 'vite-tsconfig-paths'
import mdx from '@mdx-js/rollup'
import remarkGfm from 'remark-gfm'
import remarkFrontmatter from 'remark-frontmatter'
import remarkMdxFrontmatter from 'remark-mdx-frontmatter'
import rehypePrettyCode from 'rehype-pretty-code'
import rehypeSlug from 'rehype-slug'

const prettyCodeOptions = {
  theme: 'dark-plus',
  keepBackground: false,
};

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    {
      enforce: 'pre',
      ...mdx({
        remarkPlugins: [remarkGfm, remarkFrontmatter, remarkMdxFrontmatter],
        rehypePlugins: [rehypeSlug, [rehypePrettyCode, prettyCodeOptions]],
      }),
    },
    react(),
    tsconfigPaths()
  ],
})
