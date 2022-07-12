---
tags: 📝️/🌱️
publish: true
aliases: 
created: 2022-07-05 22-48
updated: 2022-07-12 18-02
---

# [[Linux Setup]]

---

## Software

### Obsidian
Installed through `flatpak`.


### WeChat
I install WeChat on [[Arch]] and the procedure is listed below:
1. Add `archlinuxcn` to `pacman.conf`
2. Install `wine-wechat-setup` using pacman. This package adds some support to Chinese characters in case of malfunctional redenring of Chinese characters. 
3. The step 2 will additionally install `wine-gecko` which will produce a noticeable black shade around WeChat when it's installed. So, install `wine-for-wechat` to supersede `wine-gecko`.   
4. Download WeChat Windows installer from its official site.
5. Use command `wine` to install WeChat.
6. `wine-wechat-setup` will also install a CLI tool named `wechat` which can open and set config of WeChat.

### Kmonad
For now, I use [KMonad](https://github.com/kmonad/kmonad), which is cross-platform, to manage and customize my keyboard.

I grab the [kmonad.service](https://github.com/kmonad/kmonad/blob/master/startup/run) file and follow [systemd](https://wiki.archlinux.org/title/Systemd#Basic_systemctl_usage) to move this file to `/etc/systemd/system/` and execute `systemd enable kmonad.service` to start KMonad after system boot.

### Rofi
A window switcher, application launcher, ssh dialog, dmenu replacement and more.

### xbindkeys
A tool to set keybindings.
I install `xbindkeys_config-gtk2`, a GUI tool for xbindkeys, using pacman.


### FSearch
Just like *Everything* in Windows.

### Solaar
A third-party Logitech device driver in linux, which installed by pacman and called `solaar-git`.

### Screenshot
I install two screenshot program: gscrenshot, which is a mini CLI program, and flameshot, which has a GUI and a lot of functions.

gscreenshot support *copy-to-clipboard* function, and this function can be enabled when `xclip` is installed.win

### GoldenDict++
GoldenDict is a very famous dictionary app, but it is not support OCR. [GoldenDict++](https://autoptr.top/gdocr/GoldenDict-OCR-Deployment/) is a GoldenDict with an additional OCR functionality.

The built-in screen grabber in GoldenDict can not be properly used in Arch, so I install gscreenshot, which is introduced in [[#Screenshot]], and use gscreenshot to grab my screen.

The dictionary file is placed at `~/dict`.


## System-Wide
### HiDPI
In GNOME or KDE, we can use the system setting tool to adjust monitors' resolution, and the tool also provides a setting to scale displays, which can achieve HiDPI. 

But in other window environment, we don't have such a tool to set HiDPI. I found [this page](https://wiki.archlinux.org/title/HiDPI#Firefox) which illustrate how to set HiDPI using the **X Resources**.

### Enable 10-Bit Color

Follow this [instruction](https://wiki.archlinux.org/title/AMDGPU#10-bit_color).

If the monitor itself has already enabled 10-bit but not enabled 10-bit in system, it seems to cause some weird things, such as the improper rendering of scrolling in [[Awesome WM]].


### Chinese Input Method

I follow this [instruction](https://wiki.archlinux.org/title/Fcitx5_(%E7%AE%80%E4%BD%93%E4%B8%AD%E6%96%87)#%E5%BC%80%E6%9C%BA%E5%90%AF%E5%8A%A8) to install `fcitx5-im` and `fcitx5-chinese-addons`. Then set some environmental variables to `/etc/environment` and make `fcitx5` auto start in [[Awesome WM]].

Then, I install some themes, which stored in `~/.local/share/fcitx5/themes`, and can enable a theme through the config GUI or config file. 


### Hi-res Scrolling
Scrolling in Linux is less smoother than Mac, so I did some Google and find [this page](https://rhtenhove.nl/blog/hires-scrolling-logitech/), which introduce a approach to achieve more smoother scrolling, called Hi-res scrolling, for Logitech mouse by [[#Solaar]].

Although Solaar is support my mouse (Lift), but there is currently no *Scroll Wheel Resolution* setting in Solaar for my mouse.

And then, I dig a little further through these pages: [1](arch high resolution scroll), [2](https://www.phoronix.com/scan.php?page=news_item&px=High-Res-Scrolling-Sep-2021), [3](https://flaviutamas.com/2020/understanding-linux-mouse-drivers), [4](https://who-t.blogspot.com/2021/08/libinput-and-high-resolution-wheel.html). Unfortunately, I still can not figure it out.


### Desktop Entries
Follow [this instruction](https://wiki.archlinux.org/title/Desktop_entries).

The example I made for [[#GoldenDict++]]. I set the `Exec` to `./goldendict.sh` before and this is wrong, the correct one is written below.

```shell
[Desktop Entry]
Type=Application
Name=GoldenDict++
Path=/home/chp/opt/GoldenDict++
Exec=zsh goldendict.sh
Icon=splash
Terminal=false
Categories=Education;Languages;
```
---

By now, [[#GoldenDict]] can be launched in GNOME application menu and by command `gtk-launch`, but in [[Awesome WM]], it can only be launched by command `gtk-launch`.

I install several packages, which are introduced in the instruction link, for operate desktop entries:
- `alacarte`: graphical editor
- `lsdesktopf`: list available `.desktop` files
- `fbrokendesktop`: detects broken `Exec` value in `.desktop` files


## Gaming
[A brief guide](https://forum.endeavouros.com/t/linux-gaming-guide/7339#heading--linux-gaming-requirements)

### Fall Guys
I've tried several methods which are all failed, including [this](https://www.reddit.com/r/SteamDeck/comments/vht8d1/fall_guys_f2p_epic_version_tutorial_for_steam_deck/) and using lutris, except [this one](https://www.reddit.com/r/linux_gaming/comments/von8xa/how_to_play_fall_guys_on_epic_games_on_linux_with/).



---
- Topics: [[Linux]]
	- 
- Reference:
	- 
- Related:
	- 
