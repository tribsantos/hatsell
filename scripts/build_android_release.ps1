$ErrorActionPreference = "Stop"

$root = Split-Path -Parent $PSScriptRoot
$androidDir = Join-Path $root "android"
$gradlew = Join-Path $androidDir "gradlew.bat"

if (-not (Test-Path $gradlew)) {
  throw "Missing Gradle wrapper: $gradlew"
}

Push-Location $root
try {
  Write-Host "[1/3] Building web assets (Vite)..."
  cmd /c "npm run build"
  if ($LASTEXITCODE -ne 0) {
    throw "Web build failed (exit code $LASTEXITCODE)."
  }

  Write-Host "[2/3] Syncing Capacitor Android project..."
  cmd /c "npx cap sync android"
  if ($LASTEXITCODE -ne 0) {
    throw "Capacitor sync failed (exit code $LASTEXITCODE)."
  }

  Write-Host "[3/3] Building signed release bundle (.aab)..."
  Push-Location $androidDir
  try {
    cmd /c "gradlew.bat bundleRelease"
    if ($LASTEXITCODE -ne 0) {
      throw "Gradle bundleRelease failed (exit code $LASTEXITCODE)."
    }
  } finally {
    Pop-Location
  }

  $bundleRoot = Join-Path $androidDir "app\build\outputs\bundle"
  $aabFiles = @()
  if (Test-Path $bundleRoot) {
    $aabFiles = Get-ChildItem -Path $bundleRoot -Recurse -Filter *.aab
  }

  if ($aabFiles.Count -gt 0) {
    Write-Host "Done. Found AAB file(s):"
    $aabFiles | ForEach-Object { Write-Host " - $($_.FullName)" }
  } else {
    throw "Build finished but no .aab file was found under: $bundleRoot"
  }
} finally {
  Pop-Location
}
