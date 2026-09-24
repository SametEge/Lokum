# This Source Code Form is subject to the terms of the Mozilla Public
# License, v. 2.0. If a copy of the MPL was not distributed with this
# file, You can obtain one at http://mozilla.org/MPL/2.0/.
#
# Installs Lokum silently, checks the installation, runs Lokum's built-in
# self-test (LOKUM_SELFTEST) headless, and uninstalls again.
# usage: pwsh tests/smoke/windows.ps1 -Setup dist\Lokum-Setup-x.y.z-x64.exe

param(
  [Parameter(Mandatory = $true)][string]$Setup
)

$ErrorActionPreference = "Stop"
$failures = New-Object System.Collections.Generic.List[string]
function Check($name, $ok, $detail = "") {
  if ($ok) { Write-Host "  ✓ $name" -ForegroundColor Green }
  else { Write-Host "  ✗ $name $detail" -ForegroundColor Red; $failures.Add("$name $detail") }
}

$installDir = Join-Path $env:LOCALAPPDATA "Programs\Lokum"
$temp = if ($env:RUNNER_TEMP) { $env:RUNNER_TEMP } else { $env:TEMP }

Write-Host "🍬 Installing $Setup"
$p = Start-Process -FilePath $Setup -ArgumentList "/S" -PassThru -Wait
Check "installer exit code" ($p.ExitCode -eq 0) "($($p.ExitCode))"
Check "lokum.exe installed" (Test-Path "$installDir\lokum.exe")
Check "uninstaller written" (Test-Path "$installDir\uninstall.exe")
Check "Lokum layer present" (Test-Path "$installDir\browser\lokum\chrome.manifest")
Check "autoconfig present" (Test-Path "$installDir\lokum.cfg")
Check "policies present" (Test-Path "$installDir\distribution\policies.json")
Check "Firefox updater removed" (-not (Test-Path "$installDir\updater.exe"))
$choices = Get-Content "$installDir\distribution\lokum-install.json" -Raw -ErrorAction SilentlyContinue | ConvertFrom-Json
Check "installer choices written" ($null -ne $choices)
Check "uBlock Origin chosen by default" ($choices -and $choices.ublock -eq $true) "($($choices.ublock))"
Check "firefox.exe renamed" (-not (Test-Path "$installDir\firefox.exe"))

$ver = (Get-Item "$installDir\lokum.exe").VersionInfo
Check "exe product name is Lokum" ($ver.ProductName -eq "Lokum") "($($ver.ProductName))"
Check "exe description is Lokum" ($ver.FileDescription -eq "Lokum") "($($ver.FileDescription))"

$reg = Get-ItemProperty "HKCU:\Software\Lokum" -ErrorAction SilentlyContinue
Check "install registry key" ($reg -and $reg.InstallDir -eq $installDir) "($($reg.InstallDir))"
$uninst = Get-ItemProperty "HKCU:\Software\Microsoft\Windows\CurrentVersion\Uninstall\Lokum" -ErrorAction SilentlyContinue
Check "Apps & features entry" ($uninst -and $uninst.DisplayName -eq "Lokum")
$cap = Get-ItemProperty "HKCU:\Software\RegisteredApplications" -ErrorAction SilentlyContinue
Check "registered as browser" ($cap -and $cap.Lokum)
$cmd = (Get-ItemProperty "Registry::HKEY_CURRENT_USER\Software\Classes\LokumURL\shell\open\command").'(default)'
Check "URL handler command" ($cmd -like "*lokum.exe*-osint*") "($cmd)"
$taskbar = Get-ItemProperty "HKCU:\Software\Mozilla\Firefox\TaskBarIDs" -ErrorAction SilentlyContinue
Check "taskbar AUMID registered" ($taskbar -and $taskbar.$installDir -eq "Lokum.Browser")

$lnk = Join-Path $env:APPDATA "Microsoft\Windows\Start Menu\Programs\Lokum.lnk"
Check "start menu shortcut" (Test-Path $lnk)
try {
  $shell = New-Object -ComObject Shell.Application
  $item = $shell.Namespace((Split-Path $lnk)).ParseName("Lokum.lnk")
  $aumid = $item.ExtendedProperty("System.AppUserModel.ID")
  Check "shortcut AUMID" ($aumid -eq "Lokum.Browser") "($aumid)"
} catch {
  Check "shortcut AUMID" $false "($_)"
}

Write-Host "🍬 Running the Lokum self-test (headless)"
$profile = Join-Path $temp "lokum-smoke-profile"
New-Item -ItemType Directory -Force -Path $profile | Out-Null
$report = Join-Path $temp "lokum-selftest.json"
Remove-Item $report -ErrorAction SilentlyContinue
$env:LOKUM_SELFTEST = $report
$env:MOZ_CRASHREPORTER_DISABLE = "1"
$browser = Start-Process -FilePath "$installDir\lokum.exe" -ArgumentList @("--headless", "--no-remote", "--wait-for-browser", "--profile", "`"$profile`"") -PassThru
if (-not $browser.WaitForExit(240000)) {
  Stop-Process -Id $browser.Id -Force -ErrorAction SilentlyContinue
  Check "self-test finished in time" $false
}
Remove-Item Env:\LOKUM_SELFTEST
if (Test-Path $report) {
  $json = Get-Content $report -Raw | ConvertFrom-Json
  foreach ($r in $json.results) { Check "self-test: $($r.name)" $r.ok $r.detail }
  Write-Host "  Firefox $($json.firefox), locale $($json.locale), Lokum $($json.lokum.version)"
} else {
  Check "self-test report written" $false
}

Write-Host "🍬 Uninstalling"
$u = Start-Process -FilePath "$installDir\uninstall.exe" -ArgumentList @("/S", "_?=$installDir") -PassThru -Wait
Check "uninstaller exit code" ($u.ExitCode -eq 0) "($($u.ExitCode))"
Remove-Item "$installDir\uninstall.exe" -ErrorAction SilentlyContinue
Check "files removed" (-not (Test-Path "$installDir\lokum.exe"))
Check "registry cleaned" (-not (Test-Path "HKCU:\Software\Clients\StartMenuInternet\Lokum"))
Check "shortcut removed" (-not (Test-Path $lnk))

if ($failures.Count -gt 0) {
  Write-Host "`n$($failures.Count) check(s) failed:" -ForegroundColor Red
  $failures | ForEach-Object { Write-Host "  - $_" }
  exit 1
}
Write-Host "`nAll Windows smoke checks passed 🍬" -ForegroundColor Green
