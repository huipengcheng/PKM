---
tags: 📥️/📚️/🟥️
aliases:
type: book
status: 🟥️
created: 2022-07-20 16-22
updated: 2022-07-20 23-37
---

# Title: [[{ 2022-07-20 Clean Code]]

## Metadata
- `Topics:` [[Better Coding]]
- `Title:` [[{ 2022-07-20 Clean Code]]
- `Type:` [[{]]
- `Publish Date:` 
- `Reviewed Date:` [[2022-07-20]]

## Note

- Meaningful Names
	- Use intention-revealing names. If a name requires a comment, then the name dose not reveal its intent.
	- Make meaningful distinction





- Functions
	- Small 
		- Functions should hardly ever be **20** lines long.
		- The code in the block of `if`, `else` and `while` should be **one** line long and most possible be a function call statement, and that function called can have a rather informative name.
		- The indent level of a function should not greater than one or two.
	- Do one thing
		- A do-one-thing function may have several steps as long as these steps **on the same level** below the stated name of the function, so that we can decompose a larger concept into a set of steps at the next level.
	- Switch statement 
		- Large; Dose more than one thing; Violate Single Responsibility Principle; Violate Open Closed Principle.
		- Bad:
		  ```java
		  public Money calculatePay(Employee e)
			throws InvalidEmployeeType {
			  switch (e.type) {
				  case COMMISSIONED:
					  return calculateCommissionedPay(e);
				  case HOURLY:
					  return calculateHourlyPay(e);
				  case SALARIED:
					  return calculateSalariedPay(e);
				  default:
					  throw new InvalidEmployeeType(e.type);
			  }
		  }
		  ```
		- Good:
		  ```java
		  public abstract class Employee {
		  	  public abstract boolean isPayday();
		  	  public abstract Money calculatePay();
		  	  public abstract void deliverPay(Money pay);
		  }
		  -----------------
		  public interface EmployeeFactory {
		  	  public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType;
		  }
		  -----------------
		  public class EmployeeFactoryImpl implements EmployeeFactory {
		  	  public Employee makeEmployee(EmployeeRecord r) throws InvalidEmployeeType {
		  	  	  switch (r.type) {
		  	  		  case COMMISSIONED:
		  	  		  	  return new CommissionedEmployee(r) ;
		  	  		  case HOURLY:
		  	  		  	  return new HourlyEmployee(r);
		  	  		  case SALARIED:
		  	  		  	  return new SalariedEmploye(r);
		  	  		  default:
		  	  		  	  throw new InvalidEmployeeType(r.type);
		  	  	  }
		  	  }
		  }
          ```
		- `switch` statements can be tolerated if they appear only once, are used to create polymorphic objects, and are hidden behind an inheritance relationship so that the rest of the system can’t see them.
	- Use descriptive names
		- The smaller and more focused a function is, the easier it is to choose a descriptive name.
		- Don't be afraid to make a name long.
		- Don't be afraid to spend time choosing or changing a name.
		- Be consistent in names.
	- Arguments
		- No more than three.
		- Common forms of one-argument functions
			- Asking a question about that argument: `boolen fileexists("fileName")`
			- Transform that argument to something else: `InputStream fileOpen("fileName")`
			- That argument is an *event*: `void passwordAttemptFailedNtimes(int attempts)`
		- Flag arguments
			- Do **not** pass a boolean into a function which obviously claim that this function does more than one thing.
		- Functions with two arguments
			- `writeField(name)` is bit more understandable than `writeFiled(outputStream, name)`
			- `assertEquals(expected, actual)` needs sometime to learn the order of these two arguments.
			- Try to use member method or member variable to avoid two-argument functions.
		- Functions with three arguments
			- Very not understandable.
		- Argument Objects
			- Reducing the number of arguments by creating objects out of them
			- 
			  ```java
			  Circle makeCircle(double x, double y, double radius);
			  ->
			  Circle makeCircle(Point center, double radius);
			  ```
		- Names contains verbs and keywords
			- `write(name)` -> `writeField(name)`
			- `assertEquals` -> `assertExpectdEqualsActual(expected, actual)`
		-  Have no side effects
		  The `checkPassword` function, by its name, says that it checks the password. The name does not imply that it initializes the session.
		  ```java
		  public class UserValidator {
			  private Cryptographer cryptographer;
			  public boolean checkPassword(String userName, String password) {
				  User user = UserGateway.findByName(userName);
				  if (user != User.NULL) {
					  String codedPhrase = user.getPhraseEncodedByPassword();
					  String phrase = cryptographer.decrypt(codedPhrase, password);
					  if ("Valid Password".equals(phrase)) {
						  Session.initialize();
					  return true;
				  }
			}
			return false;
			}
		  }
		  ```
		- Output Arguments 
			- Can tell what does `appendFooter(s)` do. Append `s` as the footer to something or append a footer to `s`? 
			- And we should have a look at the function's declaration: `public void appendFooter(StringBuffer report)`.
			- It would be better to change to: `report.appendFooter()`.
		- 
		   
