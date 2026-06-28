$ErrorActionPreference = "Stop"

$Repo = "animesh-94/Onboard-CLI"
$BinName = "onboard.exe"
$InstallDir = "$env:USERPROFILE\AppData\Local\Microsoft\WindowsApps"

# Identify Architecture
$Arch = (Get-WmiObject -Class Win32_OperatingSystem).OSArchitecture
if ($Arch -match "64") {
    $GoArch = "amd64"
} else {
    Write-Error "Unsupported architecture: $Arch"
    exit 1
}

$ArtifactName = "onboard-windows-${GoArch}.exe"

Write-Host "Detecting latest release for ${Repo}..."
$ApiUrl = "https://api.github.com/repos/$Repo/releases/latest"

try {
    $Release = Invoke-RestMethod -Uri $ApiUrl -Headers @{ "User-Agent" = "Onboard-CLI-Installer" }
} catch {
    Write-Error "Failed to fetch latest release from GitHub API."
    exit 1
}

$Asset = $Release.assets | Where-Object { $_.name -eq $ArtifactName }

if (-not $Asset) {
    Write-Error "Could not find a binary for Windows ${GoArch} in the latest release."
    exit 1
}

$DownloadUrl = $Asset.browser_download_url
$DestPath = Join-Path -Path $InstallDir -ChildPath $BinName

# Ensure the destination directory exists (it usually does, but just in case)
if (-not (Test-Path $InstallDir)) {
    New-Item -ItemType Directory -Force -Path $InstallDir | Out-Null
}

Write-Host "Downloading $ArtifactName..."
try {
    Invoke-WebRequest -Uri $DownloadUrl -OutFile $DestPath
} catch {
    Write-Error "Failed to download the binary."
    exit 1
}

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host " Onboard-CLI installed successfully!    " -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "The executable has been placed in $InstallDir"
Write-Host "Next step: Open a new terminal and run 'onboard --help' to get started."
