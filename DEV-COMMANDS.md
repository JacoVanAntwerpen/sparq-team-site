# Creates ../<repo>-<timestamp>.zip from HEAD (no untracked files)
$repo = Split-Path -Leaf (Get-Location)
$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
$zipName = "$repo-$timestamp.zip"
$dest = Join-Path (Split-Path (Get-Location)) $zipName
git archive --format=zip --output="$dest" HEAD
Write-Output "Created: $dest"

# Sync local with online repo
git fetch origin
git pull --ff-only origin main

# Rebase local commits on top of remote 
git fetch origin
git rebase origin/main

# Stage, Commit, Push (Send changes to online repo, all changes new/modified/deleted)
git add -A
git commit -m "Concise, meaningful message"
git push origin main

# Stage, Commit, Push (Send changes to online repo, only additions and modifications not deletions)
git add .
git commit -m "Concise, meaningful message"
git push origin main

# See recent commits
git log --oneline -n 10

# Reset to previous commit state
     # Copy hash (number code) of commit
git checkout main
git reset --hard <commit-hash>
git push --force origin main