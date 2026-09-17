param(
    [string]$MotionLibraryPath = ""
)

$ErrorActionPreference = "Stop"

function Get-ToolCheck {
    param(
        [string]$Name,
        [string[]]$Candidates,
        [bool]$Required
    )

    foreach ($candidate in $Candidates) {
        $commandInfo = Get-Command $candidate -ErrorAction SilentlyContinue
        if ($null -ne $commandInfo) {
            return [ordered]@{
                name = $Name
                required = $Required
                found = $true
                command = $commandInfo.Source
            }
        }
    }

    return [ordered]@{
        name = $Name
        required = $Required
        found = $false
        command = $null
    }
}

$toolChecks = @(
    Get-ToolCheck -Name "node" -Candidates @("node") -Required $true
    Get-ToolCheck -Name "npm" -Candidates @("npm.cmd", "npm") -Required $true
    Get-ToolCheck -Name "ffmpeg" -Candidates @("ffmpeg") -Required $true
    Get-ToolCheck -Name "ffprobe" -Candidates @("ffprobe") -Required $true
    Get-ToolCheck -Name "python" -Candidates @("py", "python") -Required $false
)

$libraryCandidates = @()
if (-not [string]::IsNullOrWhiteSpace($MotionLibraryPath)) {
    $libraryCandidates += $MotionLibraryPath
}
if (-not [string]::IsNullOrWhiteSpace($env:LL_VIDEO_MOTION_LIBRARY)) {
    $libraryCandidates += $env:LL_VIDEO_MOTION_LIBRARY
}
$repoLibrary = [System.IO.Path]::GetFullPath((Join-Path $PSScriptRoot "..\..\..\motion-library"))
$libraryCandidates += $repoLibrary

$resolvedLibrary = $null
foreach ($candidatePath in $libraryCandidates | Select-Object -Unique) {
    $manifestPath = Join-Path $candidatePath "library.json"
    if (Test-Path -LiteralPath $manifestPath -PathType Leaf) {
        $resolvedLibrary = [System.IO.Path]::GetFullPath($candidatePath)
        break
    }
}

$missingRequired = @($toolChecks | Where-Object { $_.required -and -not $_.found } | ForEach-Object { $_.name })
$result = [ordered]@{
    readyForRendering = ($missingRequired.Count -eq 0 -and $null -ne $resolvedLibrary)
    tools = $toolChecks
    missingRequiredTools = $missingRequired
    motionLibrary = [ordered]@{
        found = ($null -ne $resolvedLibrary)
        path = $resolvedLibrary
        searched = @($libraryCandidates | Select-Object -Unique)
    }
}

$result | ConvertTo-Json -Depth 6

