Adicionar o vídeo enviado `Video_HeadLine.mp4` aos assets do projeto e substituir o vídeo atual (`next-level.mp4`) usado na landing page.

1. Upload e criação do ponteiro de asset
   - Verificar se o CLI `lovable-assets` está disponível.
   - Fazer upload do arquivo `user-uploads://Video_HeadLine.mp4`.
   - Criar o ponteiro em `src/assets/Video_HeadLine.mp4.asset.json` com a URL CDN gerada.

2. Atualização do vídeo na landing page
   - Abrir `src/routes/index.tsx`.
   - Localizar o import e o uso do asset atual (`next-level.mp4.asset.json`).
   - Substituir pelo novo asset (`Video_HeadLine.mp4.asset.json`), mantendo os mesmos atributos do elemento `<video>` (autoplay, muted, loop, poster, etc.).

3. Limpeza
   - Remover o ponteiro antigo `src/assets/next-level.mp4.asset.json`, já que não será mais usado.

4. Validação
   - Executar `bun run build` para garantir que os imports e referências estão corretos.
   - Verificar visualmente no preview se o novo vídeo está carregando e sendo reproduzido no hero.