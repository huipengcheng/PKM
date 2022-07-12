---
tags: 📥️/📚️/🟥️
aliases:
type: book
status: 🟥️
created: 2022-05-05 16-07
updated: 2022-06-01 22-15
---

# Title: [[{ 2021 Vi iMprovied]]

## Metadata
- `Topics:` [[Vim]]
- `Title:` [[{ 2021 Vi iMprovied]]
- `Type:` [[{]]
- `Publish Date:` 
- `Reviewed Date:` [[2022-05-05]]

## Note

# Basic Editing

## Editing

### Inserting Text

i

a

o

O

### Deleting Characters

x

### Undo and Redo

u

U

CTRL-R

### Deleting a Line

dd

D

### Getting out

**ZZ** - saving and quit

ZQ - quit without saving

**:q** & **:q!**

## Help

![Screen Shot 2020-10-21 at 20.44.01](https://chp-image-hosting.oss-cn-hangzhou.aliyuncs.com/uPic/Screen%20Shot%202020-10-21%20at%2020.44.01.png)![Screen Shot 2020-10-21 at 20.44.11](https://chp-image-hosting.oss-cn-hangzhou.aliyuncs.com/uPic/Screen%20Shot%202020-10-21%20at%2020.44.11.png)![Screen Shot 2020-10-21 at 20.44.32](https://chp-image-hosting.oss-cn-hangzhou.aliyuncs.com/uPic/Screen%20Shot%202020-10-21%20at%2020.44.32.png)

## Using a Count

##

# Editing a Little Faster

## Move

[number] w, [number] b

[number] + $/<End>/<kEnd>

**^/<Home>/<kHome>** - moves to the first nonblank character of the line.

---

## Searching

**[number] fx** - forword searches the current line for the single character **x** .

> 5f<Space> .
> 
> **F** searches to the left.

**[number] tx** - (search ‘til) works like **fx**, except it stops one character before the indicated character. The backward version of this command is **Tx**.

---

## Line

**[number] G**

**CTRL-G**

**:set number** & **:set nonumber**

### Joining Lines

**J** joins the current line with the next one. A space is added to the end of the first line to separate.

[count] J.

---

## Scrolling

**CRTL-U** scrolls up half a screen of text, **CRTL-D** scrolls down half a screen.

---

## Deleting Text

-   **dd**
    
-   **dw** - deletes the word and the space following it, including the character under the cursor.
    
-   **db** - except the charater under the cursor.
    
-   **d0**
    
-   **d$** = **D**
    
-   **df**[x] - deletes up to the first [x] in this line
    

> 3dw: deleting one word three times
> 
> d3w: delteting three words once

## Changing Text

**c** - deletes and put into _Insert Mode_.

-   **cc** or **C** - changes the whole line.
    
-   cw, cb, c0, c$ = C
    

**c**motion works just like **d**motion, except **cw**. **cw** deletes word up to the sapce following it.

---

## The . Command

It repeats the last **delete** or **change** command. `count.`.

---

## Replacing Charaters

**r**[x] - replaces the charcter under the cursor with [x].

**[count]r**[x] - replaces the first [count] charcters from the cursor with [x].

> If the target character is <Enter>, only one <Enter> is inserted, no matter how big the count is.

---

## Changing Case

**[count]~** changes charaters from the cursor uppercase to lowercase and vice versa.

---

## Keyboard Macros

**q**character command records keystrokes into the register named character(a-z). To finish recording, type **q**.

To excute the marco by typing the **@**character command.

---

## Diagraphs

Likes typing **CTRL-K cO** get a © .

`:diagraphs`

---

# Searching

## Simple Search

**/string** to find the word "string".

> Putting a \ in front of ***[]ˆ%/\?~$** to use them.

Find the next match: **n** or **/<Enter>**, and both of them have a **count** specified.

Find the last match : **[count] N** or **[count] ?<Enter>.**

### Searching Backward

**?**string command searches backward.

### Changing Direction

Both typing **?** in the forward search or typing **/** in the backward search can reverse the search direction.

### Search History

Typing a **/**, and pree <Up> or <Down>.

---

## Searching Options

### Highlighting

Highlighting the matches.

`:set hlsearch` & `:set nohlsearch`

To clear the current highlighting: `:nohlsearch`

### Incremental Searches

Incremental search let the editor starts searching as soon as we type the first character. Each additional character further refines the search.

`:set incsearch` & `:set noincsearch`

---

## Basic Regular Expressions

_Regular expressions_ are used to specify a search pattern.

### The Beginning (^) and End ($) of a Line

The character **^** matches the beginning of a line, and the character **$** matches the end of a line.

The regular expression **^**string matches the "string" only if it is at the beginning of a line.

The regular expression string**$** matches the "string" only if it is at the end of a line.

### Match Any Single Character ( . )

The character **.** matches any single character.

The regular expression **a.c** matches a string whose first character is a, second character is anything and third character is c.

### Matching Special Characters(\)

Most symbols have a special meaning inside a regular expression. To match these special symbols, you need to precede them with a backslash (**\**).

###

# Text Blocks and Multiple Files

## Put

Anything deleting is saved. However, the **p** command can paste it back (The technical name is a _put_).

> -   If we delete a whole line, the **p** command will put the text on the line after the cursor.
>     
> -   If we delete some charaters, the **p** command will put the text after the cursor.
>     

### Character Twiddling

If there is a type "teh", and we want to correct it. Just moving the cursor to "e", and typing **xp**.

**x** - Deletes the character ‘e’ and places it in a register.

**p** - Puts the text after the cursor, which is on the ‘h’.

### More on Putting

**P** command places the text _before_ the cursor.

A **count** can be used with both **p** and **P**.

---

## Marks

The command **m**charcter(a-z) marks the place under the cursor as mark 'charachter'.

**`mark** moves cursor to the marked place.

**'mark** moves cursor to the beginning of the line containing the mark.

**d`mark** command deletes from the character under the cursor to the marked place.

**d'mark** command deletes between the current line and the line containing the mark.

> Marks can be useful when deleting a long series of lines.
> 
> 1.  Move the cursor to the beginning of the text you want to delete.
>     
> 2.  Mark it using the command **ma** .
>     
> 3.  Go to the end of the text to be removed. Delete to mark a using the command d’a .
>     

### Show All the Marks

`:marks`

Special marks:

-   ' The last place the cursor was at.
    
-   " Line 1.
    
-   [ The start of the last insert.
    
-   ] The end of the last inser.
    

To view specific marks: `:marks args` (args this marks).

---

## Yanking

The **y** command "yanks" text into a register. And the general form is **y**motion.

-   [count]yw, [count]yy = [count]Y
    
-   **y'**mark
    

---

## Filtering

![ScreenShot2020-10-21at20.39.06](https://chp-image-hosting.oss-cn-hangzhou.aliyuncs.com/uPic/Screen%20Shot%202020-10-21%20at%2020.39.06.png)

---

## Editing Another File

`:vi file` This command automatically closes the current fileand opens the new one.

`:vi! file` command forces _VIM_ to discard changes and edit the new file using the force(!) option.

> `:e` command and `:vi` areequivalent.

---

## The :view Command

The `:view file` command works just like the `:vi` command, except the new file is opened in **read-only** mode.

> If we attempt to change a **read-only** file, we receive a warning. We can still make the changes, but just can’t save them. When we attempt to save a changed read-only file, _Vim_ issues an error message and refuses to save the file. (You can force the write with the `:write!` command.)

---

## Dealing with Multiple Files

#### Next File

Inputting `$ gvim one.c two.c three.c` in command line to open multiple files. But by default, _VIM_ displays just the first file.

To edit the next file: `:next`(maybe need `:write` preceeding), or `:wnext`. We can force _VIM_ to go the next file using the force(!) option: `:next!`.

Also, the `:next` command can take a repeat count. For example: `:2 next` or `:2next`, _Vim_ acts like we issued a `:next` twice.

> `:set autowrite` & `:set noautowrite`

#### Which File

The `:args` command displays the list of the files currently being edited, and the one that we are working on now is enclosed in square brackets.

#### Previous File

To go back a file, we can execute `:previous` or `:Next`.

> `:wprevious` `:wNext`

#### First or Last File

The `:first` or `:rewind` command starts editing from the first file.

The `:last` command starts editing from the last file.

#### Editing Two Files

Suppose we edit three files with `$ gvim one.c two.c three.c` . We edit on the first file, one.c, and then go to the next file with `:wnext`. At this point, the previous file, one.c, is considered the **alternate file**. This has special significance in _Vim_. For example, a special text register (#) contains the name of this file. By pressing **CTRL-^** , we can switch editing from the current file to the alternate file.

It looks like switching the current file to the previous file just edited before this one.

The command count**CTRL-^** goes to the count file on the command line.

> 1 CTRL-^ one.c
> 
> 2 CTRL-^ two.c
> 
> 3 CTRL-^ three.c
> 
> CTRL-^ two.c (previous fi le)

# Windows

## Opening a New Window

The `:split` command splits the screen into two windows(and leaves the cursor in the top one).

The `CTRL-Ww` or `CTRL-W CTRL-W` command moves the cursor to the another window.

The `CTRL-Wj` goes down a window and `CTRL-Wk` goes up a window.

To close a window, use `zz` or `:q` or `CTRL-Wc`.

> `CTRL-W CTRL-C` can not close a window, because `CTRL-C` **cancels** any pending operation.

### Opening Another Window with Another File

The `:split file` command opens a second window and starts editing the given file.

**Cannot work?:** The `:split` command can also execute an initial command using the **+command** conversion. For example: `:split +/printf file.txt`.

### Controlling Window Size

The `:3 split file` or `:3split file` command open a new window with **3-line** size.

---

## The :new Command

The `:new` command splits the current window and starts a new file in the other window.

**CTRL-Wn** is equivalent to `:new`.

---

## Split and View

The `:sview` comand acts like a combination of `:split` and `:view`, it can open a read-only file.

---

## Changing Window Size

Suppose we are in the terminal version of _Vim_:

The command count**CTRL-W+** increases the window size by _count_(default = 1). Similarly, count**CTRL-W-** decrease the window size by _count_ (default = 1).

The command **CTRL-W=** makes all the windows the same size.

The command count**CTRL-W_** makes the current window _count_ lines high. If count is not specified, the window is increased to its maximus size.

---

## Buffers

**Buffer** is described by _Vim_ as a file being edited. Actually, a **buffer** is a copy of the file that we edit. Buffers not only contains file contents, but also all the marks, settings, and other stuff that go with it.

The `:hide` command makes the current buffer become "hidden". It looks like the buffer disappear from the screen, But _Vim_ still knows that we are editing this buffer.

A buffer can have three states:

-   **Active** Apeears on screen.
    
-   **Hidden** A file is being edited, but does not appear on screen.
    
-   **Inactive** The file is not being edited, but keep the information about it anyway.
    
    > Hidden:
    > 
    > We can hide buffers whose changes are not saved when we want to save them later.
    > 
    > Inactive state:
    > 
    > 1.  When we edit another file, the content of the current file is no longer needed, so _Vim_ discards it. But information about marks in the file and some other things are still useful and are remembered along with the name of the file.
    >     
    > 2.  Also, a file that was included in the command with which you started Vim, but was not edited, will also be an inactive buffer.
    >     
    

To find a list of buffers, use `:buffers`, `:ls` or `:files`. Then the screen shows three column. The first column is the **buffer number**. The second is a series of **flags** indicating the state of the buffer. The third is the name of the file associated with the buffer.

> State flags:
> 
> -   a An active buffer, it is loaded and visible.
>     
> -   % The current buffer.
>     
> -   # The alternate buffer.
>     
> -   + A modified buffer.
>     
> -   h A hidden buffer. It is loaded, but currently not displayed in a window
>     
> -   - Inactive buffer. A buffer with _modifiable_ off. (?)
>     
> -   = A readonly buffer.
>     
> -   x A buffer with read errors.
>     
> -   u An unlisted buffer. (only displayed when [!] is used)
>     

### Selecting a Buffer

The `:buffer number` command selects buffer by buffer _number_.

Also, we can use `:buffer file` command to select buffer by filename.

The following command splits the window and starts editing the buffer:

`:sbuffer number` or `:sbuffer file`.

> If no number or filename is specified, the current buffer is used.

Other buffer-related commands include the following:

Command

Description

`:[count] bnext`

Go to the next buffer (_count_ times).

`:[count] sbnext`

Shorthand for `:split` followed by `:[count] bnext` .

`:[count] bprevious`

Go to the (_count_) previous buffer.

`:[count] sbprevious`

Shorthand for `:split` and `:[count] bprevious`.

`:[count] bNext`

Alias for `:[count] bprevious` .

`:[count] sbNext`

Alias for `:[count] sbprevious` .

`:brewind` or `:bfirst`

Go to the first buffer in the list.

`:sbrewind` or `:sbfirst`

Shorthand for `:split` and `:rewind`.

`:blast`

Go to the last buffer in the list.

`:sblast`

Shorthand for `:split` and `:blast`.

`:bmidified [count]`

Go the (_count_) modified buffer on the list.

`:sbmidified [count]`

Shorthand for `:split` and `:bmodified`.

`:badd file`

Add a file to buffer list without opening it.

`:bdelete number/file`

Delete a file from buffer list by _number_ or _filename_.

### Buffer Options

Usually when the last window of a file is closed, the buffer associated with the file becomes inactive. If the option **hidden** is set, files that leave the screen do not become inactive; instead they automatically become hidden. Therefore if you want to keep the contents of all your old buffers around while editing, use the following command `:set hidden`.

> The option **switchbuf** is still makes me confused.

# Basic Visual Mode

## Entering Visual Mode

To enter visual mode:

**v** starts a character-by character visual mode

**V** starts linewise visual mode.

**CTRL-V** starts a visual mode that can highlight a block on screen.

> To get help on the commands that operate in visual mode, use the pre fi x v_ . For example, `:help v_d`.

### Leaving Visual Mode

We leave visual mode by typing a visual-mode command, such as **d**. Also, we can press <Esc> to cancel visual mode.

> ? (page 58): If we want to make sure that we are in normal mode and do not want to generate a beep, use the CTRL- \ CTRL-N command.This acts just like <Esc> but without the noise.

---

## Editing with Visual Mode

### Deleting Text in Visual Mode

The **d** command deletes the highlighted text. The **D** command deletes the highlighted lines.

### Yanking Text

The **y** command places the highlighted text into a register.The linewise version of this command, **Y** , places each line of the highlighted text into a register.

### Switching Modes

We can switch modes by type the command as same as entering the different visual mode. And we can retype the command to exit it and back to nomarl mode.

### Changing Text

The **c** command deletes the highlighted text and starts insert mode, including the character under the cursor. The **C** command does the same thing, but it works only on whole lines.

The **r**x command replaces the highlighted text with character _x_.

The **s** command works like **c** command.

The **R** and **S** commands work like **C** command.

### Joining Lines

The **J** command joins all the highlighted lines into one long line. **Spaces** are used to separate the lines.

### Indent

The **>** command indents the selected lines by one “shift width.” (The amount of white space can be set with the '**shiftwidth**' option.) The **<** does the process in reverse.

(Note that these commands have a different meaning when using visual block mode.)

The **=** command indents the text. The **CTRL-]** command will jump to definition of the function highlighted.

### Keyword Lookup

The **K** command is designed to look up the selected text using the “man” command. It works just like the normal-mode **K** command except that it uses the highlighted text as the keyword.

---

## Visual Block Mode

Suppose all the commands introducing later are typed in _Visual Block Mode_.

### Inserting Text

The command **I{string} <Esc>** inserts the text on each line starting at the left side of the visual block.

If the block spans short lines that do not extend into the block, the text is not inserted in that line.

If the _string_ contains a newline, the **I** acts just like a normal-mode insert ( **i** ) command and affects only the first line of the block.

### Changing Text

The **c** command deletes the block and then throws you into insert mode to enable you to type in a string. The string will be **inserted** on each line in the block.

The **c** command works only if we enter less than one line of new text. If we enter something that contains a newline, only the first line is changed. (In other words, visual block **c** acts just normal-mode c if the text contains more than one line.)

> The string will not be inserted on lines that do not extend into the block. Therefore if the block includes some short lines, the string will not be inserted in the short lines.

The **C** command deletes text from the left edge of the block to the end of line. It then puts you in insert mode so that you can type in a string, which is added to the **end** of each line. Again, short lines that do not reach into the block are **excluded**.

The **A** command throws Vim into insert mode to enable you to input a string. The string is **appended** to the block . If there are short lines in the block, **spaces** are added to pad the line and then string is appended.

> ?(page 63): You can define a right edge of a visual block in two ways. If you use just **motion keys**, the right edge is the edge of the highlighted area. If you use the **$** key to extend the visual block to the end of line, the **A** key will add the text to the end of each line.

### Replacing

The **r** and **R** commands in visual block mode work as same as in other two visual modes.

### Shifting

The command **>** shifts the text to the right one shift width, opening whitespace. The starting point for this shift is the left side of the visual block.

The **<** command removes one shift width of whitespace at the left side of the block. This command is limited by the amount of text that is there; so if there is less than a shift width of whitespace available, it removes what it can.

### Visual Block Help

To get help for the commands that use visual block mode, we need to prefix the command with **v_b_** . For example, `:help v_b_r`.
