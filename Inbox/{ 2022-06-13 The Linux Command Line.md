---
tags: 📥️/📚️/🟧️️
aliases:
type: book
status: 🟧️️
created: 2022-06-13 22-35
updated: 2022-06-23 21-35
---

# Title: [[{ 2022-06-13 The Linux Command Line]]

## Metadata
- `Topics:` [[Linux]]
- `Title:` [[{ 2022-06-13 The Linux Command Line]]
- `Type:` [[{]]
- `Publish Date:` 
- `Reviewed Date:` [[2022-06-13]]

# What is the shell
- The command line is referring to the *shell* which is a program that takes keyboard commands and passes them to the OS to carry out.
- A *Terminal Emulator* is a program used to interact with the shell when you in a graphical user interface.
- Use the mouse to highlight some text in the terminal emulator can copy the text into a buffer maintained by X (X Window System, the underlying engine that makes the GUI go).
- Some simple commands:
	- `date`: displays the current time and date
	- `cal`: displays a calendar of the current month
	- `df`: displays the current amount of free space on disk drivers
	- `free`: displays the amount of free memory
- Entering the `exit` command or pressing **Ctrl-d** to end a terminal session.

# Exploring the system
- The command `ls`
	- can accept multiple arguments, such as `ls ~ /usr`.
	- some options:
		- `-a`(`--all`): list all files including hidden files
		- `-A`(`--almost-all`): like the `-a` option but except it does not list `.` and `...`.
		- `-d`(`--directory`): list the directory itself (usually used with `-l` option)
		- `-F`(`--classify`): append an indicator character to the end of each listed name (such as a forward slash(/) if the name is a directory)
		- `-h`(`--human-readable`)
		- `-l`: display results in long format
		- `-r`(`--reverse`)
		- `-S`: sort results by file size
		- `-t`: sort results by modification time
- The command `file` is used to determine a file's type.
- The command `less` is used to view a file's content, it is a improved replacement of `more`.
	- PageUp/b
	- PageDown/space
	- G, 1G/g, /, n, h, q

# Manipulating files and directories
- Wildcards (globbing)
	- *
	- ?
	- \[characters]: matches any character that is a member of the set *characters*
	- \[!characters]: matches any character that is not a member of the set *characters*
	- \[\[:class:]]: matches any character that is a member of the specified *class*
		- \[:alnum:]: alphanumeric character
		- \[:alpha:]: alphabetic character
		- \[:digit:]: numeral
		- \[:lower:]: lowercase letter
		- \[:upper:]: uppercase letter
	- Examples: \[!\[:digit:]]\*, \*\[\[:lower:]123]
	- Should avoid using character ranges like \[A-Z] or \[a-z], and use the above character classes instead.
	- Some graphical file managers can also use the wildcards like Nautilus (GNOME).
- `mkdir directory ...`
- `cp`, copies take on the default attributes of the user performing the copy
	- `cp item1 item2`: copy the single file or directory **item1** to the file or directory **item2**
	- `cp item ... directory`: copy multiple file or directory into a directory
	- useful options:
		- `-a` (`--archive`): copy with all attributes
		- `-i` (`--interactive`): prompt for confirmation before overwriting an existing file
		- `-r` (`--recursive`)
		- `-u` (`--update`): When copying files from one directory to another, only copy files that either don't exist or are newer than the existing corresponding files, in the destination directory.
		- `-v` (`--verbose`)
		```ad-note
	  `cp -r dir1 dir2`
	  Copy the contents of directory dir1 to directory dir2. If directory dir2 does not exist, it is created and, after the copy, will contain the same contents as directory dir1.
		If directory dir2 does exist, then directory dir1 (and its contents) will be copied into dir2.
		```
- `mv`, it is used in much the same way as `cp`
	- useful options:
		- `-i` (`--interactive`)
		- `-u` (`--update`)
		- `-v` (`--verbose`)
- `rm`
	- useful options:
		- `-i` (`--interactive`): prompt for confirmation before deleting an existing file
		- `-r` (`--recursive`)
		- `-f` (`--force`): Ignore nonexistent files and do not prompt, and override `-i` option
		- `-v` (`--verbose`)
	```ad-note
	Use `ls` to test `rm` before executing.
	```
- `ln`
	- Hard link
		- By default, every file has a single hard link that gives the file its name. 
		- When we create a hard link, we create an additional directory entry for a file.
		- Two limitations:
			- A hard link cannot reference a file that is not on the same disk partition as the link itself.
			- A hard link may not reference a directory.
		- When a hard link is deleted, the link is removed but the contents of the file itself continue to exist until all links to the file are deleted.
	- Symbolic link (symlink or soft link)

# Working with commands
- A Command can be:
	- An executable program (a compiled binary or script)
	- A shell builtin
	- A shell function (a miniature shell script)
	- An alias
- `type`: display a command's type
- `which`: display an executable's location
- `help`: get help for shell builtins
- `--help`: display usage information
- `man`: display a program's manual page
- `apropos`: search the list of man pages for possible matches based on a search term (as same as `man -k`)
- `whatis`: display one-line manual page descriptions
- `info`: The GNU Project provides an alternative to man pages for their programs, called “info.”

# Redirection
- Programs send their results to a special file called *standard output* (*stdout*) and their status messages to another file called *standard error* (*stderr*). By default, both stdout and stderr are linked to the screen and not saved into a disk file.
- Programs take input from a facility called *standard input* (stdin), which is, by default, attached to the keyboard.
- I/O redirection allows us to change where output goes and where input comes from.
- `>` - redirect output (overwrite), `>>` - redirect output (append)
  ```ad-note
  Trick: To truncate a file or create a new, empty file, we can use:
  ```shell
  $ > somefile
  ```
- `2>` - redirect error (overwrite). The first number stands for *file descriptor*, and the shell references stdin, stdout, stderr internally as 0, 1 and 2, respectively.
- Redirect stdout and stderr to one file:
	- `some_input > some_file 2>&1` or `some_input 2> some_file >$2` (Notice that the order of the redirections is significant.)
	- `&>`
- Dispose unwanted output by redirecting the output to `/dev/null`
- `cat` - concatenate files
	- If we pass no argument to `cat`, `cat` copies stdin to stdout (we can also use redirection operators to redirect stdout to a file). We can press Ctrl-d to tell `cat` that it has reached EOF of stdin.
- The Difference Between `>` and `|`: `>` connects a command with a file, while the `|` connects the output of one command with the input of a second command.
- `sort`
- `uniq`: Report or omit repeated lines
- `wc`: Print line, word, and byte counts
- `grep`
	- `-i`: Ignore case
	- `-v`: Reverse match pattern
- `head` and `tail`
	- `-n`: print only first few lines or last few lines
	- `tail -f`: `tail` can continues to monitor the file
- `tee`: read from stdin and output to **both** stdout and one or more  files

