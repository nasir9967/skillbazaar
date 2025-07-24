@echo off
echo Cleaning Next.js cache...
cd /d "d:\nextjs\localskill"
if exist .next (
    rmdir /s /q .next
    echo ✅ Cache cleared successfully!
) else (
    echo ℹ️ No cache folder found
)
pause
