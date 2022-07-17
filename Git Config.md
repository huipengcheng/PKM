---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-17 14-48
updated: 2022-07-17 23-39
---

# [[Git Config]]

---

## Basics
Git global config file is `~/.gitconfig`

```shell
git config -l
git config --global
git config unset
```


## Credential Helper 
For using [[Use Pass to Manage Passwords|pass]] to manage git credentials, we need to install the [pass-git-helper](https://github.com/languitar/pass-git-helper). Afterwards, we should need `credential.helper` to `!pass-git-helper $@` in git config, which can instruct git to use the helper.

Then, we can create the file `~/.config/pass-git-helper/git-pass-mapping.ini` to config pass-git-helper. For example:
```ini
[github.com*]
target=dev/github
```
can mapping the host to the password stored in pass.

For a path mapping, we need to set `credential.useHttpPath` to true in the git config. Then we can write the following mapping pattern:
```ini
[github.com/username/project*]
target=dev/github
```

The pass-git-helper has a lot of features, please refer to the website.

- [ ] For now, pass-git-helper seems like can only fill password for me. If I set username in the password file, `git push` will show error message that indicate and prevent me use a username and password way to login, but I use the username and token actually.

> [!note]
> Install `pinentry` to enable pass-git-helper in GUI app. Refer to [pass-git-helper](https://github.com/languitar/pass-git-helper#preconditions).
> 


---

- Topics: 
	- [[Git]]
- Reference:
	- [pass-git-helper](https://github.com/languitar/pass-git-helper)
- Related:
	- [[Use Pass to Manage Passwords]]
