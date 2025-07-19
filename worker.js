export default {
  async fetch(request, env) {
    try {
      return await env.ASSETS.fetch(request);
    } catch (e) {
      return new Response(`${e.message}\n${e.stack}`, { status: 500 });
    }
  },
}; 