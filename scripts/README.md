# Scripts de Desarrollo

Este directorio contiene scripts útiles para el desarrollo del sistema ERP.

## Scripts de PowerShell

### `dev.ps1` - Iniciar ambos servidores

```powershell
.\scripts\dev.ps1
```

### `setup.ps1` - Configuración inicial completa

```powershell
.\scripts\setup.ps1
```

### `docker.ps1` - Gestión de Docker

```powershell
# Iniciar base de datos
.\scripts\docker.ps1 up

# Detener base de datos
.\scripts\docker.ps1 down
```

### `build.ps1` - Construir aplicaciones

```powershell
.\scripts\build.ps1
```

## Scripts de Bash (Linux/Mac)

Los mismos scripts están disponibles con extensión `.sh` para sistemas Unix.
