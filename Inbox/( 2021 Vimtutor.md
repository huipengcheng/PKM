---
tags: 📥️/📰️/🟥️
publish: true
aliases: 
type: article
status: 🟥️
created: 2022-05-05 16-05
updated: 2022-06-01 22-15
---

- `Topics:` [[Vim]]
- `Title:` [[( 2021 Vimtutor]]
- `Type:` [[(]]
- `Reference:` 
- `Publish Date:` 
- `Reviewed Date:` [[2022-05-05]]

---

# MOTION

**H** moves to the top of the screen.

**M** moves to the middle of the screen.

**L** moves to the end of the screen.

**Crtl + b** page up

**Crtl + f** page down

**Crtl + u** half page up

**Crtl + d** half page down

**0** moves to the line beginning.

**$** moves to the line end.

**^** moves to the first character of the line(ignore spaces).

**w**

**W** moves to the beginning of the next word, but ignores punctuation.

**e**

**E** moves to the end of the next word, but ignores punctuation.

**b**

**B** moves back to the beginning of the last word, but ignores punctuation.

**G**

**gg**

**(** moves back to the the beginning of the last sentence.

**)** moves to the the beginning of the next sentence.

**{** moves back to the the beginning of the last paragraph.

**}** moves to the the beginning of the next paragraph.

**Space** let cursor move forward by a character.

**Backspace** let cursor move backward by a character.

**Enter** let cursor move forward by a line.

**Ctrl + p**

**Ctrl + n**

**n|** let cursor move the nth character in the current line.

**nG**

**n+** let cursor move down by n lines.

**n-** let cursor move up by n lines.

**n$** let cursor move down to the end of the line which has n lines far from the current line.

**(not OPERATOR)**

adding a count for a motion (means **REPETION**): **2w**, **3e**, **0**(zero, for to move to the start of the line), **$**(to move to the end of the line).

> `operator number motion` : **d2w**

# Insert Mode

## Insert Command

**i** inserts text under the cursor

**I** inserts text in the beginning of the line.

## Open Command

**o** opens a line below the cursor and switches to Insert mode

**O** opens a line above the cursor.

## Append Command

**a** appends text AFTER the cursor

**A** appends text AFTER the line.

## Delete Command

**s** deletes the character under the cursor and switches to Insert Mode

**S** deletes the line under the cursor and switches to Insert Mode.

# Command Mode

## EXTERNAL COMMAND

**:! + external_command** to execute that command

EX: **:!ls**, **:!rm -rf FILENAME**

**:r! external_command** input the result of the external command to the next line of the cursor.

**:n1,n2 w! external_command** let the content between the two line whose linenumbers are n1 and n2 be the input of the external command

## SAVING FILES

**w + FILENAME** saves the whole file under the name FILENAME

**:x** equals to **:wq!**

**ZZ** quit the file with saving.

**ZQ** quit the file without saving.

## SEARCH

**/ + phrase** to search for the phrase, n or N to continue search

**? + pharse** to search for the phrase backword direction

**CTRL-o** backs where came from, **CTRL-i** goes forward

-   MATCHING PARENTESES SEARCH Type % to find a matching ),], or } .
    

## SUBSTITUTION

**:s/old/new** substitutes the first 'new' for 'old'

**:s/old/new/g** substitutes 'new' for all 'old' ('g' means 'globally' or 'greedily' in the line)

To change every occurrence of a character string between two lines:

-   **#,#s/old/new/g** where #,# are the line numbers of the range of lines where the substitution is to be done.
    
-   **%s/old/new/g** to change every occurrence in the whole file.
    
-   **%s/old/new/gc** to find every occurrence in the whole file, with a prompt whether to substitute or not.
    

## RETRIEVING AND MERGING FILES

**:r + FILENAME** retrieves file and put its content below the cursor line.

GWe can also read the output of an external command. For example, **r !ls**.

## SET OPTION

**:set xxx** sets the option "xxx". Some options are: '**ic**' 'ignorecase' ignore upper/lower case when searching '**is**' 'incsearch' show partial matches for a search phrase '**hls**' 'hlsearch' highlight all matching phrases We can either use the long or the short option name.

