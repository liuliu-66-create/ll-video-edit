param(
    [Parameter(Mandatory = $true)]
    [string]$ProjectPath,

    [Parameter(Mandatory = $true)]
    [ValidateSet("16:9", "9:16")]
    [string]$AspectRatio
)

$ErrorActionPreference = "Stop"
$resolvedProjectPath = [System.IO.Path]::GetFullPath($ProjectPath)

if (Test-Path -LiteralPath $resolvedProjectPath -PathType Leaf) {
    throw "ProjectPath points to a file: $resolvedProjectPath"
}

$directories = @(
    "input",
    "audio",
    "storyboard",
    "assets\recordings",
    "assets\screenshots",
    "assets\logos",
    "assets\illustrations",
    "design",
    "sample",
    "remotion",
    "output",
    "logs"
)

New-Item -ItemType Directory -Path $resolvedProjectPath -Force | Out-Null
foreach ($relativeDirectory in $directories) {
    New-Item -ItemType Directory -Path (Join-Path $resolvedProjectPath $relativeDirectory) -Force | Out-Null
}

$statusPath = Join-Path $resolvedProjectPath "project-status.json"
$statusAlreadyExisted = Test-Path -LiteralPath $statusPath
if (-not $statusAlreadyExisted) {
    $status = [ordered]@{
        schemaVersion = 1
        aspectRatio = $AspectRatio
        currentStep = 1
        state = "in_progress"
        confirmed = [ordered]@{
            step1_audio = $false
            step2_storyboard = $false
            step3_assets = $false
            step4_static = $false
            step5_sample = $false
            step6_final = $false
        }
        artifacts = [ordered]@{}
    }
    $status | ConvertTo-Json -Depth 6 | Set-Content -LiteralPath $statusPath -Encoding UTF8
}

[ordered]@{
    projectPath = $resolvedProjectPath
    statusPath = $statusPath
    createdDirectories = $directories
    statusCreated = (-not $statusAlreadyExisted)
} | ConvertTo-Json -Depth 4

