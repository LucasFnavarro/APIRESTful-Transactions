import { app } from "./app";
import { env } from "./env";


app
  .listen({
    port: env.PORT,
  })
  .then(() => {
    console.log(`🚀🏆 Server is running on http://localhost:${env.PORT} 🚀🏆`);
  });

// Tipos de Testes

// Unitários - unidade da sua aplicação (pequenas funções) Testes Isolados
// Integração - Comunicação entre duas ou mais unidades
// 2end2 - Ponta a Ponta - simula um usuário operando na nossa aplicação.

// 2end2
// front-end: abre a página de login, digite o texto lucas@gmail.com no campo com Id email, clique no botão
// back-end: chamadas HTTP e WebSockets

// Pirâmide de testes: E2E (não dependem de nenhuma tecnologia, não dependem de arquitetura).
  