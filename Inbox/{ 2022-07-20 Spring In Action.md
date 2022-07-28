---
tags: 📥️/📚️/🟥️
aliases:
type: book
status: 🟥️
created: 2022-07-20 12-19
updated: 2022-07-21 21-59
---

# Title: [[{ 2022-07-20 Spring In Action]]

## Metadata
- `Topics:` [[Java]] [[Spring]]
- `Title:` [[{ 2022-07-20 Spring In Action]]
- `Type:` [[{]]
- `Publish Date:` 
- `Reviewed Date:` [[2022-07-20]]


## Working with data
-  `JdbcTemplate` dependency
	  ```xml
	  <dependency>
		  <groupId>org.springframework.boot</groupId>
		  <artifactId>spring-boot-starter-jdbc</artifactId>
	  </dependency>
	  ```
- The SQL in `schema.sql`, resided in the application's classpath (`src/main/resources/`, will executed against the database when the application starts as well as `data.sql`, which `schema.sql` is used to generate databases and tables and `data.sql` is used to load some data into tables.
- Example Code
	  ```java
	  @Controller
	  @RequestMapping("/design")
	  @SessionAttributes("order")
	  public class DesignTacoController {
		  @ModelAttribute(name = "order")
		  public Order order() {
			  return new Order();
		  }
		  @ModelAttribute(name = "taco")
		  public Taco taco() {
			  return new Taco();
		  }
		  @PostMapping
		  public String processDesign(
				  @Valid Taco design, Errors errors,
				  @ModelAttribute Order order) {
			  if (errors.hasErrors()) {
			  return "design";
		  }
		  Taco saved = designRepo.save(design);
		  order.addDesign(saved);
			  return "redirect:/orders/current";
		  }
		  ...
	  }
      ```
	- As with the `taco()` method, the `@ModelAttribute` annotation on `order()` ensures that an `Order` object will be created in the model.
	- The `@SessionAttributes` annotation makes sure `order` attribute should be kept in session and available across multiple requests.
	- The `Order` parameter is annotated with `@ModelAttribute` to indicate that its value should come from the model and that Spring MVC shouldn't attempt to bind requests parameter to it.
- `SimpleJdbcInsert` is an object that wraps `JdbcTemplate` to make it easier to insert data into a table.











##  Working with configuration property


## Creating REST controllers
```java
@RestController
@RequestMapping(path="/design",
				produces="application/json")
@CrossOrigin(origins="*")
public class DesignTacoController {
	private TacoRepository tacoRepo;
	
	@Autowired
	EntityLink sentityLinks;
	
	public DesignTacoController(TacoRepository tacoRepo) {
		this.tacoRepo = tacoRepo;
	}
	
	@GetMapping("/recent")
	public Iterable<Taco> recentTacos() {
		PageRequest page = PageRequest.of(
			0, 12, Sort.by("createdAt").descending());
		return tacoRepo.findAll(page).getContent();
	}
	
	@GetMapping("/{id}")
	public Tack tacoById(@PathVariable("id") Long id) {
	    Optional<Taco> optTaco = tacoRepo.findById(id);
	    if (optTaco.isPresent()) {
	        return new ResponseEntity<>(optTaco.get(), HttpStatus.OK);
	    }
	    return new ResponseEntity<>(null, HttpStatus.NOT_FOUND);
	}
	
	@PostMapping(consumes="application/json")
	@ResponseStatus(HttpStatus.CREATED)
	public Taco postTaco(@RequestBody Taco taco) {
		return tacoRepo.save(taco);
	}
}
```
- `@RestController`: Tells Spring that all handler methods in the controller should have their return value written directly to the body of the response, rather than being carried in the model to a view for rendering. Equals to `@Controller` plus all methods annotated with `@ResponseBody`.
- `@RequestMapping(path="...", produces={"application/json", "text/xml"`: The `produces` attribute specify the class or method will only handle requests if the request's `Accept` header includes `application/json` or `text/xml`.
- `@CrossOrigin`
- `@PathVariable`
- `ResponseEntity`
- `@PostMapping(consumes="application/json")`: The `consumes` attribute is to say that method will only handle requests whose `Content-type` matches `application/json`.
- `@RequsetBody`: Indicates that the body of the request should be converted to a `Taco` object and be bound to the parameter.
- `@ResponseStatus(HttpStatus.CREATED)`: Set success HTTP status code to `CREATED (201)` instead of the default 200.
- The difference between `PUT` and `PATCH`
	- `PUT` is intended to perform a wholesale *replacement*, it means "put this data at this URL".
	- `PATCH` is to perform a patch or partial update of resource data.


