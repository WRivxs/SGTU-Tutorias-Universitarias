Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "Iniciando SGTU Backend - Entorno Local" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan

# Variables de Base de Datos (AWS RDS)
$env:DB_HOST="parcial1electiva.cd40okomwyz0.us-east-2.rds.amazonaws.com"
$env:DB_PORT="3306"
$env:DB_NAME="tutorias_db"
$env:DB_USERNAME="ingeniero"
$env:DB_PASSWORD="aposentoalto22"

# Variables del Servidor y Seguridad JWT
$env:SERVER_PORT="8080"
$env:JWT_SECRET="SGTUTutoriasUniversitariasSecretKey2026SecureHashKeyMustBeLongEnoughForHS256Algorithm"
$env:JWT_EXPIRATION="86400000"

Write-Host "Variables configuradas. Ejecutando Maven..." -ForegroundColor Yellow
mvn spring-boot:run
