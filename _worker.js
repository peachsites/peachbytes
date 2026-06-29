export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 1. API Endpoint
    if (url.pathname === '/weather') {
      try {
        const weatherData = await env.WEATHER_KV.get("marietta_weather");
        return new Response(weatherData, {
          headers: { 
            "content-type": "application/json;charset=UTF-8",
            "Access-Control-Allow-Origin": "*" 
          },
        });
      } catch (e) {
        return new Response("Error fetching KV data", { status: 500 });
      }
    }

    // 2. Serve static files with explicit HTML handling
    const response = await env.ASSETS.fetch(request);
    
    // If it's an HTML file, ensure the browser knows it
    if (url.pathname === '/' || url.pathname.endsWith('.html')) {
      const newResponse = new Response(response.body, response);
      newResponse.headers.set("Content-Type", "text/html;charset=UTF-8");
      return newResponse;
    }

    return response;
  },
};