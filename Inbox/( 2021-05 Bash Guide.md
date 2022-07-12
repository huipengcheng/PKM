---
tags: 📥️/📰️/🟧️️
publish: true
aliases: 
type: article
status: 🟧️️
created: 2022-05-05 23-33
updated: 2022-06-01 22-15
---

- `Topics:` [[Bash]]
- `Title:` [[( 2021-05 Bash Guide]]
- `Type:` [[(]]
- `Reference:` http://mywiki.wooledge.org/BashGuide
- `Publish Date:` 
- `Reviewed Date:` [[2022-05-05]]

---

# Special characters

| **Char**      | **Description**                                              |
| -------------- | ------------------------------------------------------------ |
| `" "`          | *Whitespace* — this is a tab, newline,  vertical tab, form feed, carriage return, or space.  Bash uses  whitespace to determine where words begin and end.  The first word is  the command name and additional words become arguments to that command. |
| `$`            | *Expansion* — introduces various types of expansion:[[Bash Parameter Expansion\|parameter expansion]], [command substitution](http://mywiki.wooledge.org/CommandSubstitution) (e.g. `$(command)`), or arithmetic expansion (e.g. `$((expression))`). |
| `''`           | *Single quotes* — protect the text inside them so that it has a *literal* meaning. With them, generally any kind of interpretation by Bash is  ignored: special characters are passed over and multiple words are  prevented from being split. |
| `""`           | *Double quotes* — protect the text  inside them from being split into multiple words or arguments, yet allow substitutions to occur; the meaning of most other special characters is usually prevented. |
| `\`            | *Escape* — (backslash) prevents the  next character from being interpreted as a special character.  This  works outside of quoting, inside double quotes, and generally ignored in single quotes. |
| `#`            | *Comment* — the `#` character begins a commentary that extends to the end of the line.   Comments are notes of explanation and are not processed by the shell. |
| `=`            | *Assignment* -- assign a value to a variable (e.g. `logdir=/var/log/myprog`).  Whitespace is *not* allowed on either side of the `=` character. |
| `[[ ]]`        | *Test* — an evaluation of a conditional expression to determine whether it is "true" or "false".  Tests are  used in Bash to compare strings, check the existence of a file, etc.   More of this will be covered later. |
| `!`            | *Negate* — used to negate or reverse a test or exit status.  For example: `! grep text file; exit $?`. |
| `>`, `>>`, `<` | *Redirection* — redirect a command's *output* or *input* to a file. Redirections will be covered later. |
| `|`            | *Pipe* — send the output from one command to the input of another command.  This is a method of chaining commands together.  Example: `echo "Hello beautiful." | grep -o beautiful`. |
| `;`            | *Command separator* — used to separate multiple commands that are on the same line. |
| `{ }`          | *Inline group* — commands inside the  curly braces are treated as if they were one command.  It is convenient  to use these when Bash syntax requires only one command and a function  doesn't feel warranted. |
| `( )`          | *Subshell group* — similar to the above but where commands within are executed in a [subshell](http://mywiki.wooledge.org/SubShell) (a new process).  Used much like a sandbox, if a command causes side  effects (like changing variables), it will have no effect on the current shell. |
| `(( ))`        | *Arithmetic expression* — with an [arithmetic expression](http://mywiki.wooledge.org/ArithmeticExpression), characters such as `+`, `-`, `*`, and `/` are mathematical operators used for calculations.  They can be used for variable assignments like `(( a = 1 + 4 ))` as well as tests like `if (( a < b ))`.  More on this later. |
| `$(( ))`       | *Arithmetic expansion* — Comparable to the above, but the expression is replaced with the result of its arithmetic evaluation.  Example: `echo "The average is $(( (a+b)/2 ))"`. |
| `*`, `?`       | *[Globs](http://mywiki.wooledge.org/glob)* -- "wildcard" characters which match parts of filenames (e.g. `ls *.txt`). |
| `~`            | *Home directory* — the tilde is a representation of a home directory.  When alone or followed by a `/`, it means the current user's home directory; otherwise, a username must be specified (e.g. `ls ~/Documents; cp ~john/.bashrc .`). |
| `&`            | *Background* -- when used at the end of a command, run the command in the background (do not wait for it to complete). |

## Deprecated special characters
This group of characters will also be evaluated by Bash to have a *non-literal* meaning, but are generally included for backwards compatibility only.  These are not recommended for use, but often appear in older or poorly  written scripts. 

| **Char** | **Description**                                              |
| --------- | ------------------------------------------------------------ |
| \` \`     | *[Command substitution](http://mywiki.wooledge.org/CommandSubstitution)* - use `$( )` instead. |
| `[ ]`     | *Test* - an alias for the old `test` command.  Commonly used in POSIX shell scripts.  Lacks many features of `[[ ]]`. |
| `$[ ]`    | *[Arithmetic expression](http://mywiki.wooledge.org/ArithmeticExpression)* - use `$(( ))` instead. |


# Parameters

Parameters come in two flavors: _variables_ and _special parameters_. Special parameters are read-only, pre-set by BASH, and used to communicate some type of internal status. Variables are parameters that you can create and update yourself. Variable names are bound by the following rule:
- _Name_: A word consisting only of letters, digits and underscores, and beginning with a letter or an underscore. Also referred to as an _identifier_.

To store data in a variable, we use the following _assignment_ syntax:

```bash
$ varname=vardata
```

```ad-warning
Please note that you _cannot_ use spaces around the `=` sign in an assignment. BASH will not know that you are attempting to assign something. The parser will see varname with no = and treat it as a command name, and then pass = and vardata to it as arguments.
```

To access the data stored in a variable, we use [parameter expansion](http://mywiki.wooledge.org/BashGuide/Parameters#Parameter_Expansion). Parameter expansion is the _substitution_ of a parameter by its value, which is to say, the syntax tells bash that you want to use the contents of the variable. After that, Bash _may still perform additional manipulations on the result_.

Variables are actually just one kind of parameter: parameters that are denoted by a name. Parameters that aren't variables are called [[Bash Special Parameter|Special Parameter]].

Here are a few examples of *Variables* that the shell provides for you: [[Bash Shell Variables|Shell Variables]]. And variable type information is stored internally by Bash: [[Bash Variable Types|Variable Types]]. 

## Special Parameters
| **Parameter Name** | **Usage**   | **Description**                                              |
| ------------------ | ----------- | ------------------------------------------------------------ |
| **0**              | `"$0"`      | Contains the name, or the path, of the script. **This is not always reliable.** |
| **1** **2** etc.   | `"$1"`, `"$2"`, `"${10}"` etc. | *Positional Parameters* contain the arguments that were passed to the current script or function. |
| *****              | `"$*"`      | Expands to all the words of all the *positional  parameters*.  Double quoted, it expands to a single string containing  them all, separated by the first character of the **IFS** variable (discussed later). |
| **@**              | `"$@"`      | Expands to all the words of all the *positional  parameters*.  Double quoted, it expands to a list of them all as individual words. |
| **#**              | `$#`        | Expands to the number of *positional parameters* that are currently set. |
| **?**              | `$?`        | Expands to the exit code of the most recently completed foreground command. |
| **$**              | `$$`        | Expands to the [PID](http://mywiki.wooledge.org/ProcessManagement) (process ID number) of the current shell. |
| **!**              | `$!`        | Expands to the PID of the command most recently executed in the background. |
| **_**              | `"$_"`      | Expands to the last argument of the last command that was executed. |

Another way to deal with the *positional parameters* is to eliminate each one as it is used.  There is a special builtin command named `shift` which is used for this purpose.  When you issue the `shift` command, the first positional parameter (`$1`) goes away.  The second one becomes `$1`, the third one becomes `$2`, and so on down the line.

## Shell Variables
- **BASH_VERSION**: Contains a string describing the version of Bash. 
- **HOSTNAME**: Contains the hostname of your compute.
- **PPID**: Contains the PID of the parent process of this shell. 
- **PWD**: Contains the current working directory. 
- **RANDOM**: Each time you expand this variable, a (pseudo)random number between 0 and 32767 is generated. 
- **UID**: The ID number of the current user.  Not reliable for security/authentication purposes, alas. 
- **COLUMNS**: The number of characters that fit on one line in your terminal. (The width of your terminal in characters.) 
- **LINES**: The number of lines that fit in your terminal. (The height of your terminal in characters.) 
- **HOME**: The current user's home directory. 
- **PATH**: A colon-separated list of paths that will be searched to find a  command, if it is not an alias, function, builtin command, or shell  keyword, and no pathname is specified. 
- **PS1**: Contains a string that describes the format of your shell prompt. 
- **TMPDIR**: Contains the directory that is used to store temporary files (by the shell). 

## Variable Types
Type information is stored internally by Bash. 

- **[[Bash Arrays|Array]]**: `declare -a `*variable*: The variable is an array of strings. 
- **[[Bash Arrays#Associative Arrays|Associative array]]**: `declare -A `*variable*: The variable is an associative array of strings (bash 4.0 or higher). 
- **Integer**: `declare -i  `*variable*: The variable holds an integer.  Assigning values to this variable automatically triggers *Arithmetic Evaluation*. 
- **Read Only**: `declare -r `*variable*: The variable can no longer be modified or unset. 
- **Export**: `declare -x `*variable*: The variable is marked for export which means it will be inherited by any child process. 


Defining variables as integers has the advantage that you can leave out some syntax when trying to assign or modify them: 

```bash
$ a=5; a+=2; echo "$a"; unset a
52
$ a=5; let a+=2; echo "$a"; unset a
7
$ declare -i a=5; a+=2; echo "$a"; unset a
7
$ a=5+2; echo "$a"; unset a
5+2
$ declare -i a=5+2; echo "$a"; unset a
7
```

However, in practice the use of `declare -i` is exceedingly rare. In large part, this is because it creates behavior that can be surprising to anyone trying to maintain the script, who misses the `declare` statement.  Most experienced shell scripters prefer to use explicit arithmetic commands (with `((...))` or `let`) when they want to perform arithmetic. 

It is also rare to see an explicit declaration of an array using `declare -a`.  It is sufficient to write `array=(...)` and Bash will know that the variable is now an array.  The exception to this is the associative array, which *must* be declared explicitly: `declare -A myarray`. 


## Parameter Expansion
*Parameter Expansion* is the term that refers to any operation that causes a parameter to be expanded (replaced by content). In its most basic appearance, the expansion of a parameter is achieved by prefixing that parameter with a `$` sign. In certain situations, additional curly braces around the parameter's name are required: 

```bash
$ echo "'$USER', '$USERs', '${USER}s'"
'lhunath', '', 'lhunaths'
```

*Parameter Expansion* also gives us tricks to modify the string that will be expanded. These operations can be terribly convenient: 

```bash
$ for file in *.JPG *.jpeg
do mv -- "$file" "${file%.*}.jpg"
done
```

The expression `${file%.*}` cuts off everything from the end starting with the last period (`.`).  Then, in the same quotes, a new extension is appended to the expansion result. 

Here's a summary of most of the PE tricks that are available: 

| **Syntax**                   | **Description**                                              |
| ---------------------------- | ------------------------------------------------------------ |
| `${parameter:-word}`         | **Use Default Value**.  If '`parameter`' is unset or null, '`word`' (which may be an expansion) is substituted.  Otherwise, the value of '`parameter`' is substituted. |
| `${parameter:=word}`         | **Assign Default Value**.  If '`parameter`' is unset or null, '`word`' (which may be an expansion) is assigned to '`parameter`'.  The value  of '`parameter`' is then substituted. |
| `${parameter:+word}`         | **Use Alternate Value**.  If '`parameter'` is null or unset, nothing is substituted, otherwise '`word`' (which may be an expansion) is substituted. |
| `${parameter:offset:length}` | **Substring Expansion**.   Expands to up to '`length`' characters of '`parameter`' starting at the character specified by '`offset`' (0-indexed). If '`:length`' is omitted, go all the way to the end.  If '`offset`' is negative (use parentheses!), count backward from the end of '`parameter`' instead of forward from the beginning. If '`parameter`' is @ or an indexed array name subscripted by @ or *, the result is '`length`' positional parameters or members of the array, respectively, starting from '`offset`'. |
| `${#parameter}`              | The length in characters of the value of '`parameter`' is substituted. If '`parameter`' is an array name subscripted by @ or *, return the number of elements. |
| `${parameter#pattern}`       | The '`pattern`' is matched against the **beginning** of '`parameter`'. The result is the expanded value of '`parameter`' with the shortest match deleted.   If '`parameter`' is an array name subscripted by @ or *, this will be done on each element. Same for all following items. |
| `${parameter##pattern}`      | As above, but the *longest* match is deleted.                |
| `${parameter%pattern}`       | The '`pattern`' is matched against the **end** of '`parameter`'. The result is the expanded value of '`parameter`' with the shortest match deleted. |
| `${parameter%%pattern}`      | As above, but the *longest* match is deleted.                |
| `${parameter/pat/string}`    | Results in the expanded value of '`parameter`' with the **first** (unanchored) match of '`pat`' replaced by '`string`'. Assume null string when the '`/string`' part is absent. |
| `${parameter//pat/string}`   | As above, but **every** match of '`pat`' is replaced.        |
| `${parameter/#pat/string}`   | As above, but matched against the **beginning**. Useful for adding a common prefix with a null pattern: `"${array[@]/#/prefix}"`. |
| `${parameter/%pat/string}`   | As above, but matched against the **end**. Useful for adding a common suffix with a null pattern. |

Here are a few examples: 

```bash
$ file="$HOME/.secrets/007"; \
echo "File location: $file"; \
echo "Filename: ${file##*/}"; \
echo "Directory of file: ${file%/*}"; \
echo "Non-secret file: ${file/secrets/not_secret}"; \
echo; \
echo "Other file location: ${other:-There is no other file}"; \
echo "Using file if there is no other file: ${other:=$file}"; \
echo "Other filename: ${other##*/}"; \
echo "Other file location length: ${#other}"
File location: /home/lhunath/.secrets/007
Filename: 007
Directory of file: /home/lhunath/.secrets
Non-secret file: /home/lhunath/.not_secret/007

Other file location: There is no other file
Using file if there is no other file: /home/lhunath/.secrets/007
Other filename: 007
Other file location length: 26
```



Remember the difference between `${v#p}` and `${v##p}`.  The doubling of the `#` character means patterns will become greedy.  The same goes for `%`: 

```bash
$ version=1.5.9; echo "MAJOR: ${version%%.*}, MINOR: ${version#*.}."
MAJOR: 1, MINOR: 5.9.
$ echo "Dash: ${version/./-}, Dashes: ${version//./-}."
Dash: 1-5.9, Dashes: 1-5-9.
```

Note: You **cannot** use multiple PEs **together**.  If you need to execute multiple PEs on a parameter, you will need to use multiple statements: 

```bash
$ file=$HOME/image.jpg; file=${file##*/}; echo "${file%.*}"
image
```

# Bash Patterns
Bash offers three different kinds of *pattern matching*. Pattern matching serves two roles in the shell: selecting filenames within a directory, or determining whether a string conforms to a desired format. 

On the command line you will mostly use [[Bash Globs|globs]]. These are a fairly straight-forward form of patterns that can easily  be used to match a range of files, or to check variables against simple rules. 

The second type of pattern matching involves [[Bash Extended Globs|extended globs]], which allow more complicated expressions than regular globs. 

Since version `3.0`, Bash also supports [[Bash Regular Expressions|regular expression patterns]]. These will be useful mainly in scripts to test user input or parse data.  (You can't use a regular expression to select filenames;  only globs and extended globs can do that.) 

Finally, there is [[Bash Brace Expansion|brace expansion]]. Brace Expansion technically does not fit in the category of patterns, but it is similar.

## Globs
Globs are basically patterns that can be used to match filenames or other strings. Globs are composed of normal characters and metacharacters.  Metacharacters are characters that have a special meaning:

- *****: Matches any string, including the null string. 
- **?**: Matches any single character. 
- **[...]**: Matches any one of the enclosed characters. 

Globs are implicitly *anchored* at both ends, which means a glob of "a*" will not match the string "cat" but can match the string "at".

Bash sees the glob, for example `a*`.  It *expands* this glob, by looking in the current directory and matching it against all files there.  Any filenames that match the glob are gathered up and sorted, and then the list of filenames is used in place of the glob (like [[Bash Parameter Expansion|parameter expansion]].

When a glob is used to match *filenames*, the `*` and `?` characters cannot match a slash (`/`) character. So, for instance, the glob `*/bin` might match `foo/bin` but it cannot match `/usr/local/bin`.

Bash performs filename expansions *after* word splitting has already been done. Therefore, filenames generated by a glob will not be split; they will always be handled correctly. Using globs to enumerate files is **always** a better idea than using ``ls`` for that purpose.

```bash
$ ls
a b.txt
$ for file in `ls`; do rm "$file"; done
rm: cannot remove 'a': No such file or directory
rm: cannot remove 'b.txt': No such file or directory
$ for file in *; do rm "$file"; done
$ ls
```

In addition to filename expansion, globs may also be used to check whether data matches a specific format. For example, we might be given a filename, and need to take different actions depending on its extension:

```bash
$ filename="somefile.jpg"
$ if [[ $filename = *.jpg ]]; then
> echo "$filename is a jpeg"
> fi
somefile.jpg is a jpeg
```

## Extended Globs
*Extended Globs* are more powerful in nature; technically, they are equivalent to regular expressions, although the syntax looks different. This feature is turned off by default,  but can be turned on with the `shopt` command, which is used to toggle **sh**ell **opt**ions:

```bash
$ shopt -s extglob

$ setopt kshglob # in zsh
```

- **?(list)**: Matches zero or one occurrence of the given patterns. 
- **(list)**: Matches zero or more occurrences of the given patterns. 
- **+(list)**: Matches one or more occurrences of the given patterns. 
- **@(list)**: Matches one of the given patterns. 
- **!(list)**: Matches anything but the given patterns. 

The list inside the parentheses is a list of globs or extended globs separated by the `|` character. Here's an example: 

```bash
$ ls
names.txt  tokyo.jpg  california.bmp
$ echo !(*jpg|*bmp)
names.txt
```

## Regular Expressions
Regular expressions (regex) are similar to [[Bash Globs|glob patterns]], but they can only be used for pattern matching, not for filename matching.  Since 3.0, Bash supports the `=~` operator to the `[[` keyword. This operator matches the string that comes before it against the regex pattern that follows it. When the string matches the pattern, `[[` returns with an exit code of `0` ("true").  If the string does not match the pattern, an exit code of `1` ("false") is returned. In case the pattern's syntax is invalid, `[[` will abort the operation and return an exit code of `2`. 

Bash uses the *Extended Regular Expression* (`ERE`) dialect ( [RegularExpression](http://mywiki.wooledge.org/RegularExpression), or [Extended Regular Expressions](http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap09.html#tag_09_04)).

*Regular Expression* patterns that use capturing groups (parentheses) will have their captured strings assigned to the `BASH_REMATCH` variable for later retrieval. 

```bash
$ langRegex='(..)_(..)'
$ if [[ $LANG =~ $langRegex ]]
> then
>     echo "Your country code (ISO 3166-1-alpha-2) is ${BASH_REMATCH[2]}."
>     echo "Your language code (ISO 639-1) is ${BASH_REMATCH[1]}."
> else
>     echo "Your locale was not recognised"
> fi
```

Be aware that regex parsing in Bash has changed between releases `3.1` and `3.2`.  Before `3.2` it was safe to wrap your regex pattern in quotes but this has changed in `3.2`.  Since then, regex should always be **unquoted**.  You should protect any special characters by **escaping** it using a backslash. The best way to always be compatible is to put your regex in a variable and expand that variable in `[[` without quotes, as we showed above. 

## Brace Expansion
[[Bash Globs|Globs]] only expand to actual filenames, but brace expansions will expand to any possible permutation of their contents. 

```bash
$ echo th{e,a}n
then than
$ echo {/home/*,/root}/.*profile
/home/axxo/.bash_profile /home/lhunath/.profile /root/.bash_profile /root/.profile
$ echo {1..9}
1 2 3 4 5 6 7 8 9
$ echo {0,1}{0..9}
00 01 02 03 04 05 06 07 08 09 10 11 12 13 14 15 16 17 18 19
```

The brace expansion is replaced by a list of words, just like a glob is. However, these words aren't necessarily filenames, and they are not sorted (`than` would have come before `then` if they were). 

Brace expansion happens **before** filename expansion, as same as the [[Bash Globs|globs]]. In the second `echo` command above, we used a combination of brace expansion and globs. The brace expansion goes **first**, and we get: 

```bash
$ echo /home/*/.*profile /root/.*profile
```

Brace expansions can only be used to **generate lists of words**. They cannot be used for pattern matching. 

There are a few differences between ranges in character classes like [a-z] and brace expansion. For example, brace expansion allows **counting backward**, as can be seen with `{5..1}` or even `{b..Y}`, whereas `[5-1]` isn't expanded by the shell. `[b-Y]` may or may not be expanded, depending on your [locale](http://mywiki.wooledge.org/locale). Also, character ranges in brace expansions ignore locale variables like `LANG` and `LC_COLLATE` and always use ASCII ordering. Globbing on the other hand is affected by language settings. The following fragment is an example for counting down and for displaying characters in the order of their ASCII codes: 

```bash
$ echo {b..Y}
b a ` _ ^ ]  [ Z Y
```

# Tests and Conditionals

## Exit Status
Every command results in an exit code whenever it terminates. This exit code is used by whatever application started it to evaluate whether everything went OK. This exit code is an integer in **[0, 255)**. Convention dictates that we use 0 to denote success, and any other number to denote failure of some sort. The specific number is entirely application-specific, and is used to hint as to what exactly went wrong. 

The special parameter `?` shows us the exit code of the last foreground process that terminated. 

You should make sure that your scripts always return a non-zero exit  code if something unexpected happened in their execution.  You can do this with the `exit` builtin:

```bash
rm file || { echo 'Could not delete file!' >&2; exit 1; }
```

## Control Operators
*Control operators* are `&&` and `||`, which respectively represent a logical AND and a logical OR. These operators are used between two commands, and they are used to control whether the second command should be executed depending on the success of the first.  This concept is called *conditional execution*. 

```bash
$ mkdir d && cd d
```

```bash
$ rm /etc/some_file.conf || echo "I couldn't remove the file"
rm: cannot remove `/etc/some_file.conf': No such file or directory
I couldn't remove the file
```

In general, it's *not* a good idea to string together multiple different control operators in one command (we will explore this in the next section).

## Conditional Blocks
### if
```bash
if COMMANDS
then OTHER COMMANDS
fi

if COMMANDS
then
    OTHER COMMANDS
fi

if COMMANDS; then
    OTHER COMMANDS
fi

if COMMANDS
	then OTHER COMMANDS
elif COMMANDS
	then OTHER COMMANDS
else OTHER COMMANDS
fi
```

### test or [
There are some commands designed specifically to *test* things and return an [[Bash Exit Status|exit status]] based on what they find. The first such command is `test` (also known as `[`).  `[` or `test` is a normal command that reads its arguments and does some checks with them.  

```bash
$ if [ a = b ]
> then echo "a is the same as b."
> else echo "a is not the same as b."
> fi
a is not the same as b.
```

`if` executes the command `[` (remember, you don't **need** an `if` to run the `[` command !) with the arguments `a`, `=`, `b` and `]`.  `[` uses these arguments to determine what must be checked. Since the string "a" is not equal to the string "b", `[` will not exit successfully (its exit code will be 1).  `if` sees that `[` terminated unsuccessfully and executes the code in the `else` block. 

The last argument, "]", means nothing to `[`, but it is required. See what happens when you omit it. 

Here's an example of a common pitfall when `[` is used: 

```bash
$ myname='Greg Wooledge' yourname='Someone Else'
$ [ $myname = $yourname ]
-bash: [: too many arguments
```

`[` was executed with the arguments `Greg`, `Wooledge`, `=`, `Someone`, `Else` and `]`.  That is 6 arguments, not 4!  `[` doesn't understand what test it's supposed to execute, because it expects either the first or second argument to be an operator. In our case, the operator is the third argument. Yet another reason why [quotes](http://mywiki.wooledge.org/Quotes) are so terribly **important**.

### [[

To help us out a little, the Korn shell introduced (and Bash adopted) a  new style of conditional test. Original as the Korn shell authors are, they called it `[[`.  `[[` is a shell keyword, and it offers far more versatility. 

**[[Bash Patterns|pattern]] matching**: 

```bash
$ [[ $filename = *.png ]] && echo "$filename looks like a PNG file"
```

**[[Bash Parameter Expansion|parameter expansions]]**: 

```bash
$ [[ $me = $you ]]           # Fine.
$ [[ I am $me = I am $you ]] # Not fine!
-bash: conditional binary operator expected
-bash: syntax error near `am'
```

This time, `$me` and `$you` did not need quotes.  Since `[[` **isn't** a normal command, but a *shell keyword*. It parses its arguments **before** they are expanded by Bash and does the expansion itself, taking the result as a single argument, even if that result contains whitespace. (In other  words, `[[` does not allow word-splitting of its arguments.)  

However, simple strings still have to be quoted properly.  `[[` treats a space outside of quotes as an argument separator, just like Bash normally would.

```bash
$ [[ "I am $me" = "I am $you" ]]
```

Also; there is a subtle difference between quoting and not quoting the **right-hand side** of the comparison in `[[`.  The `=` operator does pattern matching by default, whenever the *right-hand side* is **not** quoted: 

```bash
$ foo=[a-z]* name=lhunath
$ [[ $name = $foo   ]] && echo "Name $name matches pattern $foo"
Name lhunath matches pattern [a-z]*
$ [[ $name = "$foo" ]] || echo "Name $name is not equal to the string $foo"
Name lhunath is not equal to the string [a-z]*
```

The first test checks whether `$name` matches the *pattern* in `$foo`.  The second test checks whether `$name` is equal to the *string* in `$foo`.

### Comparison Operators

"<" and ">" have special significance in bash. If you do `[ apple < banana ]`, bash will look for a file named  "banana" in the current directory so that its contents can be sent to `[ apple` (via [[Bash Input And Output|standard input]]). Assuming you don't have a file named "banana" in  your current directory, this will result in an error. The right way to do this is: `[ apple \< banana ]` or use `[[` instead of `[`. 

The comparison operators `=`, `!=`, `>`, and `<` treat their arguments as strings. 

Tests supported by `[` (also known as `test`) and `[[`: 
  - **-f FILE**: True if file is a regular file. 
  - **-d FILE**: True if file is a directory. 
  - **-h FILE**: True if file is a symbolic link. 
  - **-p PIPE**: True if pipe exists. 
  - **-r FILE**: True if file is readable by you. 
  - **-s FILE**: True if file exists and is not empty. 
  - **-t FD**  : True if FD is opened on a terminal. 
  - **-w FILE**: True if the file is writable by you. 
  - **-x FILE**: True if the file is executable by you. 
  - **-O FILE**: True if the file is effectively owned by you. 
  - **-G FILE**: True if the file is effectively owned by your group. 
  - **FILE -nt FILE**: True if the first file is newer than the second. 
  - **FILE -ot FILE**: True if the first file is older than the second. 
  - **-z STRING**: True if the string is empty (its length is zero). 
  - **-n STRING**: True if the string is not empty (its length is not zero). 
  - String operators: 
    - **STRING = STRING**: True if the first string is identical to the second. 
    - **STRING != STRING**: True if the first string is not identical to the second. 
    - **STRING < STRING**: True if the first string sorts before the second. 
    - **STRING > STRING**: True if the first string sorts after the second. 
  - **! EXPR**: Inverts the result of the expression (logical NOT). 
  - Numeric operators: 
    - **INT -eq INT**: True if both integers are identical. 
    - **INT -ne INT**: True if the integers are not identical. 
    - **INT -lt INT**: True if the first integer is less than the second. 
    - **INT -gt INT**: True if the first integer is greater than the second. 
    - **INT -le INT**: True if the first integer is less than or equal to the second. 
    - **INT -ge INT**: True if the first integer is greater than or equal to the second. 
- **-e FILE**: True if file exists. 
- Additional tests supported only by `[[`: 
  - **STRING = (or \=\=) PATTERN**: Not string comparison like with `[` (or `test`), but *pattern matching* is performed.  True if the string matches the glob pattern. 
  - **STRING != PATTERN**: Not string comparison like with `[` (or `test`), but *pattern matching* is performed.  True if the string does not match the glob pattern. 
  - **STRING =~ REGEX**: True if the string matches the regex pattern. 
  - **( EXPR )**: Parentheses can be used to change the evaluation precedence. 
  - **EXPR && EXPR**: Much like the '-a' operator of `test`, but does not evaluate the second expression if the first already turns out to be false. 
  - **EXPR || EXPR**: Much like the '-o' operator of `test`, but does not evaluate the second expression if the first already turns out to be true. 
- Tests exclusive to `[` (and `test`): 
  - **EXPR -a EXPR**: True if both expressions are true (logical AND). 
  - **EXPR -o EXPR**: True if either expression is true (logical OR). 

Some examples: 
```bash
$ test -e /etc/X11/xorg.conf && echo 'Your Xorg is configured!'
Your Xorg is configured!
$ test -n "$HOME" && echo 'Your homedir is set!'
Your homedir is set!
$ [[ boar != bear ]] && echo "Boars aren't bears."
Boars aren't bears!
$ [[ boar != b?ar ]] && echo "Boars don't look like bears."
$ [[ $DISPLAY ]] && echo "Your DISPLAY variable is not empty, you probably have Xorg running."
Your DISPLAY variable is not empty, you probably have Xorg running.
$ [[ ! $DISPLAY ]] && echo "Your DISPLAY variable is not not empty, you probably don't have Xorg running."
```

- **Good Practice: 
   Whenever you're making a Bash script, you should always use `[[` rather than `[`. 
   Whenever you're making a Shell script, which may end up being used in an environment where Bash is not available, you should use `[`, because it is far more portable.  (While being built in to Bash and some other shells, `[` should be available as an external application as well; meaning it will work as argument to, for example, find's -exec and xargs.) 
   Don't ever use the `-a` or `-o` tests of the `[` command.  Use multiple `[` commands instead (or use `[[` if you can).  POSIX doesn't define the behavior of `[` with complex sets of tests, so you never know what you'll get.** 
  ```
  if [ "$food" = apple ] && [ "$drink" = tea ]; then
    echo "The meal is acceptable."
  fi
  ```

## Bash Conditional Loops

- `while command`
- `until command`
- `for variable in words`
- `for (( expression; expression; expression ))`

Each loop form is followed by the key word `do`, then one or more commands in the *body*, then the key word `done`.

```bash
$ while true
> do echo "Infinite loop"
> done
```
```bash
$ while ! ping -c 1 -W 1 1.1.1.1; do
> echo "still waiting for 1.1.1.1"
> sleep 1
> done
```
```bash
$ (( i=10 )); while (( i > 0 ))
> do echo "$i empty cans of beer."
> (( i-- ))
> done
$ for (( i=10; i > 0; i-- ))
> do echo "$i empty cans of beer."
> done
$ for i in {10..1}
> do echo "$i empty cans of beer."
> done
```

### for
As I mentioned before: `for` runs through a list of words and puts each one in the loop index  variable, one at a time, and then loops through the body with it. The  tricky part is how Bash decides what the words are.  Let me explain myself by expanding the braces from that previous example: 

```bash
$ for i in 10 9 8 7 6 5 4 3 2 1
> do echo "$i empty cans of beer."
> done
```

Bash takes the characters between `in` and the end of the line, and splits them up into words.  This splitting is done on spaces and tabs, just like argument splitting. However, if  there are any unquoted substitutions in there, they will be word-split as well (using [IFS](http://mywiki.wooledge.org/IFS)).  All these split-up words become the iteration elements. 

**As a result, be VERY careful not to make the following mistake:** 

```bash
$ ls
The best song in the world.mp3
$ for file in $(ls *.mp3)
> do rm "$file"
> done
rm: cannot remove 'The': No such file or directory
rm: cannot remove 'best': No such file or directory
rm: cannot remove 'song': No such file or directory
rm: cannot remove 'in': No such file or directory
rm: cannot remove 'the': No such file or directory
rm: cannot remove 'world.mp3': No such file or directory
```

Bash expands the [[Bash Command Subsitution|command substitution]] (`$(ls *.mp3)`), replaces it by its output, and *then* performs word splitting on it (because it was unquoted).

```bash
$ ls
The best song in the world.mp3  The worst song in the world.mp3
$ for file in "$(ls *.mp3)"
> do rm "$file"
> done
rm: cannot remove 'The best song in the world.mp3  The worst song in the world.mp3': No such file or directory
```

The quotes will protect **all the whitespace** from the output of `ls`. The output of `ls` is a simple string, and Bash treats it as such.  The `for` puts the whole quoted output in `i` and runs the `rm` command with it.

We should use [[Bash Globs|globs]]:

```bash
$ for file in *.mp3
> do rm "$file"
> done
```

### while

```bash
$ # The sweet machine; hand out sweets for a cute price.
$ while read -p $'The sweet machine.\nInsert 20c and enter your name: ' name
> do echo "The machine spits out three lollipops at $name."
> done
```
```bash
$ # Check your email every five minutes.
$ while sleep 300
> do kmail --check
> done
```
```bash
$ # Wait for a host to come back online.
$ while ! ping -c 1 -W 1 "$host"
> do echo "$host is still unavailable."
> done; echo -e "$host is available again.\a"
```

The `until` loop is barely ever used, if only because it is pretty much exactly the same as `while`.  We could rewrite our last example using an `until` loop: 

```bash
$ # Wait for a host to come back online.
$ until ping -c 1 -W 1 "$host"
> do echo "$host is still unavailable."
> done; echo -e "$host is available again.\a"
```

### continue & break
Lastly, you can use the `continue` builtin to skip ahead to the next iteration of a loop without executing the rest of the body, and the `break` builtin to jump out of the loop and continue with the script after it.  This works in both `for` and `while` loops. 


## Choices
### case

Look at a example taking a different branch of an [[Bash Conditional Blocks#if|if]] statement depending on the results of testing against a glob: 

```bash
shopt -s extglob

if [[ $LANG = en* ]]; then
    echo 'Hello!'
elif [[ $LANG = fr* ]]; then
    echo 'Salut!'
elif [[ $LANG = de* ]]; then
    echo 'Guten Tag!'
elif [[ $LANG = nl* ]]; then
    echo 'Hallo!'
elif [[ $LANG = it* ]]; then
    echo 'Ciao!'
elif [[ $LANG = es* ]]; then
    echo 'Hola!'
elif [[ $LANG = @(C|POSIX) ]]; then
    echo 'hello world'
else
    echo 'I do not speak your language.'
fi
```

Bash provides a keyword called `case` exactly for the above situation. 

```bash
case $LANG in
    en*) echo 'Hello!' ;;
    fr*) echo 'Salut!' ;;
    de*) echo 'Guten Tag!' ;;
    nl*) echo 'Hallo!' ;;
    it*) echo 'Ciao!' ;;
    es*) echo 'Hola!' ;;
    C|POSIX) echo 'hello world' ;;
    *)   echo 'I do not speak your language.' ;;
esac
```

Each choice in a `case` statement consists of a pattern (or a list of patterns with `|` between them), a right parenthesis, a block of code that is to be executed if the string matches one of those patterns, and two semi-colons to denote the end of the block of code (since you might need to write it on several lines).  A left parenthesis can be added to the left of the pattern.  Using `;&` instead of `;;` will grant you the ability to fall-through the `case` matching in bash, zsh and ksh.  `case` stops matching patterns as soon as one is successful. Therefore, we can use the `*` pattern in the end to match any case that has not been caught by the other choices. 

When a matching pattern is found and the `;&` operator is used after the block of code, the block of code for the  next choice will be executed too no matter if the pattern for that  choice matches or not. When the `;;&`  operator is used, instead of the block of code for the next choice, will be executed the block of code for the next matching pattern. 

### select
Another construct of choice is the `select` construct.  This statement smells like a [[Bash Conditional Loops|loop]] and is a convenience statement for generating a menu of choices that the user can choose from. 

The user is presented by choices and asked to enter a number reflecting his choice. The code in the `select` block is then executed with a variable set to the `choice` the user made. If the user's choice was invalid, the variable is made empty: 

```bash
$ echo "Which of these does not belong in the group?"; \
> select choice in Apples Pears Crisps Lemons Kiwis; do
> if [[ $choice = Crisps ]]
> then echo "Correct!  Crisps are not fruit."; break; fi
> echo "Errr... no.  Try again."
> done
```

The menu reappears so long as the `break` statement is not executed.

We can also use the `PS3` variable to define the prompt the user replies on. Instead of showing the question before executing the `select` statement, we could choose to set the question as our prompt: 

```bash
$ PS3="Which of these does not belong in the group (#)? "; \
> select choice in Apples Pears Crisps Lemons Kiwis; do
> if [[ $choice = Crisps ]]
> then echo "Correct!  Crisps are not fruit."; break; fi
> echo "Errr... no.  Try again."
> done
```

```bash
# A simple menu:
while true; do
    echo "Welcome to the Menu"
    echo "  1. Say hello"
    echo "  2. Say good-bye"

    read -p "-> " response
    case $response in
        1) echo 'Hello there!' ;;
        2) echo 'See you later!'; break ;;
        *) echo 'What was that?' ;;
    esac
done

# Alternative: use a variable to terminate the loop instead of an
# explicit break command.

quit=
while test -z "$quit"; do
    echo "...."
    read -p "-> " response
    case $response in
        ...
        2) echo 'See you later!'; quit=y ;;
        ...
    esac
done
```

# Arrays
Often, people make this mistake: 

```bash
# This does NOT work in the general case
$ files=$(ls ~/*.jpg); cp $files /backups/
```

When this would probably be a better idea: 

```bash
# This DOES work in the general case
$ files=(~/*.jpg); cp "${files[@]}" /backups/
```

The first attempt at backing up our files in the current directory is flawed. We put the output of `ls` in a string called `files` and then use the **unquoted** `$files` parameter expansion to cut that string into arguments (relying on *Word Splitting*). As mentioned before, argument and word splitting cuts a string into pieces wherever there is whitespace. Relying on it means we assume that none of our filenames will contain any whitespace.

The only safe way to represent **multiple** string elements in Bash is through the use of arrays.  An array is a type of variable that **maps integers to strings**. That basically means that it holds a numbered list of strings. Since each of these strings is a separate entity (element), it can safely contain any character, even whitespace. 

Unlike some other programming languages, Bash does not offer lists, tuples,  etc.  Just arrays, and [[Bash Arrays#Associative Arrays|associative arrays]] (which are new in Bash 4). 

### Creating Arrays
```bash
$ names=("Bob" "Peter" "$USER" "Big Bad John")
```

This syntax is great for creating arrays with static data or a known set of string parameters, but it gives us very little flexibility for adding lots of array elements. If you need more flexibility, you can also specify explicit indexes: 

```bash
$ names=([0]="Bob" [1]="Peter" [20]="$USER" [21]="Big Bad John")
# or...
$ names[0]="Bob"
```

Notice that there is a gap between indices 1 and 20 in this example. An array with holes in it is called a *sparse array*.

You can use [[Bash Globs|globs]] to fill an array with filenames:

```bash
$ photos=(~/"My Photos"/*.jpg)
```

Notice here that we quoted the `My Photos` part because it contains a space. Also notice that we quoted **only** the part that contained the space. That's because we cannot quote the `~` or the `*`; if we do, they'll become literal and Bash won't treat them as [[Bash Special characters|special characters]] anymore. 

Unfortunately, its really easy to **equivocally** create arrays with a bunch of filenames in the following way: 

```bash
$ files=$(ls)    # BAD, BAD, BAD!
$ files=($(ls))  # STILL BAD!
```

Remember to **always avoid** using `ls`. The first would create a **string** with the output of `ls`.  That string cannot possibly be used safely for reasons mentioned in the `Arrays` introduction. The second is closer, but it still splits up filenames with whitespace. This is the right way to do it: 

```bash
$ files=(*)
```

Now, sometimes we want to build an array from a string or the output of a command. Commands (generally) just output strings: for instance, running a [[Linux find|find]] command will enumerate filenames, and separate these filenames with newlines. So to parse that one big string into an array we need to tell Bash where each element ends.  But, filenames can **contain** a newline, so it is not safe to delimit them with newlines.

In the specific case of filenames, the answer to this problem is `NUL` bytes.  A `NUL` byte is a byte which is just all zeros: `00000000`. Bash strings can't contain NUL bytes, because of an artifact of the [[C|C programming language]]: NUL bytes are used in C to mark the end of a string. Since Bash is written in C and uses C's native strings, it inherits that behavior. 

A data stream (like the output of a command, or a file) can contain NUL bytes. Streams are like strings with three big differences: they are read sequentially; they're *unidirectional* (you can read from them, or write to them, but typically not both); and they can contain NUL bytes. 

File *names* cannot contain NUL bytes (since they're implemented as C strings by Unix). That makes NUL a great candidate for separating elements in a stream. Quite often, the command whose output you want to read will have an option that makes it output its data separated by NUL bytes rather than newlines or something else. [[Linux find|find]] (on GNU and BSD, anyway) has the option `-print0`, which we'll use in this example: 

```bash
$ files=()
$ while read -r -d ''; do
>     files+=("$REPLY")
> done < <(find /foo -print0)
```

- The first line `files=()` creates an empty array named `files`. 
- We're using a [[Bash Conditional Loops#while|while loop]] that runs a [[Linux read|read]] command each time. The `read` command uses the `-d ''` option to specify the delimiter and it interprets the empty string as a `NUL` byte (`\0`) (as Bash arguments can not contain NULs). It also uses `-r` to prevent it from treating backslashes specially. 
- Once `read` has read some data and encountered a NUL byte, the `while` loop's body is executed.  We put what we read (which is in the parameter `REPLY`) into our array. 
- To do this, we use the `+=()` syntax.  This syntax adds one or more element(s) to the end of our array. 
- Finally, the `< <(..)` syntax is a combination of [[Bash Redirection|File Redirection]] (`<`) and  [[Bash Input And Output#Process Substitution|Process Substitution]](`<(..)`). Omitting the technical details for now, we'll simply say that this is how we send the output of the `find` command into our `while` loop. 


> As an aside, check out [globstar](http://mywiki.wooledge.org/glob#globstar_.28since_bash_4.0-alpha.29) if you are using bash >= 4.0 and just want to recursively walk directories. 

## Using Arrays
### Expanding Elements

First of all, we can print the contents to see what's in it: 

```bash
$ declare -p myfiles
declare -a myfiles='([0]="/home/wooledg/.bashrc" [1]="billing codes.xlsx" [2]="hello.c")'
```

The [[Linux declare|declare]] `-p` command prints the contents of one or more variables, and shows you what Bash thinks the *type* of the variable is, and it does all of this using code that you could copy and paste into a script. In our case, the `-a` means this is an array.  There are three elements, with indices 0, 1 and 2, and we can see what each one contains. 

```bash
$ printf '%s\n' "${myfiles[@]}"
/home/wooledg/.bashrc
billing codes.xlsx
hello.c
```

This prints each array element, in order by index, with a newline after each one. Note that if one of the array elements happens to *contain* a newline character, we won't be able to tell where each element starts and ends, or even how many there are. That's why it's important to keep our data safely contained in the array as long as possible.

The syntax `"${myfiles[@]}"` is extremely important.  It works just like [[Bash Special characters|"$@"]] does for the positional parameters: it expands to a list of words, with each array element as *one* word, no matter what it contains. Even if there are spaces, tabs, newlines, quotation marks, or any other kind of characters in one of the array elements, it'll still be passed along as one word to whichever command we're running. 

The `printf` command implicitly loops over all of its arguments. But what if we wanted to do our own loop? In that case, we can use a [[Bash Conditional Loops|for loops]] to iterate over the elements: 

```bash
$ for file in "${myfiles[@]}"; do
>     cp "$file" /backups/
> done
```

We use the **quoted** form again here: `"${myfiles[@]}"`. Bash replaces this syntax with each element in the array properly  quoted – similar to how positional parameters (arguments that were  passed to the current script or function) are expanded. 

Remember to **quote** the `${arrayname[@]}` expansion properly, or else Bash will wordsplit them.

The above example expanded the array in a `for`-loop statement.  But you can expand the array anywhere you want to put its elements as arguments; for instance in a `cp` command: 

```bash
$ myfiles=(db.sql home.tbz2 etc.tbz2)
$ cp "${myfiles[@]}" /backups/
```

This runs the `cp` command, replacing the `"${myfiles[@]}"` part with every filename in the `myfiles` array, properly quoted.

You can also expand single array elements by referencing their element number (called **index**).  Remember that by default, arrays are *zero-based*, which means that their **first element** has the index **zero**: 

```bash
$ echo "The first name is: ${names[0]}"
$ echo "The second name is: ${names[1]}"
```

There is also a second form of expanding all array elements, which is `"${arrayname[*]}"`. This form is **ONLY** useful for converting arrays into a single string with all the elements joined together.  The main purpose for this is outputting the array to  humans, but notice that in the resulting string, there's no way to tell where the names begin and end:

```bash
$ names=("Bob" "Peter" "$USER" "Big Bad John")
$ echo "Today's contestants are: ${names[*]}"
Today's contestants are: Bob Peter lhunath Big Bad John
```

Remember to still keep everything nicely **quoted**!  If you don't keep `${arrayname[*]}` quoted, once again Bash's [WordSplitting](http://mywiki.wooledge.org/WordSplitting) will cut it into bits. 

You can combine `IFS` with `"${arrayname[*]}"` to indicate the character to use to delimit your array elements as you merge them into a single string.

```bash
$ names=("Bob" "Peter" "$USER" "Big Bad John")
$ ( IFS=,; echo "Today's contestants are: ${names[*]}" )
Today's contestants are: Bob,Peter,lhunath,Big Bad John
```

Notice how in this example we put the `IFS=,; echo ...` statement in a [[Bash Subshell|Subshell]] by wrapping `(` and `)` around it.  We do this because we don't want to change the default value of `IFS` in the main shell.  When the subshell exits, `IFS` still has its default value and no longer just a comma.  This is important because `IFS` is used for a lot of things, and changing its value to something  non-default will result in very odd behavior if you don't expect it! 

Alas, the `"${array[*]}"` expansion only uses the *first* character of `IFS` to join the elements together. If we wanted to separate the names in  the previous example with a comma and a space, we would have to use some other technique (for example, a `for` loop). 

One final tip: you can get the number of elements of an array by using `${#array[@]}` 

```bash
$ array=(a b c)
$ echo ${#array[@]}
3
```

### Expanding Indices

`"${!arrayname[@]}"` expands to a list of the *indices* of an array, in sequential order. 

Let's say we have two arrays: `first` and `last`.  These will hold the first names, and the last names, of a list of people.  Obviously we need to make sure that the first and last names of each person are properly matched up. 

```bash
$ first=(Jessica Sue Peter)
$ last=(Jones Storm Parker)
```

We'll loop over the indices of one of the arrays (arbitrarily chosen), and then use that same index in both arrays together: 

```bash
$ for i in "${!first[@]}"; do
> echo "${first[i]} ${last[i]}"
> done
Jessica Jones
Sue Storm
Peter Parker
```

Another feature worth mentioning is that the `[...]` around the index of an array actually creates an arithmetic context.  You can do math there, without wrapping it in `$((...))`.  

```bash
$ a=(a b c q w x y z)
$ for ((i=0; i<${#a[@]}; i+=2)); do
> echo "${a[i]} and ${a[i+1]}"
> done
```

### Sparse Arrays

An array can also have "holes" in the sequence. This can be done either by assigning directly to an index that's way out past the current end of the array, or by *removing* an element from an existing array. 

```bash
$ nums=(zero one two three four)
$ nums[70]="seventy"
$ unset 'nums[3]'
$ declare -p nums
declare -a nums='([0]="zero" [1]="one" [2]="two" [4]="four" [70]="seventy")'
```

Note that we quoted `'nums[3]'` in the `unset` command. This is because an *unquoted* `nums[3]` could be interpreted by Bash as a filename [[Bash Globs|glob]].


- Don't assume that your indices are sequential. 
- If the index values matter, always iterate over the indices instead of making assumptions about them. 
- If you loop over the values instead, don't assume anything about which index you might be on currently. 
- In particular, don't assume that just because you're currently in the first iteration of your loop, that you must be on index 0! 

When you expand the values of a sparse array using `"${arrayname[@]}"` you will get a list with no gaps in it.  There is no way to tell what kind of array these values came from. This can be useful if you want to *re-index* an array to remove all of the gaps: 

```bash
$ array=("${array[@]}")      # This re-creates the indices.
```

## Associative Arrays

To create an associative array, you need to declare it as such (using `declare -A`).  This is necessary, because otherwise bash doesn't know what kind of array you're trying to make.  Here's how you make an associative array: 

```bash
$ declare -A fullNames
$ fullNames=( ["lhunath"]="Maarten Billemont" ["greycat"]="Greg Wooledge" )
$ echo "Current user is: $USER.  Full name: ${fullNames[$USER]}."
Current user is: lhunath.  Full name: Maarten Billemont.
```

We can print the contents of an associative array very much like we did with regular arrays: 

```bash
$ declare -A dict
$ dict[astro]="Foo Bar"
$ declare -p dict
declare -A dict='([astro]="Foo Bar")'
```

Two things to remember, here:  First, the order of the keys you get back from an associative array using the `"${!array[@]}"` syntax is unpredictable; it won't necessarily be the order in which you assigned elements, or any kind of sorted order.  Likewise, if you expand the elements using `"${array[@]}"` you will get them in an unpredictable order.  Associative arrays are *not* well suited to storing lists that need to be processed in a specific order. 

Second, you cannot omit the `$` if you're using a parameter as the key of an associative array.  With standard indexed arrays, the `[...]` part is an arithmetic context. In an arithmetic context, a *Name* can't possibly be a valid number, and so BASH assumes it's a parameter and that you want to use its content.  This doesn't work with associative arrays, since a *Name* could just as well be a valid associative array key. 

```bash
$ indexedArray=( "one" "two" )
$ declare -A associativeArray=( ["foo"]="bar" ["alpha"]="omega" )
$ index=0 key="foo"
$ echo "${indexedArray[$index]}"
one
$ echo "${indexedArray[index]}"
one
$ echo "${indexedArray[index + 1]}"
two
$ echo "${associativeArray[$key]}"
bar
$ echo "${associativeArray[key]}"

$ echo "${associativeArray[key + 1]}"
```

As you can see, both `$index` and `index` work fine with indexed arrays. They both evaluate to `0`. You can even do math on it to increase it to `1` and get the second value. No go with associative arrays, though. Here, we need to use `$key`; the others fail.  

# Input And Output
Input to a Bash script can come from several different places: 

- Command-line arguments (which are placed in the [[Bash Special Parameter|positional parameters]]) 
- [[Bash Environment|Environment Variables]], inherited from whatever process started the script 
- Files 
- Anything else a [[Bash File Descriptor|File Descriptor]] can point to ([[Bash Pipes|Pipes]], terminals, [[Socket]]s, etc.).

Output from a Bash script can also go to lots of different places: 

- Files 
- Anything else a File Descriptor can point to 
- Command-line arguments to some other program 
- Environment variables passed to some other program 

## The Environment
Every program inherits certain information, resources, privileges and restrictions from its parent process. One of those resources is a set of variables called [[Environment Variables]]. 

Traditionally, environment variables have names that are all capital letters, such as `PATH` or `HOME`. So, the name of the variable you created should contain at least one lower-case letter.

Passing information to a program through the environment is useful in many situations. One of those is user preference, Such as `$EDITOR`, `$LOCALE`, etc.

When you run a command in Bash, you have the option of specifying a temporary environment change which only takes effect for the duration of that command. This is done by putting `VAR=value` **in front of the command**.

```bash
$ ls /tpm
ls: no se puede acceder a /tpm: No existe el fichero o el directorio
$ LANG=C ls /tpm
ls: cannot access /tpm: No such file or directory
```

If you want to put information into the environment for your child processes to inherit, you use the `export` command: 

```bash
export MYVAR=something
```

The tricky part here is that your environment changes are only inherited by your **descendants**.  You can't change the environment of a program that is already running, or of a program that you don't run. 

## File Descriptor

[[File Descriptor]]s are the way programs refer to files, or to other resources that work like files (such as [[Pipe|pipes]], devices, [[Socket|sockets]], or terminals). FDs are kind of like pointers to sources of data, or places data can be written. When something reads from or writes to that FD, the data is read from or written to that FD's resource. 

By default, every new process starts with three open FDs: 

- [[Standard Input]] (`stdin`): File Descriptor 0 
- [[Standard Output]] (`stdout`): File Descriptor 1 
- [[Standard Error]] (`stderr`): File Descriptor 2 

In an interactive shell, or in a script running on a terminal, the *Standard Input* is how bash sees the characters you type on your keyboard. The *Standard Output* is where the program sends most of its normal information so that the user can see it, and the *Standard Error* is where the program sends its error messages. 

GUI applications also have these FDs, but they don't normally work with them. Usually, they do all their user interaction via the GUI, making it hard for Bash to control them.

```bash
$ read -p "What is your name? " name; echo "Good day, $name.  Would you like some tea?"
What is your name? lhunath
Good day, lhunath.  Would you like some tea?
```

`read` is a command that reads information from `stdin` and stores it in a variable. We specified `name` to be that variable.  Once `read` has read a line of information from `stdin`, it finishes and lets `echo` display a message. `echo` sends its output to `stdout`. `stdin` and `stdout` are connected to your terminal. When a program reads from a terminal, it receives keystrokes from your keyboard; when it writes to a terminal, characters are displayed on your monitor. 

```bash
$ rm secrets
rm: cannot remove `secrets': No such file or directory
```

`stderr` is also connected to your terminal's output device, and error messages display on your monitor just like the messages on `stdout`. However, the distinction between `stdout` and `stderr` makes it easy to keep errors separated from the application's normal messages. 

## Bash Redirection

---

The most basic form of input/output manipulation in BASH is *Redirection*. *Redirection* is used to change the data source or destination of a program's [[Bash File Descriptor|FDs]]. That way, you can send output to a file instead of the terminal, or have an application read from a file instead of from the keyboard. 

Redirections are performed by BASH (or any other shell), **before** the shell runs the command to which the redirections are applied. 

### File Redirection

*File Redirection* involves changing a single FD to point to a file.

```bash
$ echo "It was a dark and stormy night.  Too dark to write." > story
$ cat story
It was a dark and stormy night.  Too dark to write.
```

The `>` operator begins an *output redirection*. The redirection applies only to one command. It tells BASH that when BASH runs the command, `stdout` should point to a file, rather than wherever it was pointing before. 

As a result, the `echo` command will not send its output to the terminal; rather, the `> story` redirection **changes the destination of the `stdout` FD** so that it now points to a file called `story`. Be aware that this redirection occurs before the `echo` command is executed. By default, Bash doesn't check to see whether that file `story` exists first; it just opens the file, and if there was already a file by that name, its former contents are lost. If the file doesn't exist, it is created as an empty file, so that the FD can be pointed to it. This behaviour can be toggled with *Shell Options*. 

When we use `cat` without passing any kind of arguments, `cat` will read from `stdin` instead of from a file. Anything you type on your keyboard now will be sent to `cat` as soon as you hit the *Enter* key. With each line you type, `cat` will do what it normally does: display it reads on `stdout`, the same way as when it displayed our story on `stdout`. 

```bash
$ cat
test?
test?
```

You can press *Ctrl+D* to send your terminal the *End of File* character. That'll cause `cat` to think `stdin` has closed. It will stop reading, and terminate. BASH will see that `cat` has terminated, and return you to your prompt. 

We can use an *input redirection* to attach a file to `stdin`, so that `stdin` is no longer reading from our keyboard, but instead, now reads from the file: 

```bash
$ cat < story
The story of William Tell.

It was a cold december night. Too cold to write.
```

Redirection operators can be preceded by a number. That number denotes the FD that will be changed. 

- **`command < file`** or **`command 0< file`**: Use the contents of `file` when `command` reads from `stdin`. 
- **`command > file`** or **`command 1> file`**: Send the `stdout` of command to `file`. 

The number for the `stderr` FD is 2. So, let's try sending `stderr` to a file: 

```bash
$ for homedir in /home/*
> do rm "$homedir/secret"
> done 2> errors
```

Our redirection operator isn't on `rm`, but it's on that `done` thing. Well, this way, the redirection applies to all output to `stderr` made inside the whole loop. Technically, what happens is BASH opens the file named `errors` and points `stderr` to it **before** the loop begins, then closes it when the loop ends. Any commands run inside the loop *inherit* the open FD from BASH. 

If you're writing a script, and you expect that running a certain command may fail on occasion, but don't want the script's user to be bothered by the possible error messages that command may produce, you can silence a FD. Silencing it is as easy as normal *File Redirection*. We're just going to send all output to that FD into the system's black hole: 

```bash
$ for homedir in /home/*
> do rm "$homedir/secret"
> done 2> /dev/null
```

The file `/dev/null` is **always** empty, it's not a normal file; it's a *virtual* device. Some people call `/dev/null` the *bit bucket*. 

`>>` will not empty a file, it will just append new data to the end of it! 

```bash
$ for homedir in /home/*
> do rm "$homedir/secret"
> done 2>> errors
```

> [!note]
> It's a good idea to use redirection whenever an application needs file data and is built to read data from `stdin`. A lot of bad examples on the Internet tell you to pipe (see later) the output of `cat` into processes; but this is nothing more than a very \*bad\* idea. 
   When designing an application that could be fed data from a variety of different sources, it is often best simply to have your application read from `stdin`; that way, the user can use redirection to feed it whatever data she wishes. An application that reads standard input in a generalized way is called a \*filter\*.** 
> 

#### File Descriptor Manipulation

It's possible to change the source and destination of FDs to point to or from files, as you know. It's also possible to copy one FD to another. Let's prepare a simple testbed: 

```bash
$ echo "I am a proud sentence." > file
```

Just like `cat`, `grep` also uses `stdin` if you don't specify any files. `grep` reads the files (or `stdin` if none were provided) and searches for the *search pattern* you gave it. Most versions of `grep` even support a `-r` switch, which makes it take directories as well as files as extra arguments, and then searches all the files and directories in those directories that you gave it. Here's an example of how `grep` can work: 

```bash
$ ls house/
drawer  closet  dustbin  sofa
$ grep -r socks house/
house/sofa:socks
```

```bash
$ grep "$HOSTNAME" /etc/*
/etc/hosts:127.0.0.1       localhost Lyndir
```

Let's use `grep` to find where that proud sentence is now: 

```bash
$ grep proud *
file:I am a proud sentence.
```

Now let's see if we can make `grep` send an error message, too: 

```bash
$ grep proud file 'not a file'
file:I am a proud sentence.
grep: not a file: No such file or directory
```

We'd like to send all the output that appears on the terminal to a file instead; let's call it `proud.log`: 

```bash
# Not quite right....
$ grep proud file 'not a file' > proud.log 2> proud.log
```

If you run this command (at least on some computers), and then look in `proud.log`, you'll see there's only an error message, not the output from `stdout`. We've created two FDs that both point to the same file, independently of each other. The results of this are not well-defined. Depending on how the operating system handles FDs, some information written via one FD may clobber information written through the other FD. 

```bash
$ echo "I am a very proud sentence with a lot of words in it, all for you." > file2
$ grep proud file2 'not a file' > proud.log 2> proud.log
$ cat proud.log
grep: not a file: No such file or directory
of words in it, all for you.
```

What happened here? `grep` opened `file2` first, found what we told it to look for, and then wrote our very proud sentence to `stdout` (FD 1). FD 1 pointed to `proud.log`, so the information was written to that file. However, we also had another FD (FD 2) pointed to this same file, and specifically, pointed to the *beginning* of this file. When `grep` tried to open '`not a file`' to read it, it couldn't. Then, it wrote an error message to `stderr` (FD 2), which was pointing to the beginning of `proud.log`. As a result, the second write operation overwrote information from the first one! 

We need to prevent having two independent FDs working on the same destination or source. We can do this by *duplicating* FDs: 

```bash
$ grep proud file 'not a file' > proud.log 2>&1
```

In order to understand these, you need to remember: always read file redirections from left to right. This is the order in which Bash processes them. First, `stdout` is changed so that it points to our `proud.log`. Then, we use the `>&` syntax to duplicate FD 1 and put this duplicate in FD 2. 

A duplicate FD works differently from having two independent FDs pointing to the same place. Write operations that go through either one of them are exactly the same. There won't be a mix-up with one FD pointing to the start of the file while the other has already moved on. 

Be careful not to confuse the order: 

```bash
$ grep proud file 'not a file' 2>&1 > proud.log
```

This will duplicate `stderr` to where `stdout` points (which is the terminal), and then `stdout` will be redirected to `proud.log`. As a result, `stdout`'s messages will be logged, but the error messages will still go to the terminal. *Oops.* 

For convenience, Bash also makes yet another form of redirection available to you. The `&>` redirection operator is actually just a shorter version of what we did here; redirecting both `stdout` and `stderr` to a file:
```bash
$ grep proud file 'not a file' &> proud.log
```

This is the same as `> proud.log 2>&1`, but not portable to [BourneShell](http://mywiki.wooledge.org/BourneShell). It is not recommended practice, but you should recognize it if you see it used in someone else's scripts. 

***TODO: Moving FDs and Opening FDs RW.*** 

### Heredocs And Herestrings

Sometimes storing data in a file is overkill. We might only have a tiny bit of it -- enough to fit conveniently in the script itself. Or we might want to redirect the contents of a variable into a command, without having to write it to a file first. 

```bash
$ grep proud <<END
> I am a proud sentence.
> END
I am a proud sentence.
```

This is a *Heredoc* (or *Here Document*). *Heredoc*s are useful if you're trying to embed short blocks of multi-line data inside your script. (Embedding larger blocks is bad practice. You should keep your logic and your input separated, preferably in different files, unless it's a small data set.) 

In a *Heredoc*, we choose a word to act as a sentinel. It can be any word; we used `END` in this example. Choose one that won't appear in your data set. All the lines that follow the *first* instance of the sentinel, up to the *second* instance, become the `stdin` for the command. The second instance of the sentinel word has to be a line all by itself. 

There are a few different options with *Heredocs*. Normally, you can't indent them -- any spaces you use for indenting your script will appear in the `stdin`. The terminator string (in our case `END`) must be at the beginning of the line. 

```bash
echo "Let's test abc:"
if [[ abc = a* ]]; then
    cat <<END
        abc seems to start with an a!
END
fi
```

Will result in: 

```bash
Let's test abc:
        abc seems to start with an a!
```

You can avoid this by temporarily removing the indentation for the lines of your *Heredoc*s. However, that distorts your pretty and consistent indentation. There is an alternative. If you use `<<-END` instead of `<<END` as your *Heredoc* operator, Bash removes any `tab` characters in the beginning of each line of your *Heredoc* content before sending it to the command. That way you can still use tabs (but not spaces) to indent your *Heredoc* content with the rest of your code. Those tabs will not be sent to the command that receives your *Heredoc*. You can also use tabs to indent your sentinel string. 

Bash substitutions are performed on the contents of the *Heredoc* by default. However, if you quote the word that you're using to delimit your *Heredoc*, Bash won't perform any substitutions on the contents. Try this example with and without the quote characters, to see the difference: 

```bash
$ cat <<'XYZ'
> My home directory is $HOME
> XYZ
My home directory is $HOME
```

The most common use of *Heredocs* is dumping documentation to the user: 

```bash
usage() {
    cat <<EOF
usage: foobar [-x] [-v] [-z] [file ...]
A short explanation of the operation goes here.
It might be a few lines long, but shouldn't be excessive.
EOF
}
```

Now let's check out the very similar but more compact *Herestring*: 

```bash
$ grep proud <<<"I am a proud sentence"
I am a proud sentence.
```

This time, `stdin` reads its information straight from the string you put after the `<<<` operator. This is very convenient to send data that's in variables into processes: 

```bash
$ grep proud <<<"$USER sits proudly on his throne in $HOSTNAME."
lhunath sits proudly on his throne in Lyndir.
```

*Herestring*s are shorter, less intrusive and overall more convenient than their bulky *Heredoc* counterpart. However, they are not portable to the Bourne shell. 

Many people use pipes to send the output of a variable as `stdin` into a command. However, for this purpose, *Herestring*s should be preferred. They do not create a subshell and are lighter both to the shell and to the style of your shell script: 

```bash
$ echo 'Wrap this silly sentence.' | fmt -t -w 20
Wrap this silly
   sentence.
$ fmt -t -w 20 <<< 'Wrap this silly sentence.'
Wrap this silly
   sentence.
```

Technically, *Heredocs* and *Herestrings* are themselves redirects just like any other. As such, additional redirections can occur on the same line, all evaluated in the usual order. 

```bash
$ cat <<EOF > file
> My home dir is $HOME
> EOF
$ cat file
My home dir is /home/greg
```


- **Good Practice: 
   Long heredocs are usually a bad idea because scripts should contain logic, not data. If you have a large document that your script needs, you should ship it in a separate file along with your script. Herestrings, however, come in handy quite often, especially for sending variable content (rather than files) to filters like `grep` or `sed`.** 

## Pipes
If you want to connect the output of one application directly to the input of another, you could build a sort of chain to process output. If you already know about [[FIFO]]s, you could use something like this to that end: 

```bash
$ ls
$ mkfifo myfifo; ls
myfifo
$ grep bea myfifo &
[1] 32635
$ echo "rat
> cow
> deer
> bear
> snake" > myfifo
bear
```

We use the `mkfifo` command to create a new file in the current directory named '`myfifo`'. This is no ordinary file, however, but a `FIFO`.  `FIFO`s are special files that serve data on a `First In, First Out`-basis. When you read from a `FIFO`, you will only receive data as soon as another process writes to it.  As such, a `FIFO` never really contains any data. So long as no process writes to it, any read operation on the `FIFO` will **block** as it waits for data to become available.  The same works for writes to the `FIFO` -- they will block until another process reads from the `FIFO`. 

In our example, the `FIFO` called `myfifo` is read from by `grep`.  `grep` waits for data to become available on the `FIFO`.  That's why we append the grep command with the `&` operator, which puts it in the background. That way, we can continue typing and executing commands while `grep` runs and waits for data.  Our `echo` statement feeds data to the `FIFO`.  As soon as this data becomes available, the running `grep` command reads it in and processes it. The result is displayed. We have successfully sent data from the `echo` command to the `grep` command. 

But these temporary files are a real annoyance. You may not have write permissions. You need to remember to clean up any temporary files you create. You need to make sure that data is going in and out, or the `FIFO` might just end up blocking for no reason. 

For these reasons, another feature is made available: *Pipes*.  A pipe basically just connects the `stdout` of one process to the `stdin` of another, effectively *piping* the data from one process into another. The entire set of commands that are piped together is called a *pipeline*. 

```bash
$ echo "rat
> cow
> deer
> bear
> snake" | grep bea
bear
```

The pipe is created using the `|` operator between two commands that are connected with the pipe. The former command's `stdout` is connected to the latter command's `stdin`.

Pipes are widely used as a means of post-processing application output.  `FIFO`s are, in fact, also referred to as `named pipes`.  They accomplish the same results as the pipe operator, but through a filename. 

**The pipe operator creates a subshell environment for each command. This is important to know because any variables that you modify or initialize inside the second command will appear unmodified outside of it.**

```bash
$ message=Test
$ echo 'Salut, le monde!' | read message
$ echo "The message is: $message"
The message is: Test
$ echo 'Salut, le monde!' | { read message; echo "The message is: $message"; }
The message is: Salut, le monde!
$ echo "The message is: $message"
The message is: Test
```

- **Good Practice: 
   Pipes are a very attractive means of post-processing application output. You should, however, be careful not to over-use pipes.  If you end up making a pipeline that consists of three or more applications, it is time to ask yourself whether you're doing things a smart way.  You  might be able to use more application features of one of the  post-processing applications you've used earlier in the pipe.  Each new  command in a pipeline causes a new subshell and a new application to be loaded.  It also makes it very hard to follow the logic in your script!** 


## Miscellaneous Operators
### Process Substitution

A cousin of the pipe is the *Process Substitution* operator, which comes in two forms: `<(cmd)` and `>(cmd)`.  It's a convenient way to get the benefits of temporary files or named pipes without having to create them yourself. Whenever you think you  need a temporary file to do something, process substitution might be a  better way to handle it. 

The `>()` form is relatively rare, and we won't cover it here, because it'll just confuse things. Once you understand how `<()` works, `>()` just does the same thing in reverse (writing instead of reading). 

What `<()` does, is run the command inside the parentheses, and gives you a temporary filename that you can use to read the command's output.  The advantage over pipes is that you can use the filename as an argument to a command that expects to see a filename. 

For example, let's say you have two files that you'd like to `diff`, but they aren't sorted yet.  You could generate two temporary files, to hold the sorted versions of your original files, and then run `diff` on those.  Or, you could use process substitutions: 

```bash
$ diff <(sort file1) <(sort file2)
```

With the `<()` operator, the command's output is sent through a named pipe (or something similar) that's created by bash.  The operator itself in your command is replaced by the filename of that file.  After your whole command finishes, the file is cleaned up. 

The same thing can be done with any commands whose output you'd like to pass to `diff`.  Imagine you want to see the difference between the output of two commands.  Ordinarily, you'd have to put the two outputs in two files  and `diff` those: 

```bash
$ head -n 1 .dictionary > file1
$ tail -n 1 .dictionary > file2
$ diff -y file1 file2
Aachen                                                        | zymurgy
$ rm file1 file2
```

Using the process substitution operator, we can do all that with a one-liner and no need for manual cleanup: 

```bash
$ diff -y <(head -n 1 .dictionary) <(tail -n 1 .dictionary)
Aachen                                                        | zymurgy
```

The `<(..)` part is replaced by the temporary FIFO created by bash, so `diff` actually sees something like this: 

```bash
$ diff -y /dev/fd/63 /dev/fd/62
```

The actual implementation differs from system to system.  In fact, you can see what the above would actually look like to `diff` on your box by putting an `echo` in front of our command: 

```bash
box1$ echo diff -y <(head -n 1 .dictionary) <(tail -n 1 .dictionary)
diff -y /dev/fd/63 /dev/fd/62
```

```bash
box2$ echo <(cat /dev/null)
/var/tmp//sh-np-605454726
```

For examples using the `>()` form, see [ProcessSubstitution](http://mywiki.wooledge.org/ProcessSubstitution) and [Bash FAQ 106](http://mywiki.wooledge.org/BashFAQ/106). 

- **Good Practice: 
   Process Substitution gives you a concise way to create temporary FIFOs  automatically. They're less flexible than creating your own named pipes by hand, but they're perfect for common short commands like `diff` that need filenames for their input sources.**
   
# Compound Commands

---

Bash has constructs called *compound commands*, which is a catch-all phrase covering several different concepts. We've already seen some of the compound commands. Bash has to offer -- `if` statements, `for` loops, `while` loops, the `[[` keyword, `case` and `select`.  We won't repeat that information again here. Instead, we'll explore  the other compound commands we haven't seen yet: subshells, command grouping, and arithmetic evaluation. 

In addition, we'll look at *functions* and *aliases*, which aren't compound commands, but which work in a similar way. 

## Subshells
A [SubShell](http://mywiki.wooledge.org/SubShell) is similar to a child process, except that more information is inherited. Subshells are created implicitly for each command in a pipeline. They are also created explicitly by using parentheses around a command: 

```bash
$ (cd /tmp || exit 1; date > timestamp)
$ pwd
/home/lhunath
```

When the subshell terminates, the `cd` command's effect is gone -- we're back where we started. Likewise, any variables that are set during the subshell are not remembered. You can think of subshells as temporary shells. 

Note that if the `cd` failed in that example, the `exit 1` would have terminated the subshell, but *not* our interactive shell.

## Command Grouping
We've already touched on this subject in [Grouping Statements](http://mywiki.wooledge.org/BashGuide/TestsAndConditionals#Grouping_Statements), though it pays to repeat it in the context of this chapter. 

Commands may be grouped together using curly braces. Command groups allow a collection of commands to be considered as a whole with regards to redirection and control flow. All compound commands such as if statements and while loops do this as well, but command groups do *only* this. In that sense, command groups can be thought of as "null compound commands" in that they have no effect other than to group commands. They look a bit like subshells, with the difference being that command  groups are executed in the same shell as everything else, rather than a new one. This is both faster and allows things like variable assignments to be visible outside of the command group. 

All commands within a command group are within the scope of any redirections applied to a command group (or any compound command): 

```bash
$ { echo "Starting at $(date)"; rsync -av . /backup; echo "Finishing at $(date)"; } >backup.log 2>&1
```

The above example truncates and opens the file backup.log on stdout, then points stderr at where stdout is currently pointing (backup.log), then runs each command with those redirections applied. The file descriptors remain open until all commands within the command group complete before they are automatically closed. This means backup.log is only opened a single time, not opened and closed for each command. The next example demonstrates this better: 

```bash
$ echo "cat
> mouse
> dog" > inputfile
$ for var in {a..c}; do read -r "$var"; done < inputfile
$ echo "$b"
mouse
```

Notice how we didn't actually use a command group here. As previously explained, "for" being a compound command behaves just like a command group. It would have been extremely difficult to read the second line from a file without allowing for multiple `read` commands to read from a single open FD without rewinding to the start each time. Contrast with this: 

```bash
$ read -r a < inputfile
$ read -r b < inputfile
$ read -r c < inputfile
$ echo "$b"
cat
```

Command groups are also useful to shorten certain common tasks: 

```bash
$ [[ -f $CONFIGFILE ]] || { echo "Config file $CONFIGFILE not found" >&2; exit 1; }
```

The logical "or" now executes the command group if `$CONFIGFILE` doesn't exist rather than just the first simple command. A subshell would not have worked here, because the `exit 1` in a command group terminates the entire shell. 

Compare that with a differently formatted version: 

```bash
$ if [[ ! -f $CONFIGFILE ]]; then
> echo "Config file $CONFIGFILE not found" >&2
> exit 1
> fi
```

If the command group is on a single line, as we've shown here, then there *must* be a **semicolon** before the closing `}`, ( i.e `{ ...; last command ; }` ) otherwise, Bash would think `}` is an argument to the final command in the group.  If the command group is spread across multiple lines, then the semicolon may be replaced by a **newline**: 

```bash
$ {
>  echo "Starting at $(date)"
>  rsync -av . /backup
>  echo "Finishing at $(date)"
> } > backup.log 2>&1
```

If redirections are used on a simple command, they only apply to the command itself, not parameter or other expansions. Command groups make all contents including expansions apply even in the case of a single simple command: 

```bash
$ { echo "$(cat)"; } <<<'hi'
hi
$ { "$(</dev/stdin)" <<<"$_"; } <<<'cat'
hi
```

The second command (which you don't need to fully understand) would require killing the shell if the command group weren't present, since the shell would be reading from the tty to determine the command to execute. It  also illustrates that the command still gets the redirect applied to it, while the expansion gets that of the command group. 

## Arithmetic Evaluation
The first way is the `let` command: 

```bash
$ unset a; a=4+5
$ echo $a
4+5
$ let a=4+5
$ echo $a
9
```

You may use spaces, parentheses and so forth, if you quote the expression: 

```bash
$ let a='(5+2)*3'
```

For a full list of operators availabile, see `help let` or the manual. 

Next, the actual *arithmetic evaluation* compound command syntax: 

```bash
$ ((a=(5+2)*3))
```

This is equivalent to `let`, but we can also use it as a *command*, for example in an `if` statement: 

```bash
$ if (($a == 21)); then echo 'Blackjack!'; fi
```

Operators such as `==`, `<`, `>` and so on cause a comparison to be performed, inside an arithmetic evaluation.  If the comparison is "true" (for example, `10 > 2` is true in arithmetic -- but not in strings!) then the compound command exits with status 0.  If the comparison is false, it exits with status  1.  This makes it suitable for testing things in a script. 

Although not a compound command, an *arithmetic substitution* (or *arithmetic expression*) syntax is also available: 

```bash
$ echo "There are $(($rows * $columns)) cells"
```

Inside `$((...))` is an *arithmetic context*, just like with `((...))`, meaning we do arithmetic instead of string manipulations (concatenating `$rows`, space, asterisk, space, `$columns`).  `$((...))` is also portable to the POSIX shell, while `((...))` is not. 

Among them are the ternary operator: 

```bash
$ ((abs = (a >= 0) ? a : -a))
```

and the use of an integer value as a truth value: 

```bash
$ if ((flag)); then echo "uh oh, our flag is up"; fi
```

Note that we used variables inside `((...))` without prefixing them with `$`-signs.  This is a special syntactic shortcut that Bash allows inside arithmetic evaluations and arithmetic expressions. 

There is one final thing we must mention about `((flag))`.  Because the inside of `((...))` is C-like, a variable (or expression) that evaluates to *zero* will be considered *false* for the purposes of the arithmetic evaluation. Then, because the evaluation is false, it will *exit* with a status of 1.  Likewise, if the expression inside `((...))` is *non-zero*, it will be considered *true*; and since the evaluation is true, it will *exit* with status 0.  This is potentially *very* confusing, even to experts, so you should take some time to think about this.  Nevertheless, when things are used the way they're intended, it makes sense in the end: 

```bash
$ flag=0      # no error
$ while read line; do
>   if [[ $line = *err* ]]; then flag=1; fi
> done < inputfile
$ if ((flag)); then echo "oh no"; fi
```

## Bash Functions
Functions are blocks of commands, much like normal scripts you might write, except they don't reside in  separate files, and they don't cause a separate process to be executed.  However, they take arguments just like scripts -- and unlike scripts,  they can affect variables inside your script, if you want them to.

```bash
#!/bin/bash
open() {
    case "$1" in
        *.mp3|*.ogg|*.wav|*.flac|*.wma) xmms "$1";;
        *.jpg|*.gif|*.png|*.bmp)        display "$1";;
        *.avi|*.mpg|*.mp4|*.wmv)        mplayer "$1";;
    esac
}
for file; do
    open "$file"
done
```

Here, we define a *function* named `open`.  This function is a block of code that takes a single argument, and based on the *pattern* of that argument, it will either run `xmms`, `display` or `mplayer` with that argument.  Then, a `for` loop iterates over all of the *script's* positional parameters.  (Remember, `for file` is equivalent to `for file in "$@"` and both of them iterate over the full set of positional parameters.)  The `for` loop calls the `open` function for each parameter. 

As you may have observed, the function's parameters are different from the script's parameters. 

Functions may also have *local variables*, declared with the `local` or `declare` keywords. This lets you do work without potentially overwriting  important variables from the caller's namespace.  For example, 

```bash
#!/bin/bash
count() {
    local i
    for ((i=1; i<=$1; i++)); do echo $i; done
    echo 'Ah, ah, ah!'
}
for ((i=1; i<=3; i++)); do count $i; done
```

The `local` variable `i` inside the function is stored differently from the variable `i` in the outer script.  This allows the two loops to operate without interfering with each other's counters. 

Functions may also call themselves *recursively*.

## Bash Aliases
Aliases are superficially similar to functions at first glance, but upon closer examination, they have entirely different behavior. 

- Aliases do not work in scripts, at all. They only work in interactive shells. 
- Aliases cannot take arguments. 
- Aliases will not invoke themselves recursively. 
- Aliases cannot have local variables. 

Aliases are essentially keyboard shortcuts intended to be used in `.bashrc` files to make your life easier.  They usually look like this: 

```bash
$ alias ls='ls --color=auto'
```

Bash checks the **first word** of every simple command to see whether it's an *alias*, and if so, it does a simple text replacement. Thus, if you type 

```bash
$ ls /tmp
```

Bash acts as though you had typed 

```bash
$ ls --color=auto /tmp
```

If you wanted to duplicate this functionality with a function, it would look like this: 

```bash
$ unalias ls
$ ls() { command ls --color=auto "$@"; }
```

As with a *command group*, we need a `;` before the closing `}` of a function if we write it all in one line. The special built-in command `command` tells our function **not** to call itself recursively; instead, we want it to call the `ls` command that it would have called if there hadn't been a function by that name. 

Aliases are useful as long as you don't try to make them work like functions. If you need complex behavior, use a function instead. 




## Destroying Constructs

To remove a function or variable from your current shell environment use the `unset` command. It is usually a good idea to be explicit about whether a function or variable is to be unset using the `-f` or `-v` flags respectively. If unspecified, variables take precedence over functions. 

```bash
$ unset -f myfunction
$ unset -v 'myArray[2]' # unset element 2 of myArray. The quoting is important to prevent globbing.
```

To remove an alias, use the *unalias* command. 

```
$ unalias rm
```

# Sourcing
When you call one script from another, the new script inherits the environment of the original script. Explaining what this means is out of the scope of this guide, but for the most part you can consider the environment to be the current working directory, open file descriptors, and environment variables, which you can view using the `export` command. 

When the script that you ran (or any other program, for that matter) finishes executing, its environment is discarded. The environment of the first script will be same as it was before the second script was called, although of course some of bash's special parameters may have changed (such as the value of `$?`, the return value of the most recent command). This means, for example, you can't simply run a script to change your current working directory for you. 

What you can do is to *source* the script, instead of running it as a child. You can do this using the `.` (dot) command: 

```bash
. ./myscript   #runs the commands from the file myscript in this environment
```

This is often called *dotting in* a script. The `.` tells [BASH](http://mywiki.wooledge.org/BASH) to read the commands in `./myscript` and run them in the current shell environment. Since the commands are run in the current shell, they can change the current shell's variables, working directory, open file descriptors, functions, etc. 

Note that Bash has a second name for this command, `source`, but since this works identically to the `.` command, it's probably easier to just forget about it and use the `.` command, as that will work everywhere.  

# Job Control

---

Though not typically used in scripts, job control is very important in interactive shells. Job control allows you to interact with background jobs, suspend foreground jobs, and so on. 

## Theory

On Posix systems, jobs are implemented as "process groups", with one process  being the leader of the group.  Each tty (terminal) has a single "foreground process group" that is allowed to interact with the terminal. All other process groups with the same controlling tty are considered background jobs, and can be either running or suspended. 

A job is suspended when its process group leader receives one of the signals `SIGSTOP`, `SIGTSTP`, `SIGTTIN`, or `SIGTTOU`. `SIGTTIN` (and `SIGTTOU`, if the user issued `stty tostop`) are automatically sent whenever a background job tries to read from or write to the terminal---this is why `cat &` is immediately suspended rather than running in the background.   

Certain keypresses at the terminal cause signals to be sent to all processes in the foreground process group.  These can be configured with `stty`, but are usually set to the defaults: 

- Ctrl-Z sends `SIGTSTP` to the foreground job (usually suspending it) 
- Ctrl-C sends `SIGINT` to the foreground job (usually terminating it) 
- Ctrl-\ sends `SIGQUIT` to the foreground job (usually causing it to dump core and abort) 

## Practice

Job control is on by default in interactive shells. It can be turned on for scripts with `set -m` or `set -o monitor`. 

A foreground job can be suspended by pressing Ctrl-Z. There is no way to refer to the foreground job in `bash`: if there is a foreground job other than bash, then bash is waiting for  that job to terminate, and hence cannot execute any code (even traps are delayed until the foreground job terminates).  The following commands,  therefore, work on background (and suspended) jobs only. 

Job control enables the following commands: 

- **`fg`** [*jobspec*]: bring a background job to the foreground. 
- **`bg`** [*jobspec* ...]: run a suspended job in the background. 
- **`suspend`**: suspend the shell (mostly useful when the parent process is a shell with job control). 

Other commands for interacting with jobs include: 

- **`jobs`** [*options*] [*jobspec* ...]: list suspended and background jobs.  Options include `-p` (list process IDs only), `-s` (list only suspended jobs), and `-r` (list only running background jobs).  If one or more jobspecs are specified, all other jobs are ignored. 
- **`kill`** can take a jobspec instead of a process ID. 
- **`disown`** tells `bash` to forget about an existing job.  This keeps bash from automatically sending `SIGHUP` to the processes in that job, but also means it can no longer be referred to by jobspec. 

So, what does all that mean?  Job control allows you to have multiple  things going on within a single terminal session.  (This was terribly  important in the old days when you only had one terminal on your desk,  and no way to create virtual terminals to add more.)  On modern systems  and hardware, you have more choices available -- you could for example  run `screen` or `tmux` within a terminal to give you virtual terminals.  Or within an X session, you could open more `xterm` or similar terminal emulators (and you can mix the two together as well). 

But sometimes, a simple job control "suspend and background" comes in  handy.  Maybe you started a backup and it's taking longer than you  expected.  You can suspend it with Ctrl-Z and then put it in the  background with `bg`, and get your shell prompt  back, so that you can work on something else in the same terminal  session while that backup is running. 

## Job Specifications

A job specification or "jobspec" is a way of referring to the processes that make up a job.  A jobspec may be: 

- **`%`\*n\***  to refer to job number *n*. 
- **`%`\*str\***  to refer to a job which was started by a command beginning with *str*.  It is an error if there is more than one such job. 
- **`%?`\*str\***  to refer to a job which was started by a command containing *str*.  It is an error if there is more than one such job. 
- **`%%`** or **`%+`** to refer to the current job: the one most recently started in the background, or suspended from the foreground.  `fg` and `bg` will operate on this job if no **jobspec** is given. 
- **`%-`** for the previous job (the job that was `%%` before the current one). 

It is possible to run an arbitrary command with a jobspec, using `jobs -x ''cmd args...''`.  This replaces arguments that look like jobspecs with the PIDs of the  corresponding process group leaders, then runs the command.  For  example, `jobs -x strace -p %%` will attach `strace` to the current job (most useful if it is running in the background rather than suspended). 

Finally, a bare jobspec may be used as a command:  `%1` is equivalent to `fg %1`, while `%1 &` is equivalent to `bg %1`. 