Prepend "no" to switch an option off: **:set noic**

NOTE: To remove the highlighting of matches enter: **:nohlsearch**

NOTE: If you want to ignore case for just one search command, use \c in the phrase: **/<SEARCHING>\c and <ENTER>**

## Deletion

**:d** deletes current line.

**:nd** deletes the nth line.

**:n1,n2 d** deletes the contents between the n1th line and the n2th line.

**:.,$d** deletes the contents between the current line and the end line.

## Copy and Move

**:n1,n2 co n3** copy the contents between the n1th line and the n2th line below the n3th line.

**:n1,n2 m n3** move the contents between the n1th line and the n2th line below the n3th line.

**:n** moves to the nth line

## GETTING HELP

-   press the <HELP> key (if you have one)
    
-   press the <F1> key (if you have one)
    
-   type :help <ENTER>
    

Type CTRL-W CTRL-W to jump from one window to another. Type :q <ENTER> to close the help window.

We can find help on just about any subject, by giving an argument to the ":help" command. Try these (don't forget pressing <ENTER>):

-   :help w
    
-   :help c_CTRL-D
    
-   :help insert-index
    
-   :help user-manual
    

**:help user-manual**

For further reading and studying, this book is recommended: Vim - Vi Improved - by Steve Oualline Publisher: New Riders

The first book completely dedicated to Vim. Especially useful for beginners. There are many examples and pictures. See [http://iccf-holland.org/click5.html](http://iccf-holland.org/click5.html)

This book is older and more about Vi than Vim, but also recommended: Learning the Vi Editor - by Linda Lamb Publisher: O'Reilly & Associates Inc. It is a good book to get to know almost anything you want to do with Vi. The sixth edition also includes information on Vim.

# OPERATOR

## DELETION

1.  **x**: to delete the character under cursor
    
2.  **X**: to delete the charactet before the cursor
    
3.  **d**+:
    
    -   **w** - delete until the start of the next word
        
    -   **e** - delete to the end of the current word
        
    -   **$** - delete until the end of the line, including the character under the cursor (equlas to **D**)
        
    -   **G** - delete until the end of the file, including the current line
        
    
    > d - is the operator
    > 
    > motion - is what the operator will operate on (listed above)
    > 
    > NOTE: Pressing motion while in Normal Mode without an operator will move the cursor as specified.
    

### OPERATING ON LINES

**dd**: deletes one line

**2dd**:deletes tow lines

## UNDO

**u** undoes the last command **U** undoes all the changes on a line **CTRL-r** means **redo**, to undo the undos

## Repetion

**.** redos the last operation.

## PUT

**p**: puts previously deleted text below the cursor

## REPLACE

**rx**: replaces the character at the cursor with x.

**R**: switches to **Replace Mode** to replace more characters (Press ESC to leave).

## CHANGE

**ce**: changes until the end of a word (it will delete the characters after and include the character where cursor on, and change to Insert Mode)

c [number] motion

It looks like ce is as same as cw?

## COPY AND PASTE

**y** copys text and p pastes it.

**yw** yanks one word, **yy** yanks the whole line,

# ELSE

## CURSOR LOCATION AND FILE STATUS

**CTRL-g**: show the location in the file and the file status

**G**: to move to the bottom of the file

**gg**: to move to the start of the file

**number gg/G**

## SELECTING TEXT

Press **v** to start **Visual Mode**, and move cursor to select text.

If want to saving the selcted text, press :, then **:'<,'>** will apper. Then type **w + FILENAME**

Moreover, when the text is selected, we can press **OPERATOR** to do something with it. For example, **d** deletes the text, **x** also can delete it. And **r** replaces all the characters of the text to the character you put after r, **c** deletes the text and switches to Insert Mode.

## STARTUP SCRIPT

editing the "vimrc" file: **:e ~/.vimrc**

read the example "vimrc" file: **:r $VIMRUNTIME/vimrc_example.vim**

write the file with:**:w**

for more information type **:help vimrc-intro**

## COMPLETION

Make sure Vim is not in compatible mode: **:set nocp**

**CTRL-d** will show a list of commands

**<TAB>** will complete the command name

It is especially useful for **:help**.
