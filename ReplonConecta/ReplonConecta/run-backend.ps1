# Arranca el backend contra el proyecto Supabase de Repelón Market.
#
# Este proyecto usa "JWT signing keys" (ECC P-256), no el secreto HS256,
# así que NO hace falta SUPABASE_JWT_SECRET: el backend valida las firmas
# contra el JWKS público en {SUPABASE_URL}/auth/v1/.well-known/jwks.json.

$env:DB_URL = "jdbc:postgresql://aws-0-us-west-2.pooler.supabase.com:5432/postgres?sslmode=require"
$env:DB_USER = "postgres.jqupskbumucpveifswuv"
$env:DB_PASSWORD = "hpk8urr5kl13rz4y"

$env:SUPABASE_URL = "https://jqupskbumucpveifswuv.supabase.co"
$env:SUPABASE_JWT_ISSUER = "https://jqupskbumucpveifswuv.supabase.co/auth/v1"
$env:SUPABASE_STORAGE_BUCKET = "productos"

$env:CORS_ORIGINS = "http://localhost:3000"
$env:SEED = "true"

mvn -B spring-boot:run
