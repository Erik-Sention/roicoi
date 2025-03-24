# How to Push to the Repository

This guide explains how to push your changes to the roicoi repository.

## Prerequisites

1. Git installed on your computer
2. Access to the repository (https://github.com/Erik-Sention/roicoi)
3. Your GitHub credentials

## Steps to Push Changes

### 1. Clone the Repository (First Time Only)

```bash
git clone https://github.com/Erik-Sention/roicoi.git
cd roicoi
```

### 2. Make Your Changes

Make your changes to the code as needed.

### 3. Stage Your Changes

```bash
# Add all changed files
git add .

# Or add specific files
git add filename.ts
```

### 4. Commit Your Changes

```bash
git commit -m "Your commit message describing the changes"
```

### 5. Push to GitHub

```bash
git push origin main
```

## Troubleshooting

### If you get authentication errors:

1. Use HTTPS with your username:
```bash
git remote set-url origin https://Erik-Sention@github.com/Erik-Sention/roicoi.git
```

2. Or use SSH (if you have SSH keys set up):
```bash
git remote set-url origin git@github.com:Erik-Sention/roicoi.git
```

### If you get merge conflicts:

1. Pull the latest changes first:
```bash
git pull origin main
```

2. Resolve any conflicts in the files
3. Add and commit the resolved files
4. Push again:
```bash
git push origin main
```

### If you need to force push (use with caution):

```bash
git push -f origin main
```

### PowerShell-Specific Instructions

When using PowerShell, you have two options for commit messages:

1. Use short, simple commit messages with `-m`:
```powershell
git commit -m "fix: short message"
```

2. For longer commit messages, omit `-m` to open the default editor:
```powershell
git commit
```
This will open your default editor where you can write detailed commit messages without PowerShell console limitations.

## Best Practices

1. Always pull before making changes
2. Write clear commit messages
3. Test your changes locally before pushing
4. Keep commits focused and atomic
5. Don't force push unless absolutely necessary

## Need Help?

If you encounter any issues:
1. Check the error message carefully
2. Make sure you have the correct permissions
3. Verify your Git configuration
4. Contact the repository owner if needed 