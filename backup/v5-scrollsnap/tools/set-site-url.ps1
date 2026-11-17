param(
  [Parameter(Mandatory = $true)]
  [string]$Url
)

# 把 index.html 里所有 __SITE_URL__ 替换成实际部署网址
# 用法（在项目根目录）：
#   powershell -ExecutionPolicy Bypass -File tools/set-site-url.ps1 https://xxx.netlify.app

$root = Split-Path -Parent $PSScriptRoot
$index = Join-Path $root "index.html"

if (-not (Test-Path $index)) {
  Write-Host "找不到 index.html：$index" -ForegroundColor Red
  exit 1
}

$u = $Url.Trim()
if ($u -notmatch '^https?://') { $u = 'https://' + $u }
$u = $u.TrimEnd('/')

$html = Get-Content $index -Raw -Encoding UTF8
$count = ([regex]::Matches($html, '__SITE_URL__')).Count
if ($count -eq 0) {
  Write-Host "没有找到 __SITE_URL__ 占位符（可能已经替换过），请检查 index.html。" -ForegroundColor Yellow
  exit 0
}

$html = $html.Replace('__SITE_URL__', $u)
Set-Content -Path $index -Value $html -Encoding UTF8

Write-Host "完成：$count 处 OG / canonical 地址已替换为 $u" -ForegroundColor Green
Write-Host "建议用 https://www.opengraph.xyz/ 或微信/QQ 实际分享一次检查卡片。"
