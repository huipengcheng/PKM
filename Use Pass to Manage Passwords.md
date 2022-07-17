---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-17 13-57
updated: 2022-07-17 16-29
---

# [[Use Pass to Manage Passwords]]

---

For all my password, I use [pass](https://www.passwordstore.org) to manage.

To use pass, we need to generate a GPG key, and copy its key-id fill command `pass init key-id`. Pass will create a folder called `.password-store` which located in the home directory, and stores all the password we insert, remove or change in that folder.

To insert a new password, for example, we can run `pass insert Email/xxx.com` and follow the instruction to input the password for xxx.com. Pass will store the password in `~/.password-store/Email/xxx.com.gpg`. Pass can store other information together with a password, just append the `--multiline` or `-m` behind `insert` option. The general format this is like:

```
Yw|ZSNH!}z"6{ym9pI
url/login: *.amazon.com/*
username: AmazonianChicken@example.com
Phone Support PIN #: 84719
```

We can run `pass` to list all the existing passwords in the store, and run `pass pass-name` to show passwords.

Pass support remove, edit existing passwords too.

Pass also support git, just run `pass git init`, then pass will generate a git repository in the store and automatically commits to git per operation.

Pass has a lot of compatible clients, the ones I installed are:
- [passforious](https://mssun.github.io/passforios/): iOS app
- [passff](https://github.com/passff/passff#readme): Firefox extension, needed install a host application called passff-host additionally.
- [pass-git-helper](https://github.com/languitar/pass-git-helper): A git credential helper, see [[Git Config#Credential Helper]]
- [ ] use passmenu in dmenu

As well as extensions:
- [pass-import](https://github.com/roddhjav/pass-import)


---

- Topics: 
	- 
- Reference:
	- [pass](https://www.passwordstore.org
	- [GnuPG](https://wiki.archlinux.org/title/GnuPG#Backup_your_private_key)
- Related:
	- 
