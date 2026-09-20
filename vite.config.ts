import { defineConfig, loadEnv, type Plugin } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import createOrderHandler from "./api/create-order";
import checkoutIntentHandler from "./api/checkout-intent";
import verifyPaymentHandler from "./api/verify-payment";

function apiMiddlewarePlugin(env: Record<string, string>): Plugin {
  return {
    name: "api-middleware",
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url || !req.url.startsWith("/api/")) {
          return next();
        }

        // Populate process.env with freshly loaded environment variables
        const currentEnv = loadEnv(process.env.NODE_ENV || 'development', process.cwd(), '');
        Object.assign(process.env, currentEnv);

        const url = req.url.split("?")[0];
        let bodyBuffer = "";

        req.on("data", (chunk) => {
          bodyBuffer += chunk;
        });

        req.on("end", async () => {
          let parsedBody = {};
          try {
            if (bodyBuffer) parsedBody = JSON.parse(bodyBuffer);
          } catch (e) {
            // Ignore json parse error
          }

          const vercelReq = Object.assign(req, {
            body: parsedBody,
            query: {},
          });

          const vercelRes = Object.assign(res, {
            status(statusCode: number) {
              res.statusCode = statusCode;
              return vercelRes;
            },
            json(data: any) {
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify(data));
              return vercelRes;
            },
          });

          try {
            if (url === "/api/checkout-intent") {
              await checkoutIntentHandler(vercelReq as any, vercelRes as any);
            } else if (url === "/api/create-order") {
              await createOrderHandler(vercelReq as any, vercelRes as any);
            } else if (url === "/api/verify-payment") {
              await verifyPaymentHandler(vercelReq as any, vercelRes as any);
            } else {
              res.statusCode = 404;
              res.setHeader("Content-Type", "application/json");
              res.end(JSON.stringify({ error: "Endpoint not found" }));
            }
          } catch (err: any) {
            console.error("API middleware error:", err);
            res.statusCode = 500;
            res.setHeader("Content-Type", "application/json");
            res.end(JSON.stringify({ error: err.message || "Internal server error" }));
          }
        });
      });
    },
  };
}

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");

  return {
    server: {
      host: "::",
      port: 8080,
      hmr: {
        overlay: false,
      },
    },
    plugins: [react(), apiMiddlewarePlugin(env)].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
