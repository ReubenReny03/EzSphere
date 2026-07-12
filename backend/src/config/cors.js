import { env } from './env.js';

const explicitOrigins = env.CLIENT_ORIGIN.split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

// Since auth now travels as a Bearer token (not a cookie), CORS just needs to let the
// browser through — no `credentials` needed. Allow localhost, private LAN ranges, and
// Tailscale (100.64.0.0/10 CGNAT range + MagicDNS `*.ts.net` names) so the app works
// whether it's opened via `localhost` or a machine's Tailscale address.
const devOriginPattern =
  /^https?:\/\/(localhost|127\.0\.0\.1|10(?:\.\d{1,3}){3}|192\.168(?:\.\d{1,3}){2}|172\.(?:1[6-9]|2\d|3[01])(?:\.\d{1,3}){2}|100\.(?:6[4-9]|[7-9]\d|1[01]\d|12[0-7])(?:\.\d{1,3}){2}|[\w-]+\.[\w-]+\.ts\.net)(?::\d+)?$/;

export const corsOptions = {
  origin(origin, callback) {
    if (!origin) return callback(null, true); // curl/health checks/mobile apps (no Origin header)
    if (explicitOrigins.includes(origin) || devOriginPattern.test(origin)) {
      return callback(null, true);
    }
    return callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: false,
};
