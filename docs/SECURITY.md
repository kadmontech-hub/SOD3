# Security notes

The server sets CSP, frame, MIME, referrer and permissions headers; sanitizes user strings; limits request body size; uses UUIDs; and applies basic in-memory rate limits. Production requires TLS, secure server sessions, CSRF controls for credentialed mutations, a database with ownership checks, durable distributed rate limiting, backups, audit logs and protected admin roles.
