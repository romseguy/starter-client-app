const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "OPTIONS, POST",
  "Access-Control-Allow-Headers": "Content-Type, Authorization"
};

const server = Bun.serve({
  port: 3001,
  async fetch(req) {
    let res;

    // Handle CORS preflight requests
    if (req.method === "OPTIONS") {
      res = new Response("Departed", {
        headers: { ...req.headers, ...CORS_HEADERS }
      });
      return res;
    }

    const path = new URL(req.url).pathname;
    console.log("🚀 ~ fetch ~ path:", path);

    // respond with text/html
    if (path === "/") {
      res = new Response("Welcome to Bun!");
      res.headers.set("Content-Type", "text/html");
    }
    // redirect
    else if (path === "/abc") res = Response.redirect("/source", 301);
    // send back a file (in this case, *this* file)
    else if (path === "/source") res = new Response(Bun.file(import.meta.path));
    // respond with JSON
    else if (path === "/api") {
      res = Response.json({ some: "buns", for: "you" });
      res.headers.set("Content-Type", "application/json");
    }
    // receive JSON data to a POST request
    else if (req.method === "POST" && path === "/api/post") {
      const data = await req.json();
      console.log("Received JSON:", data);
      res = Response.json({ success: true, data });
    }

    // receive POST data from a form
    else if (req.method === "POST" && path === "/form") {
      const data = await req.formData();
      console.log(data.get("someField"));
      res = new Response("Success");
    } else {
      // 404s
      res = new Response("Page not found", { status: 404 });
    }

    res.headers.set("Access-Control-Allow-Origin", "*");
    res.headers.set(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );

    return res;
  }
});

console.log(`Listening on ${server.url}`);
