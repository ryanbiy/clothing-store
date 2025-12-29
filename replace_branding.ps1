Get-ChildItem -Path "c:\Users\ryanb\OneDrive\Documents\GitHub\clothing-store\unrendered2004" -Recurse -File -Include *.html,*.css,*.js,*.json | ForEach-Object {
    $content = Get-Content $_.FullName -Raw
    $newContent = $content -replace "994\.world", "unrendered2004" -replace "994 STORE", "UNRENDERED2004" -replace "994", "unrendered2004"
    if ($content -ne $newContent) {
        Set-Content -Path $_.FullName -Value $newContent -NoNewline
        Write-Host "Updated: $($_.FullName)"
    }
}
