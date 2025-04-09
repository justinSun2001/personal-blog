/// <reference types="vite/client" />
declare module 'vuex' {
  export * from 'vuex/types/index.d.ts';
  export * from 'vuex/types/helpers.d.ts';
  export * from 'vuex/types/logger.d.ts';
  export * from 'vuex/types/vue.d.ts';
}

declare module 'markdown-it' {
  import MarkdownIt from 'markdown-it/lib';
  export default MarkdownIt;
}
declare module 'node-forge' {
  import forge from 'node-forge';
  export default forge;
}
declare module 'markdown-it-anchor' {
  import markdownItAnchor from 'markdown-it-anchor/lib';
  export default markdownItAnchor;
}
