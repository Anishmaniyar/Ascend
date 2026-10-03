// Centralized environment config.
// Nothing outside this file should read process.env for Google settings.
//
// Flow: process.env -> config (here) -> google.service -> auth layers

export const env = {
  nodeEnv: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  google: {
    // OAuth client credentials (NOT "API keys").
    // clientSecret must stay server-side, never expose to the frontend.
    clientId: process.env.GOOGLE_CLIENT_ID || "",
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    callbackUrl:
      process.env.GOOGLE_CALLBACK_URL ||
      "http://localhost:5000/api/v1/auth/google/callback",
  },
  jwt: {
    accessSecret: process.env.JWT_ACCESS_SECRET || "",
    refreshSecret: process.env.JWT_REFRESH_SECRET || "",
    accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN || "15m",
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || "7d",
  },
  // Where the Google callback redirects after issuing the session.
  // No tokens are ever placed in this URL.
  frontendUrl: (process.env.FRONTEND_URL || "http://localhost:3000").replace(
    /\/$/,
    "",
  ),
};

export const isGoogleConfigured = () => {
  return Boolean(env.google.clientId && env.google.clientSecret);
};
