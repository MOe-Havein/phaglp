# WSL2 and Ubuntu 24.04 Setup Script for Antigravity
# Run this script in PowerShell as Administrator

Write-Host "Starting WSL2 and Ubuntu 24.04 Setup..." -ForegroundColor Cyan

# 1. Enable Windows Features
Write-Host "Enabling Windows Subsystem for Linux and Virtual Machine Platform..." -ForegroundColor Yellow
dism.exe /online /enable-feature /featurename:Microsoft-Windows-Subsystem-Linux /all /norestart
dism.exe /online /enable-feature /featurename:VirtualMachinePlatform /all /norestart

# 2. Set WSL 2 as default
Write-Host "Setting WSL 2 as the default version..." -ForegroundColor Yellow
wsl --set-default-version 2

# 3. Install Ubuntu 24.04
Write-Host "Checking if Ubuntu-24.04 is already installed..." -ForegroundColor Yellow
$distros = wsl --list --quiet
if ($distros -match "Ubuntu-24.04") {
    Write-Host "Ubuntu-24.04 is already installed." -ForegroundColor Green
} else {
    Write-Host "Installing Ubuntu-24.04..." -ForegroundColor Yellow
    wsl --install -d Ubuntu-24.04
}

# 4. Create requested directory in WSL
Write-Host "Creating directory /home/moe/full-stack-phaglp-v2 in Ubuntu..." -ForegroundColor Yellow
wsl --distribution Ubuntu-24.04 -- bash -c "mkdir -p /home/moe/full-stack-phaglp-v2 && chown -R $USER:$USER /home/moe/full-stack-phaglp-v2"

# 5. Extension Fix Information
Write-Host "`n--- IMPORTANT ---" -ForegroundColor Red
Write-Host "To fix the 'WSL' extension error in Antigravity:" -ForegroundColor White
Write-Host "1. Close Antigravity." -ForegroundColor White
Write-Host "2. Launch it from PowerShell using this command:" -ForegroundColor White
Write-Host "   antigravity --enable-proposed-api jeanp413.open-remote-wsl" -ForegroundColor Green
Write-Host "-----------------`n" -ForegroundColor Red

Write-Host "Setup script finished. Please restart your computer if you enabled new Windows Features." -ForegroundColor Cyan
