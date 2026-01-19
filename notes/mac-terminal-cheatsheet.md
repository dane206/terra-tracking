## One-page terminal cheatsheet (macOS / zsh) — inline comments

### Navigate

```bash
pwd                            # print current directory
ls                             # list files
ls -la                          # list w/ details + hidden
cd /path/to/dir                # change directory
cd ..                          # up one level
cd ~                           # home directory
open .                         # open current folder in Finder
```

### Directories

```bash
mkdir dir                      # create directory
mkdir -p a/b/c                 # create nested directories
rmdir emptydir                 # remove empty directory
rm -r dir                      # remove directory + contents
rm -rf dir                     # force remove (no prompts)
```

### Files

```bash
touch file.txt                 # create if missing; update timestamp if exists
cp a.txt b.txt                 # copy file
cp -r dirA dirB                # copy directory recursively
rm file.txt                    # delete file
rm -i file.txt                 # delete file w/ confirmation
cat file.txt                   # print file contents
less file.txt                  # view file (scroll; q quits)
head -n 20 file.txt            # first 20 lines
tail -n 50 file.txt            # last 50 lines
tail -f app.log                # follow log output
```

### Redirect output (overwrite vs append)

```bash
echo "one" >  a.txt            # a.txt becomes: one
echo "two" >  a.txt            # a.txt becomes: two (one is gone)

echo "one" >  a.txt            # a.txt becomes: one
echo "two" >> a.txt            # a.txt becomes: one\n two (appended)
```

### Move / Rename (same command)

```bash
mv old.txt new.txt             # rename file
mv file.txt /dest/             # move file
mv olddir newdir               # rename folder
mv dir /dest/                  # move folder
mv dir /dest/newdir            # move + rename
```

### Find

```bash
find . -name "*.md"            # find files by name (case-sensitive)
find . -iname "*readme*"       # find files by name (case-insensitive)
grep -R "term" .               # search text recursively
grep -RIn "term" .             # search recursively w/ line numbers
```

### Permissions

```bash
chmod +x script.sh             # make file executable
```

---

## Git (everyday) — inline comments

### New repo + first commit

```bash
mkdir proj && cd proj          # create project folder + enter it
git init                       # initialize git repo
git add .                      # stage everything
git commit -m "init"           # first commit
```

### Connect remote + push

```bash
git branch -M main             # rename current branch to main
git remote add origin git@github.com:USER/REPO.git   # add remote
git push -u origin main        # push + set upstream
```

### Daily flow

```bash
git status                     # what changed
git pull                       # get latest from remote
git add -A                     # stage all changes (adds/deletes/mods)
git commit -m "msg"            # commit staged changes
git push                       # push commits
```

### Branches

```bash
git branch                     # list branches
git switch -c feature-x        # create + switch to new branch
git switch main                # switch back to main
```

### Rename / move tracked paths (preferred)

```bash
git mv old new                 # rename/move with git tracking
git commit -m "chore: rename"  # commit rename/move
```

### Remove tracked paths

```bash
git rm file.txt                # remove tracked file
git rm -r dir                  # remove tracked directory
git commit -m "chore: remove"  # commit removal
```

### Undo / cleanup

```bash
git restore --staged path      # unstage (keep local changes)
git restore path               # discard local changes to file
git reset --hard               # discard ALL local changes (dangerous)
git clean -fdn                 # show untracked files that would be deleted
git clean -fd                  # delete untracked files/dirs (dangerous)
git commit --amend             # edit last commit (message and/or staged changes)
```
