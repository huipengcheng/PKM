---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-15 21-30
updated: 2022-07-15 22-45
---

# [[Linux can't boot in after enter the password in display manager]]

---

Today, I installed and enabled [[UFW]] in my EOS. After a while, I need to reboot my system for some reasons. But I can not boot in after enter the password in display manager, the screen just stayed black.

I toke a very long time to figure it out. At first, I thought it was an issue of the [[display managers]]. Fortunately, the display manager I use, called ly, provides the option to log into the shell. I logged into the shell and I found I can start [[X11]] by executing `startx`.

When I boot in the system, I immediately run `systemctl set-default multi-users.target` to disable the display manager. Then I successfully reboot my system!

At that time, I thought it must be the problem of display managers.

However, I found my Wi-Fi is connected but could not establish any network connection. The UFW comes to my mind. Hence, I run `ufw status` and found UFW is inactive. And I run `systemctl status ufw` and found its status is `active (exited)`.

So I guess, it could not be the problem of the display managers, but the problem of the UFW which may block connection of the X11 server and client?

That's just my guess. But after I disable `ufw.service`, I tried to reboot with a display manager enabled, the system can finally boot in normally!

- [x] So, what cause this happen actually?

---

After several hours' digging, I finally figure it out! The real culprit is not all the supposition mentioned above, but the conflict between `iptabales.service` and all other iptables-based services, such as UFW and `firewalld` (which is installed in Endeavour OS by default):
- If `firewalld.service` is disabled while `iptables.service` and `ufw.service` is enabled, I can boot in my system but `ufw.service`'s status is `active (exited)` which means I should enable `ufw` manually.
- If `iptables.service` is disabled while `firewalld.service` and `ufw.service` is enabled, I can **NOT** boot into my system at all.

---

- Topics: [[Linux]] [[Solution]] [[UFW]] [[iptables]]
	- 
- Reference:
	- 
- Related:
	- 
