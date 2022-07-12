---
tags: 📥️/📚️/🟥️
aliases:
type: book
status: 🟥️
created: 2022-05-05 15-52
updated: 2022-06-01 22-15
---

# Title: [[{ 2021-07 Effective Java]]

## Metadata
- `Topics:` [[Java]]
- `Title:` [[{ 2021-07 Effective Java]]
- `Type:` [[{]]
- `Publish Date:` 
- `Reviewed Date:` [[2022-05-05]]

## Note

TODO 清单：

二、三17-最后、四、五、以及其他TODO

# 一. 创建和销毁对象

## 1. 考虑使用静态工厂方法代替构造器

下面是 `Boolean` 类的一个简单例子：

 public static Boolean valueOf(boolean b) {  
     return b ? Boolean.TRUE : Boolean.FALSE;  
 }

注意静态工厂方法和设计模式中的工厂方法并不相同。

一个类可以给客户端提供静态工厂方法来代替 public 构造器，或者两者都有。提供静态工厂方法有优点也有缺点。

### 优点

#### 静态工厂方法有名字

有一个好名字的静态工厂方法会使得客户端的代码更易读。

同一个类可能有很多构造器，甚至有的构造器可能仅仅只是参数顺序不同。用户记不住，每次使用的时候都必须查看类文档。因此，如果一个类有好几个构造器有着相同的签名，只是参数顺序不同，那么就可以使用几个静态工厂方法分别代替它们，并且给每个都取个好名字来体现区别。

#### 并不要求在每次被调用的时候创建新对象

每次调用构造器的时候都会创建一个新对象，而静态工厂方法可以不同。这就允许了不可变类（详见第 17 条）使用一个预先创建好的实例，或者在实例创建的时候将它们缓存起来，这样就避免了创建不必要的重复对象。例如 `Boolean.valueOf(boolean)` 永远不创建新对象。这种方法类似于享元（flyweight）模式。它可以在相同对象被经常访问的时候，极大提高性能，在创建对象花费大的时候提示尤其显著。

静态工厂方法的这个能力可以使得类可以严格控制哪些实例在哪些时间可以存在。这种类被称作实例受控（instance-controlled）的类。编写这种类的理由如下。实例受控可以让类确保它是 Singleton（详见第 3 条）或者是不可实例化（noninstantiable）的（详见第 4 条）。此外，实例受控也可以让不可变值类（详见第 17 条）确保没有两个相同的实例存在：`a.equals(b)` 只有在 `a == b` 的时候才为真。这是享元模式的基础，枚举类型也保证了这一点。

#### 可以返回原返回类型的任意子类

这种灵活性的一种运用是 API 在返回对象，同时又可以让类不是 public。用这种方式来隐藏实现类可以使 API 变得非常简洁紧凑。这种方式适合于基于接口的框架（详见第 20 条），其中接口为静态工厂方法提供了自然的返回类型（也就是说静态工厂方法声明上的返回值可以直接写成接口）。

在 Java 8 之前，接口不能有静态方法。所以按照惯例，一个名为 Type 的接口，它的静态工厂方法应该放到一个名为 Types 的不可实例化的伴生类（noninstantiable companion class，详见第 4 条）。例如，Java 集合框架的接口有 45 个工具实现，提供了不可变集合、同步集合等。几乎所有这些实现都是通过一个不可实例化的类（java.util.Collections）中的静态工厂方法导出的，这些返回对象的类都是非 public。

如果它导出了 45 个独立的公有类，那么集合框架的 API 就会很庞大许多。减少的不仅仅是 API 的体积，还有概念上的重量：程序员为了使用 API 而必须掌握的概念的数量和难度。程序员知道返回的对象具有其接口所指定的 API，所以没有必要为实现类阅读额外的类文档。此外，使用这样的静态工厂方法需要客户通过接口而不是实现类来引用返回的对象，这通常是很好的做法（详见第 64 条）。

Java 8 之后，接口不能有静态方法的限制取消了，所以没必要再去为一个接口提供上面这种不可实例化的伴生类了，可以将这些 public static 成员放到它们的接口中。注意，仍然有必要将这些静态工厂方法背后的大部分实现代码放到一个单独的 package-private 类中。这是因为 Java 8 要求接口中所有 static 成员都是 public 的。Java 9 允许了 private static 方法，但是 static 域和 static 成员类仍然被要求是 public 的。

#### 返回对象的类可以根据参数的不同而改变

返回声明中的返回类型的任意子类型都是可以的，返回对象的类型也可以随着版本而变化。

`EnumSet` 类（详见第 36 条）没有 public 构造器，只有静态工厂方法。在 OpenJDK 的实现中，它返回两个子类中的一个实例，取决于底层枚举类型的大小：如果小于等于 64，则返回 `RegularEnumSet` 实例，它使用一个 long 域来实现功能；如果大于 64，则返回 `JumboEnumSet` 实例，它使用一个 long 数组来实现功能。

这两个实现类对客户端都是不可见的，如果一个类出现了问题，可以在之后的版本中修复，并且不会产生任何影响。同样的，未来版本中也可能会添加更多对性能有益的实现。客户端既不知道也不关心静态工厂方法返回对象的类，它们只要知道这是 EnumSet 的某个子类就足够了。

#### 返回对象的类在编写静态工厂方法的时候可以不存在

静态工厂方法这种灵活的特性构成了服务提供者框架（service provider framwork）的基础，例如 Java Database Connectivity API（JDBC）。一个服务提供者框架是一个多个服务提供者实现一个服务的系统，系统为客户端提供多个实现，把客户端从多个实现中解耦出来。

服务提供者框架中有三个基本组件：

-   一个服务接口（service interface），代表了一个实现；
    
-   一个提供者注册（provice registration）API，服务提供者使用它来注册实现；
    
-   一个服务访问（service access）API，客户端使用它来获得服务的实例。服务访问 API 可以让客户端在选择实现的时候指定条件。如果没有条件，那么 API 就返回默认实现的一个实例，或者让客户端循环遍历所有可用的实现。服务访问 API 正是构成服务提供者框架基础的灵活静态工厂方法。
    

可选的第四个组件是服务提供者接口，它描述了产生服务接口实例的工厂对象（TODO：可以创建服务接口实现的工厂对象接口？）。如果没有它，实现就必须通过反射来进行实例化（详见第 65 条）。对 JDBC 来说，`Connection` 就是其服务接口的一部分，`DriverManager.registerDrive` 对应提供者注册 API，`DriverManager.getConnection` 对应服务访问 API，`Driver` 对应服务提供者接口（所有数据库的驱动都要实现这个类，它有个 `connect` 方法返回 `Connection`，也就是服务实现）。

服务提供者框架模式有很多变体，例如，服务访问 API 可用返回另一个接口，这个接口比提供者的提供的接口功能更多。这就是桥接模式。依赖注入框架（详见第 5 条）是一个十分强大的服务提供者。Java 6 之后，平台提供了通用的服务提供者框架（java.util.ServiceLoaded），所以就不需要，也不应该编写新的（详见第 58 条）。JDBC 不使用 `ServiceLoader`，因为它出现的更早。

> TODO：第一句话的原文如下，不是很明白，而且为什么这个像桥接模式。
> 
> There are many variants of the service provider framework pattern. For example, the service access API can return a richer service interface to clients than the one furnished by providers.

### 缺点

#### 没有 public 或 protected 构造方法的类不能被继承

这是静态工厂方法最大的限制。比如，不可能继承集合框架提供的任何一个方便的实现（也就是指 `Collections.syncronizedMap` 等）。但这样也有它的好处，因为它鼓励程序员使用组合代替继承（详见第 18 条），并且它适合被不可变类型使用。

#### 它们很难被程序员发现

它们不像构造方法那样在 API 明确标识出来，所以很难弄明白怎样去实例化一个使用静态工厂方法代替构造器的类。Javadoc 可能在未来关注静态工厂方法，但在那之前，通过在类或者接口文档中指出静态工厂方法，并遵守标准的命名习惯，也可以弥补这一劣势。下面是静态工厂方法的一些惯用名称，列出了其中的一小部分：

-   from：类型转换方法，它只有单个参数，返回类型对应的实例，例如：
    
    Date d = Date.from(instant);
    
-   of：聚合方法，接受多个参数，返回包括这些参数的类型的实例，例如：
    
    Set<Rank> faceCards = EnumSet.of(JACK, QUEEN, KING;
    
-   valueOf：比 from 和 of 更粗略的替代方案，例如：
    
     BigInteger prime = BigInteger.valueOf(Integer.MAX_VALUE);
    
-   instance 或 getInstance：返回一个由其参数（如果有的话）描述的实例，但不能说它们有相同的值，例如：
    
      StackWalker luke = StackWalker.getInstance(options);
    
-   create 或 newInstance：类似 instance 或 getInstance，除了这个方法确保每次都要都返回一个新的实例，例如：
    
     Object newArray = Array.newInstance(classObject, arrayLen);
    
-   getType：类似 getInstance，但是它在静态工厂方法处于一个不同的类中时使用，Type 是返回对象的类型，例如：
    
     FileStore fs = Files.getFileStore(path);
    
-   newType：类似 newInstance，但是它在静态工厂方法处于一个不同的类中时使用，Type 是返回对象的类型，例如：
    
     BufferedReader br = Files.newBufferedReader(path);
    
-   type：getType 后 newType 的简化版本，例如：
    
     List<Complaint> litany = Collections.list(legacyLitany);
    

### 总结

总而言之，静态工厂方法和 public 构造器都有它们的用处，需要理解它们各自的长处。通常情况下静态工厂方法要更优先，所以第一反应是考虑静态工厂方法。

## 2. 当构造器有很多参数的时候考虑使用 builder

静态工厂方法和构造器都有一个不足：它们在面对大量可选参数的时候不能很好地拓展。

### 伸缩构造器

对于下面这个类，传统上很多人会选择使用伸缩构造器（telescoping contructor）模式，也就是提供一个只需要必需的参数的构造器，一个只需要一个可选参数的构造器，一个需要两个可选参数的构造器，以此类推，直到最后需要所有可选参数的构造器：

// Telescoping constructor pattern - does not scale well!  
public class NutritionFacts {  
    private final int servingSize;  // (mL)            required  
    private final int servings;		// (per container) required  
    private final int calories;		// (per serving)   optional  
    private final int fat;			// (g/serving)	   optional  
    private final int sodium;		// (mg/serving)    optional  
    private final int carbohydrate; // (g/serving)     optional  
  
    public NutritionFacts(int servingSize, int servings) {  
        this(servingSize, servings, 0);  
    }  
  
    public NutritionFacts(int servingSize, int servings,   
                          int calories) {  
        this(servingSize, servings, calories, 0);  
    }  
  
    public NutritionFacts(int servingSize, int servings,  
                          int calories, int fat) {  
        this(servingSize, servings, calories, fat, 0);  
    }  
  
    public NutritionFacts(int servingSize, int servings,  
                          int calories, int fat, int sodium) {  
        this(servingSize, servings, calories, fat, sodium, 0);  
    }  
  
    public NutritionFacts(int servingSize, int servings,  
                         int calories, int fat, int sodium, int carbohydrate) {  
        this.servingSize  = servingSize;  
        this.servings= servings;  
        this.calories=calories;  
        this.fat=fat;  
        this.sodium=sodium;  
        this.carbohydrate = carbohydrate;  
    }  
}

当要创建实例的时候，使用包含所有所需参数且参数列表最短的构造器。通常来说，这种方法会要求设置很多不想设置的参数，但必须要为它们传一个值。下面这个例子就是为 `fat` 这个参数传递了 0：

NutritionFacts cocaCola = new NutritionFacts(240, 8, 100, 0, 35, 27);

简单来说，伸缩构造器模式可以工作，但客户端的代码很难编写，且很难阅读。读者要想知道这些参数的意义，必须要数参数位置才能知道。而且，相同类型参数的长序列可能会导致一些问题，如果客户端不小心颠倒了两个参数的位置，编译器并不会发现.

### JavaBeans 模式

这是一种通过使用无参构造器来创建对象，然后通过调用 setter 来设置每个必需的和需要的可选参数。

// JavaBeans Pattern - allows inconsistency, mandates mutabilit  
public class NutritionFacts {  
    // Parameters initialized to default values (if any)  
    private int servingSize = -1;  // Required; no default value  
    private int servings = -1;     // Required; no default value  
    private int calories = 0;  
    private int fat = 0;  
    private int sodium = 0;  
    private int carbohydrate = 0;  
  
	// Setters  
    public void setServingSize(int val)  { servingSize = val; }  
    public void setServings(int val) { servings = val; }  
    public void setCalories(int val) { calories = val; }  
    public void setFat(int val) {fat=val;}  
    public void setSodium(int val) { sodium = val; }  
    public void setCarbohydrate(int val) { carbohydrate = val; }  
}

这种模式没有伸缩构造器模式的任何缺点。创建实例很简单，也很容易阅读，就是有点啰嗦：

NutritionFacts cocaCola = new NutritionFacts();  
cocaCola.setServingSize(240);  
cocaCola.setServings(8);  
cocaCola.setCalories(100);  
cocaCola.setSodium(35);  
cocaCola.setCarbohydrate(27);

但是，JavaBeans 模式有非常严重的缺点。因为它实例的构造被划分成了许多个方法调用，一个 JavaBean 可能在构造过程中处于不一致的状态。类无法仅仅通过检查构造函数参数的有效性来强制实现一致性（因为只有无参构造器？）。当一个对象处于不一致的状态时，试图使用它可能会导致故障，而这种故障难以调试。还有一个相关的缺点是，JavaBeans 模式排除了使一个类成为不可变的可能性（详见第 17 条），这就要求程序员的付出努力来保证线程安全。

> 构造方法是线程安全的。

### Builder 模式

#### 通常用法

这种模式不仅提供了伸缩构造器模式的安全性，也提供了 JavaBeans 模式的可读性。客户端并不直接创建对象，而是调用一个构造器（或静态工厂方法）来创建一个 builder 对象，这个构造器包含了所有必需的参数。然后客户端在 builder 对象上调用类似 setter 的方法来设置每个需要的可选参数。最好，客户端调用一个无参 build 方法来生产这个对象，并且这个对象是不可变的（。builder 一般都是它所创建的类中的一个静态成员类（详见第 24 条）：

// Builder Pattern  
public class NutritionFacts {  
   private final int servingSize;  
    private final int servings;  
    private final int calories;  
    private final int fat;  
    private final int sodium;  
    private final int carbohydrate;  
      
    public static class Builder {  
        // Required parameters  
        private final int servingSize;  
        private final int servings;  
        // Optional parameters - initialized to default values  
        private int calories      = 0;  
        private int fat			  = 0;  
        private int sodium        = 0;  
        private int carbohydrate  = 0;  
        public Builder(int servingSize, int servings) {  
            this.servingSize = servingSize;  
            this.servings    = servings;  
        }  
          
        public Builder calories(int val)  
            { calories = val;      return this; }  
        public Builder fat(int val)  
            { fat = val;           return this; }  
        public Builder sodium(int val)  
            { sodium = val;        return this; }  
        public Builder carbohydrate(int val)  
            { carbohydrate = val;  return this; }  
          
        public NutritionFacts build() {  
            return new NutritionFacts(this);  
        }   
    }  
      
    private NutritionFacts(Builder builder) {  
        servingSize  = builder.servingSize;  
      	servings 	 = builder.servings;  
      	calories     = builder.calories;  
        fat 		 = builder.fat;  
      	sodium 		 = builder.sodium;  
      	carbohydrate = builder.carbohydrate;  
    }   
}

`NutritionFacts` 类是不可变的，并且所有参数的默认值都在同一个地方（TODO：同一个地方是啥意思）builder 的 setter 方法返回 builder 自身，所以多个调用可以被链接起来，得到一个流式（fluent）API：

NutritionFacts cocaCola = new NutritionFacts.Builder(240, 8)  
           .calories(100).sodium(35).carbohydrate(27).build();

要尽快检测出非法参数，可以在 builder 的构造器和方法中检测参数的合法性。检查由 `build` 方法调用的构造方法中涉及多个参数的约束（invariants）。为了确保这些约束不受攻击，在从 builder 复制参数后检查对象的域（详见第 50 条）。如果检查失败，抛出 `IllegalArgumentExcetpion`，并在详细信息中指出哪些参数非法。

#### 用于类层次结构中

Builder 模式也适用于类层次结构。 抽象类有抽象 builder，具体类有具体 builder。例如：

// Builder pattern for class hierarchies  
public abstract class Pizza {  
    public enum Topping { HAM, MUSHROOM, ONION, PEPPER, SAUSAGE }   
  	final Set<Topping> toppings;  
    
    abstract static class Builder<T extends Builder<T>> {   
      	EnumSet<Topping> toppings = EnumSet.noneOf(Topping.class);   
      	public T addTopping(Topping topping) {  
            toppings.add(Objects.requireNonNull(topping));  
            return self();  
        }  
  
        abstract Pizza build();  
          
        // Subclasses must override this method to return "this"  
        protected abstract T self();  
    }  
    
    Pizza(Builder<?> builder) {  
    	toppings = builder.toppings.clone(); // See Item 50  
    }  
}

注意 `Pizza.Builder` 是有一个递归类型参数的泛型（详见第 30 条）。通过抽象 `self` 方法，允许方法链在子类中正常工作，而不需要进行转型。这种针对 Java 缺乏 self 类型的变通方法被称为模拟 slef 类型（simulated self-type）的习惯做法。

 public class NyPizza extends Pizza {  
     public enum Size { SMALL, MEDIUM, LARGE }  
     private final Size size;  
  
     // 泛型是 NyPizza.Builder，为了在父类 addToping() 和 self() 方法中返回此类实例  
     public static class Builder extends Pizza.Builder<Builder> {   
         private final Size size;  
           
         public Builder(Size size) {  
             this.size = Objects.requireNonNull(size);  
         }  
  
         @Override   
         public NyPizza build() {  
             return new NyPizza(this);  
         }  
  
         @Override   
         protected Builder self() { return this; }  
     }  
     
     private NyPizza(Builder builder) {  
         super(builder);  
         size = builder.size;  
   	}  
}  
  
public class Calzone extends Pizza {  
    private final boolean sauceInside;  
  
    public static class Builder extends Pizza.Builder<Builder> {   
        private boolean sauceInside = false; // Default  
          
        public Builder sauceInside() {  
            sauceInside = true;  
            return this;  
        }  
          
        @Override   
        public Calzone build() {  
            return new Calzone(this);  
        }  
          
        @Override   
        protected Builder self() { return this; }  
    }  
      
    private Calzone(Builder builder) {  
        super(builder);  
        sauceInside = builder.sauceInside;  
    }  
}

注意到每个子类中 builder 的 `build` 方法返回的是正确的子类。这种技术，即子类方法被声明为返回「超类中声明的返回类型」的子类型，被称为协变返回类型（covariant return typing）。它允许客户使用这些 builder 而不需要转型。

客户端代码与 `NutritionFacts` builder 的代码基本相同：

NyPizza pizza = new NyPizza.Builder(SMALL)  
     .addTopping(SAUSAGE).addTopping(ONION).build();  
Calzone calzone = new Calzone.Builder()  
    .addTopping(HAM).sauceInside().build();

#### Builder 的其他优点

与构造器相比，builder 模式还有一个小优势。builder 可以有多个变长（varargs）参数，因为每个变长参数都有自己的方法。此外，builder 可以多次调用同一个方法，并把每次的参数聚合进一个域，正如上面的 `addTopping` 方法。

Builder 模式很灵活。单个 builder 可以被重复使用来创建多个对象：Builder 的参数可以在多次 `build` 方法的调用之间进行调整，以改变所创建的对象。

Builder 可以在创建对象时自动填写一些字段，例如，每次创建对象时都会增加一个序列号。

#### 缺点

在创建对象之前，必须先创建它的 builder。虽然创建这个 builder 的成本在实践中不太可能被注意到，但在对性能要求很高的情况下，这可能是一个问题。另外，builder 模式比伸缩构造器模式更啰嗦，所以只有在有足够多的参数使其值得使用时，例如四个或更多，才应该使用它。但也要注意，如果未来参数会更多，且一开始使用的是构造函数或静态工厂方法，如果此时改用 builder 模式，那么构造函数或静态工厂方法也是不能删掉的，因此一开始就使用构建器往往更好。

### 总结

总而言之，builder 模式在构造器或静态工厂方法的有很多参数的时候是个好的选择，尤其有大量可选参数或类型相同的参数时。客户端代码会比伸缩构造器更容易编写和阅读，也会比 JavaBeans 更安全。

## 3. 用私有构造器或枚举类型强化 Singleton 属性

Singleton 是一个只会实例化一次的类，它通常代表一个无状态的类，例如一个函数（详见第 24 条）或者一个唯一的系统组件。Singleton 的类会使测试变困难，因为不可能 Mock 掉 Singleton，除非实现一个充当其类型的接口（TODO：跟 singleton 的类实现统一的接口？）。

### 两种常见实现方式

实现 singleton 有两种常见的方式，都是通过保持构造器私有，然后导出一个公有静态成员来提供对单一实例的访问。

#### public final 域

// Singleton with public final field  
public class Elvis {  
    public static final Elvis INSTANCE = new Elvis();  
    private Elvis() { ... }  
      
    public void leaveTheBuilding() { ... }  
}

私有构造器只调用了一次，用来初始化 public static 域。因为没有 public 和 protected 构造器，所以保证了全局唯一性。客户端只有一种方式可以改变这种情况：借助 `AccessibleObject.setAccessible` 方法反射调用私有构造器（详见第 65 条）。如果想防御这种攻击，可以修改构造器，让它在第二次调用时抛出异常。

#### 静态工厂

// Singleton with static factory  
public class Elvis {  
    private static final Elvis INSTANCE = new Elvis();   
  	private Elvis() { ... }  
    public static Elvis getInstance() { return INSTANCE; }  
    
    public void leaveTheBuilding() { ... }  
}

这种方法和 `final` 域方法可能受到的攻击是一样的，防御方法也一样。

#### 如何选择

public 域的主要优势就是它的 API 可以清楚表明这是个 Singleton 类：pubilc staticd 域是 final 的，所以它总是相同的对象引用。第二个优势就是更简单。

静态工厂方法的优势有：

-   灵活。不改变 API 的情况下，可以选择是否继续为该类实现 Singleton，比如在静态工厂方法中为每个线程返回一个 Singleton；
    
-   可以实现泛型 Singleton 工厂（详见第 30 条）；
    
-   可以使用方法引用作为一个 supplier，例如 `Elvis::instance` 就是一个 `Supplier<Elvis>`。
    

除非需要静态工厂的优势，否则优先考虑 public 域方法。

#### 可序列化时的问题

要使上面两种方法的 singleton 类可序列化（详见第 12 章），仅仅在其声明中添加 `implements Serializable` 是不够的。为了保证单例，要声明所有的实例域都是 `transient` 的，并提供一个 `readResolve` 方法（详见第 89 条）。否则，每次序列化的实例被反序列化时，都会创建一个新的实例：

// readResolve method to preserve singleton property  
private Object readResolve() {  
    // Return the one true Elvis and let the garbage collector  
    // take care of the Elvis impersonator.  
    return INSTANCE;  
}

### 单元素枚举类型

// Enum singleton - the preferred approach  
public enum Elvis {  
    INSTANCE;  
    public void leaveTheBuilding() { ... }  
}

这种方法和 public 域的方法相似，但更加简洁，且免费提供了序列化机制。即使在面对复杂的序列化或者反射攻击的时候也**绝对防止多次实例化**。这种方法虽然看起来不自然，但是它往往是实现 singleton 最好的方式。

**注意**：如果 Singleton 必须继承一个类，且这个类不是枚举类型的时候，则不宜使用这个方法（尽管可以声明枚举去实现接口）。

## 4. 通过私有构造器强化不可实例化的能力

有时候可能需要编写只包含静态方法和静态域的类。它们可以用来将基本类型值或数组上的相关方法组织起来，例如 java.lang.Math 或 java.util.Arrays。它们也可以用来将静态方法（包括静态工厂方法）组织起来，这些方法用于「实现某些接口的对象」，例如 java.util.Collections（Java 8 之后，可以将这种方法放进接口里）。最后，还可以利用这种类将 final 类里方法组织起来，因为不能把它们放在子类中（TODO：没明白）。

这种**工具类**并不是为了被实例化而设计的：它的实例是毫无意义的。但是在没有提供构造函数的情况下，编译器提供了一个公共的、无参数的默认构造函数。

> 理解：
> 
> 1.  静态工具类并不是说类是静态的，而是类中提供了大量静态工具方法。
>     
> 2.  静态工具类和单例没有关系，静态工具类如果使用了 private 构造器，那么它甚至可以选择永远没有实例，通常也应该这么作。
>     

**通过将这种类编写成抽象类来强迫不可实例化是行不通的。**因为该类可以被继承，并且该子类可以被实例化。这样甚至会误导用户，以为这个抽象类就是专门为了继承而设计的（详见第 19 条）。解决办法是，**只要让这个类包含一个私有构造器，它就不能被实例化。**

// Noninstantiable utility class  
public class UtilityClass {  
    // Suppress default constructor for noninstantiability  
    private UtilityClass() {  
        throw new AssertionError();  
    }  
    ...  // Remainder omitted  
}

`AssertionError` 不是必需的，但是它可以避免不小心在类的内部调用构造器。这种方式可以保证在任何情况下都不会被实例化。最好在私有构造器上方加上一条注释。

这种方法使得一个类不能被继承，因为所有的构造器都必须显式或隐式地调用父类的构造器。

## 5. 优先考虑依赖注入来依赖资源

### 普通方式

许多类都依赖一个或多个底层资源。例如，拼写检查器依赖字典。很可能将这种类实现成静态工具类：

// Inappropriate use of static utility - inflexible & untestable!  
public class SpellChecker {  
    private static final Lexicon dictionary = ...;  
      
    private SpellChecker() {} // Noninstantiable  
      
    public static boolean isValid(String word) { ... }  
    public static List<String> suggestions(String typo) { ... }  
}

也很可能将它实现为单例：

// Inappropriate use of singleton - inflexible & untestable!  
    
public class SpellChecker {  
    private final Lexicon dictionary = ...;  
      
    private SpellChecker(...) {}  
    public static INSTANCE = new SpellChecker(...);  
      
    public boolean isValid(String word) { ... }  
    public List<String> suggestions(String typo) { ... }  
}

这两种方法都不理想，因为它们都假设了只会使用一个字典。

可以尝试通过修改 `dictionary` 域为非 final，并添加一个改变 dictionary 的方法，来解决问题。但这种方式很容易出错，并且无法并发设置。静态工具类和单例都不适合那些行为被底层资源参数化的类（TODO：这个参数化，就是指根据底层资源可以控制类的行为？）。

### 依赖注入

真正需要的是能在类中能支持多个实例的能力，每个实例都使用客户端所需要的资源（此例中是字典）。满足需求的最简单模式是在创建实例的时候，将这个资源传递给构造器。这是依赖注入的一种形式：字典是一个拼写检查器的一个依赖，并且它在拼写检查器在创建的时候被注入进去了。

// Dependency injection provides flexibility and testability  
public class SpellChecker {  
    private final Lexicon dictionary;  
  
    public SpellChecker(Lexicon dictionary) {   
        this.dictionary = Objects.requireNonNull(dictionary);  
    }  
      
    public boolean isValid(String word) { ... }  
    public List<String> suggestions(String typo) { ... }  
}

这种方式太简单了，以至于许多程序员使用多年都不知道它的名字。

依赖性注入可以处理任意数量的资源和任意的依赖性图（dependency graph）。它保留了不变性（详见第 17 条），所以多个客户在有相同需求的时候可以共享依赖对象。依赖注入同样适用于构造函数、静态工厂方法和 Builder。

该模式一个有用的变体就是传递一个资源的工厂给构造器。工厂是一个可以重复调用的对象，用来创建一个类型的实例。这种工厂体现了工厂方法模式。Java 8 引进的 `Supplier<T>` 接口最适合用来表示工厂。接受 `Supplier<T>` 输入的方法通常应该使用有界通配符类型（bounded wildcard type，详见第 31 条）来约束工厂的类型参数，以允许客户传递一个创建指定类型的任何子类型的工厂（跟上面的用于类层次的 builder 方式一样，可以让客户端不用转型）。例如，下面这个方法可以接受客户端提供的工厂，客户端提供的工厂可以创建 Tile 的任何子类。

Mosaic create(Supplier<? extends Tile> tileFactory) { ... }

尽管依赖注入极大地提高了灵活性和可测试性，但它会使大型项目变得杂乱无章，这些项目通常包含成千上万的依赖关系。通过使用依赖注入框架，如Dagger、Guice 或 Spring，可以完全消除这种杂乱。

> TODO：结合第一条和这条，Spring 的依赖注入是否是通过服务提供者框架实现的？比如 @Component 注解注册服务，以及它注解的类是服务实现，@Autowired 对应服务访问 API。

### 总结

总之，不要使用 Singleton 或静态工具类来实现依赖于一个或多个底层资源的类，这些底层资源的行为会影响该类的行为，也不要让该类直接创建这些资源。相反，可以将资源或创建它们的工厂传递给构造函数（或静态工厂或 builder），这种做法被称为依赖性注入，将大大增强类的灵活性、可重用性和可测试性。

> 为什么不把构造方法传参的方式用于静态工具类？因为都是工具类了，它是不可实例化的类。当然，如果只是普通的静态类，我认为是可以使用这种方法的。

## 6. 避免创建不必要的对象

### 尽可能重用对象

一般来说，最好能重用单个对象，而不是在每次需要的时候就创建一个相同功能的新对象。重用不仅快，而且很优雅。如果对象是不可变的，它就始终可以被重用（详见第 17 条）。

例如，`String s = new String("bikini")` 会在每次调用的时候创建一个新的 `String` 实例，而 `String s = "bikini"` 无论调用多少次，只会使用一个 `String` 实例。此外，这种方式还保证同一个 VM 上，只要 String 字面量相同，就共用同一个对象。

在面对不可变类的时候，可以使用静态工厂方法而不是构造器来避免创建不必要的对象。例如 `Boolean.valueOf(String)` 优于 构造器 `Boolean(String)`，在后者在 Java 9 种被废弃。同样，如果可变对象没有改变，也可以重用它。

> 其他适用的情况：
> 
> -   已知不会修改的对象；
>     
> -   适配器（有时候也叫视图 view）除了代理对象之外，没有其他的状态信息，所以针对某个给定对象的特定适配器而言，不需要创建多个适配器实例。
>     
>     例如，`Map` 接口的 `keySet()` 方法返回 Map 对象的 Set 视图，每次调用这个方法都返回同样的 Set 实例。虽然这个 Set 实例一般是可改变的，但是所有返回的对象在功能上是等同的：当其中一个返回对象发生变化的时候，所有其他的返回对象也要发生变化，因为它们是由同一个 Map 实例支撑的 。 虽然创建 keySet 视图对象的多个实例并无害处， 却是没有必要，也没有好处的 。
>     

### “昂贵” 的对象

有些的对象创建的成本比其他对象要高得多，如果要多次重复使用同一个昂贵对象，可以将它们缓存起来以重用。但昂贵的对象并非总是显而易见。例如 `String.matches()` 并不适合在注重性能的情形中重复使用。因为它在内部为正则表达式创建了一个 `Pattern` 实例，却只使用了一次，之后就可以进行垃圾回收了。创建 `Pattern` 的成本很高，因为需要将正则表达式编译成一个有限状态机。

为了提升性能，应该显式地将正则表达式编译成一个 `Pattern` 实例（不可变），让它成为类初始化的一部分，并将它缓存起来。

// Reusing expensive object for improved performance  
public class RomanNumerals {  
    private static final Pattern ROMAN = Pattern.compile(  
        "^(?=.)M*(C[MD]|D?C{0,3})"  
        + "(X[CL]|L?X{0,3})(I[XV]|V?I{0,3})$");  
  
    static boolean isRomanNumeral(String s) {  
        return ROMAN.matcher(s).matches();  
    }   
}

如果 `isRomanNumeral` 没被调用，那么就没必要初始化 `ROMAN`。可以在 `isRomanNumeral` 第一次被调用的时候**延迟初始化（lazily initializing）**（83 条） `ROMAN`，但并**不建议**，这样会使方法更加复杂，从而无法提升性能（67 条）。

### 不明显的不可变对象

当一个对象是不可变的，很明显它可以被安全地重用，但有些情况很难看出一个类是不可变的。考虑一下适配器的情况，也被称为视图（view）。适配器是一个「委托给支持对象（delegating to a backing object）」的对象，提供了一个替代接口。因为适配器除了其支持对象的状态外没有其他状态，所以没有必要为一个给定的对象创建一个以上的适配器实例。

例如，`Map` 的 `keySet` 方法返回了一个由所有 key 组成的 Set view。直观上来看，似乎每一次对 `keySet` 的调用都必须创建一个新的 `Set` 实例，但是在一个给定的 `Map` 对象上每一次对 `keySet` 的调用都返回同一个 `Set` 实例。尽管返回的 `Set` 实例通常是可变的，但所有返回的对象在功能上是相同的：当一个返回的对象发生变化时，所有其他的对象也会发生变化，因为它们都是由同一个 Map 实例支持的。虽然创建多个不同 `keySet` 视图对象的实例在很大程度上是无害的，但这是不必要的，也没有任何好处。

### 自动装箱（autoboxing）

自动装箱会创建多余对象，它允许将基本类型和装箱基本类型（Boxed Primitive Type）混用。但这两种类型在性能上有着比较明显的差别（61 条）。

// Hideously slow! Can you spot the object creation?  
   private static long sum() {  
       Long sum = 0L;  
       for (long i = 0; i <= Integer.MAX_VALUE; i++)  
           sum += i;  
	   return sum;   
   }

`sum` 声明成 `Long` 而不是 `long`，会使程序构造了大约 2^31 个多余的 `Long` 实例（大约每次往 `Long sum` 中增加 `long i` 时构造一个实例）。**要优先使用基本类型，要当心无意识的自动装箱。**

> 并不是说要尽可能地避免创建对象，相反，小对象的创建和回收动作非常廉价。通过创建附加对象，可以提升程序的清晰性、简洁性和功能性。

### 对象池（object pool）

通过维护自己的对象池来避免创建对象并不是一种好的做法，除非池中的对象是非常重量级的。数据库连接是证明对象池合理性的经典例子。因为建立这些连接代价非常大，所以才有理由重用这些对象。

但是，一般而言，维护自己的对象池会把代码弄得很乱，同时增加内存占用（footprint），并且还会损害性能。现代的 JVM 实现具有高度优化的垃圾回收器，其性能很容易就会超过轻量级对象池。

## 7. 消除废弃的对象引用

Java 并不是完全不需要考虑内存管理。

### 废弃的对象引用

// Can you spot the "memory leak"?  
public class Stack {  
    private Object[] elements;  
    private int size = 0;  
    private static final int DEFAULT_INITIAL_CAPACITY = 16;  
    public Stack() {  
        elements = new Object[DEFAULT_INITIAL_CAPACITY];  
    }  
      
    public void push(Object e) {  
        ensureCapacity();  
        elements[size++] = e;  
    }  
  
    public Object pop() {  
        if (size == 0)  
            throw new EmptyStackException();  
        return elements[--size];  
    }  
      
    /**  
    * Ensure space for at least one more element, roughly  
    * doubling the capacity each time the array needs to grow.  
    */  
    private void ensureCapacity() {  
        if (elements.length == size)  
            elements = Arrays.copyOf(elements, 2 * size + 1);  
    }   
}

这个类看起来没有任何明显的问题，但它会引发内存泄露，它可以默默表现为垃圾回收器的活动增加或者内存占用增加而导致性能下降。极端情况下，内存泄漏会导致磁盘分页，甚至出现 OOM。

如果栈先增长再收缩，那么栈中弹出来的对象即使在程序中没有任何指向它们的引用，它们也不会被垃圾回收。因为栈依然维护着对这些对象的废弃引用（obsolete reference）。废弃引用可以简单认为是一个永远不会被取消引用（dereference）的引用。在此例中，对象数组中活动部分（大于等于 `size` ）之外部分的任何引用都是废弃的。

内存泄漏在垃圾回收语言中是潜伏的，更恰当的说法是无意识的对象保留（unintentional object retentions）。垃圾收集器不仅会将这种无意识保留下来的对象引用排除回收范围，而且还会将该对象所引用的对象也排除，以此类推。即使只有很小一部分无意识保留的对象，也可能导致许许多多对象不会被被回收，对性能有潜在的巨大影响。

### 自己管理内存的类

这种问题的修复方法很简单，只需清空（null out）这些引用即可。

public Object pop() {  
    if (size == 0)  
    	throw new EmptyStackException();  
    Object result = elements[--size];  
    elements[size] = null; // Eliminate obsolete reference   
    return result;  
}

将废弃的引用清空的另一个好处是，如果它们被错误地取消引用，程序将立即出现 `NullPointerException`，而不是悄悄地做错事。

当然，没必要在每个程序用完的时候立马清空对象引用。这样使得程序变得十分混乱。清空废弃对象引用应该是一种例外，而不是常规做法。最好的消除废弃对象引用的方式是让包含该引用的变量超出它的作用域（fall out of scope）。如果将每个变量都限制在了最小作用域内，这种情况会自然发生（详见第 57 条）。

但**清空对象引用的做法是个例外，而不是一种规范行为**，最好办法是让包含该引用的变量结束其生命周期。（TODO：书上接下来写道：「如果你是在最紧凑的作用域范围内定义每一个变量（详见第 57 条），这种情形就会自然而然地发生。」，不太明白意思。）

那么，什么时候应该把一个引用清空（null out）？Stack 类的哪个方面使它容易发生内存泄漏？简单地说，它管理着自己的内存。它的存储池由 `elements` 数组的元素组成（对象的引用单元，而不是对象本身）。数组活动部分的元素被分配，而数组其余部分的元素被释放。但垃圾收集器没有办法知道这一点；对垃圾收集器来说，`elements` 数组中所有的对象引用都是同样有效的。只有程序员知道数组的非活动部分是不重要的。程序员通过在数组元素成为非活动部分时手动将其清空来有效地将这个事实传达给垃圾收集器。

通常来说，如果一个类管理自己的内存，那么就一定要注意内存泄漏。当一个元素被释放时，该元素包含的任何对象引用都应该被清空。

> 上面所说的清空，原文是 null out，在程序中也就是将变量指向 null；而消除的原文是 eliminate，这个的含义更广泛点，包括了 null out，还有让变量 fall out of scope。

### 缓存

第二种常见的内存泄漏源是缓存。一旦把一个对象的引用放到缓存中，就很容易忘记它的存在，使它长时间留在缓存中。

有两种情况：

当所要的缓存项的生命周期是由该键的外部引用而不是由值决定时，可以用 `WeakHashMap` 代表缓存。key-value 对会在它们被废弃之后自动移除；

更常见的情况时，缓存项的寿命没有明确定义，但随着时间的推移会变得越来越没有价值，在这种情况下，应该偶尔清除不用的缓存项。清除工作可以由一个后台线程（可能是 `ScheduledThreadPoolExecutor`）来完成。也可以在给缓存添加新条目的时候顺便进行清理（`LinkedHashMap` 的 `removeEldestEntry()` 方法）。对于更加复杂的缓存，可能需要使用 java.lang.ref。

### 监听器和其他回调

第二种常见的内存泄漏源是监听器和其他回调。注册回调却没有显式地取消注册，它们就会不断地堆积。确保回调被及时垃圾回收的一个方法是只保存它们的弱引用（weak reference），例如将他们仅作为键保存在 `WeakHashMap` 中。

### 总结

因为内存泄漏通常不会表现为明显的故障，它们可能会在系统中存在多年。 它们通常仅在仔细检查代码或借助称为堆分析器（heap profiler）的调试工具的帮助下才能被发现。 因此，学会在问题发生之前预测并防止它们发生是非常可取的。

## 8. 避免使用 finalizer 和 cleaner

### finalizer 和 cleaner 不能保证及时性

Finalizer 是不可预测的，通常很危险，一般情况下是不必要的。使用 finalizer 通常会导致行为不稳定、性能降低，以及可移植性问题。虽然终结方法有少数几个合法用法会在本条后面讲到，但作为一项规则，应该避免使用它们。到 Java 9，finalizer 被废弃，但 Java 类库中依然使用它们。Java 9 提供了替代 finalizer 的 cleaner。**Cleaner 没有 finalizer 那么危险，但同样不可预测、缓慢，且一般情况下都是不必要的。**

Finalizer 和 cleaner 的一个缺点在于**不能保证会被及时执行**，从一个对象变成不可达，到它的 finalizer 或 cleaner 开始运行，这中间的时间可以为任意长。这就意味着，**永远不要在 finalizer 或者 cleaner 中做任何需要及时完成的事情**。例如，不应该在 finalizer 或 cleaner 方法中执行关闭文件的操作，这是一种严重的错误，因为文件描述符是一种有限的资源。

Finalizer 和 cleaner 执行的及时性主要是垃圾收集算法的功能，这种算法在不同的 JVM 实现中会大相径庭。依赖 finalizer 或 cleaner 执行及时性的程序的行为也同样会发生变化。

Finalizer 线程的优先级很低，所以它并不能及时执行。语言规范没有保证哪个线程来执行 finalizer。所以除了不使用 finalizer 外，没有任何可抑制的办法来解决这个问题。Cleaner 在这点上比 finalizer 好一点点，因为类作者可以控制他自己的 cleaner 线程，但 cleaner 仍然还是在后台运行，受垃圾收集器的控制，所以也不能保证它可以及时清理。

实际上，语言规范甚至**不保证 finalizer 或 cleaner 最终可以运行**，这是完全有可能的：一个程序终止了，但没有运行一些不可达对象的 finalizer 或 cleaner。作为结论，**永远不要在 finalizer 或 cleaner 中更新要持久化的状态。**例如，如果依赖 finalizer 或 cleaner 来释放一个共享资源（如数据库）上的持久化锁（persisitent lock）时，很容易让整个数据库垮掉。

> `System.gc` 和 `System.runFinalization` 这两个方法确实增加了 finalizer 或 cleaner 被执行的机会，但是它们同样也并不保证 finalizer 或者 cleaner 一定会被执行。
> 
> `System.runFinalizersOnExit` 和 `Runtime.runFinalizersOnExit` 曾经声称可以做出上面的保证，但它们都有严重的缺陷，已经被废弃几十年了。

### finalizer 会掩盖异常

如果在某个对象 finalization 期间抛出了一个未被捕捉的异常，那么这个对象的 finalization 会直接结束。未被捕捉的异常可能使对象处于破坏的状态（corrupt state）中，任意不确定的行为都有可能发生。并且，这个未被捕捉的异常不会停止当前线程，也不会打印堆栈信息。Cleaner 不会有这个问题，因为使用 cleaner 的类库可以控制自己的线程。

### finalizer 和 cleaner 有严重的性能损失

不使用 finalizer 比使用 finalizer 快了很多，因为 finalizer 限制了有效的垃圾回收。

如果使用 finalizer 和 cleaner 来清除一个类的所有实例，那么它们的速度差不多；如果只把它们当成一道安全网（safety net），cleaner 会比 finalizer 快很多，但还是比不使用安全网慢了很多。

### finalizer 有严重的安全问题

Finalizer 为 _finalizer attack_ 敞开了大门。Finalizer attack 很简单：如果在一个构造函数或者「其序列化的等价物」（serialization equvalents，`readObject` 和 `readResolve` 方法，详见第 12 章）抛出异常，那么恶意子类的 finalizer 就可以在这个部分创建的对象上运行了，而这个对象本应该已经 “死” 了。Finalizer 可以用一个静态域记录这个对象引用，阻止它被垃圾回收。一旦这个对象被记录了，就可以很轻松调用它的任意方法，而这些方法本来就不应该被允许存在。**在构造器中抛出异常，可以保证防止对象继续存在，但如果存在 finalizer 就无法保证。**这种攻击会造成严重的后果。Final 类免疫这种攻击，因为它是不可被继承的。**为了保护非 final 类免受 finalizer attack，可以编写一个空的 final `finalize` 方法。**

> 个人理解：任何构造器的第一步都是调用父类的构造器，恶意子类的构造器故意让父类的构造器抛出异常。那么这个类就会创建失败，等待被垃圾收集器回收。而垃圾收集器在释放这个对象的内存时，会先调用它的 `finalize` 方法，此时如果恶意子类重写了 `finalize` 方法，并保存了对象的引用，那么这个对象就不会被清除，然而它不应该是存在的。这种情况好像在 Java 8 之后解决了，但还有新的攻击方式。针对描述的攻击方式，试着写了个例子：
> 
> public class Secret {  
>  public Secret(int password) {  
>      if (password == 0) {  
>          throw new IllegalArgumentException();  
>      }  
>  }  
>   
>  public String getSecret() {  
>      return "secret!";  
>  }  
> }  
>   
> class FinalizerAttack extends Secret {  
>  public static Secret instance;  
>  public FinalizerAttack() {  
>      super(0);  
>  }  
>   
>  @Override  
>  protected void finalize() throws Throwable {  
>      instance = this;  
>  }  
> }

### 如果需要关闭资源

如果对象封装了必须被关闭的资源时，该用什么取代 finalizr 或 cleaner 呢？可以让这个类实现 `AutoCloseable` 接口，然后要求客户端在每个不需要的实例上调用 `close` 方法，通常使用 try-with-resource 来确保异常（详见第 9 条）的时候也能关闭资源。还有一个需要注意的是，实例必须跟踪到它是否被关闭了： `close` 方法必须在一个域中记录该对象不再有效，其他方法必须检查该域，并在对象关闭后调用它们时抛出 `IllegalStateException`。

### finalizer 和 cleaner 的合法用法

#### 安全网

当资源拥有者忘记调用 `close` 方法的时候，它们可以作为安全网（safety net）。虽然仍然无法保证 finalizer 或 cleaner 能及时（或者压根不）运行，但如果客户端没有这样做，晚释放资源总比不释放好。如果真的考虑提供这个安全网，要考虑清楚这种保护是否值得付出这样的代价。有些 Java 类库的类，如 `FileInputStream`、`FileOutputStream`、`ThreadPoolExcutor` 和 `java.sql.Connection` 都有作为安全网的 finalizer。

#### 回收本地对等体

一个本地对等体就是一个本地（也就是 non-Java）对象，普通对象通过本地方法委托给它。因为一个本地对等体不是一个正常对象，垃圾回收器不认识它，也不能在它 Java 对等体被回收时回收它。如果可接受性能，且本地对等体不持有重要资源，那么 cleaner 或者 finalizer 就是完成这项任务的合适工具。但如果不能接受性能，或者本地对等体持有必须被及时回收的重要资源，那么这个类就必须有一个 `colse` 方法，如前所述。

### Cleaner 的使用方式

> TODO：这一小节看了好久，整个都没看明白，感觉也不太需要看。。。

Cleaner 的使用方式有一点技巧，下面以一个简单的 `Room` 类为例来演示。假设所有的 room 在被回收前必须被 cleand。`Room` 类实现了 `AutoCloseable`；它的自动 cleaning safety net 使用了一个 cleaner，这只是一个实现细节。与 finalizer 不同，cleaner 不会污染类的 public API：

 // An autocloseable class using a cleaner as a safety net  
 public class Room implements AutoCloseable {  
     private static final Cleaner cleaner = Cleaner.create();  
 ​  
     // Resource that requires cleaning. Must not refer to Room!   
     private static class State implements Runnable {  
         int numJunkPiles; // Number of junk piles in this room  
           
         State(int numJunkPiles) {  
             this.numJunkPiles = numJunkPiles;  
         }  
 ​  
         // Invoked by close method or cleaner   
         @Override   
         public void run() {  
             System.out.println("Cleaning room");  
             numJunkPiles = 0;  
         }  
     }  
 ​  
     // The state of this room, shared with our cleanable  
     private final State state;  
 ​  
     // Our cleanable. Cleans the room when it’s eligible for gc  
     private final Cleaner.Cleanable cleanable;  
       
     public Room(int numJunkPiles) {  
         state = new State(numJunkPiles);  
         cleanable = cleaner.register(this, state);  
     }  
 ​  
     @Override   
     public void close() {  
         cleanable.clean();  
     }   
 }

静态内部类 `State` 持有 cleaner 打扫房间所需的资源。在此例中，资源是 `numJunkPiles` 域，代表了房间垃圾堆的数量。更现实的说，它可以是一个 final long，它包含一个指向本地对等体的指针。`State` 实现了 `Runnable` 接口，它的 `run` 方法最多被调用一次，而它是由在 Room 构造函数中向 cleaner 注册 `State` 实例时获得的 `Cleanable` 调用。只有两种情况会触发 `run` 方法的调用：通常是通过调用 `Room` 的 `close` 方法，然后 `close` 方法内部调用 `Cleanable` 的 `clean` 方法来触发的。 如果客户端在 `Room` 实例可以被垃圾收集时未能调用 `close` 方法，则 cleaner 将（有希望）调用 `State` 的 `run` 方法。

关键是 `State` 实例没有引用它的 `Room` 实例。如果它引用了，就会产生一个循环，那么就会阻止 `Room` 实例被垃圾回收（以及被 automatically cleaned）。因此，`State` 必须是一个静态内部类，因为**非静态内部类会包含其外围实例的引用**。同样的，也不建议使用 lambda，因为它们很容易捕捉到外围对象的引用。

`Room` 的 cleaner 只用来作为安全网，如果客户端将所有 `Room` 的实例化都包在 try-with- resource 块中，那么 automatic cleaning 就永远不会发生：

public class Adult {  
    public static void main(String[] args) {  
        try (Room myRoom = new Room(7)) {  
            System.out.println("Goodbye");  
        }   
    }  
}

上面的程序会打印出 “Goodbye”，接着是 “Cleaning room”。但下面这个程序：

public class Teenager {  
    public static void main(String[] args) {  
        new Room(99);  
        System.out.println("Peace out");  
    }  
}

在作者的机器上，只打印出了 “Peace out” 就直接退出程序。这就是之前提到的不可预测性。Cleaner 规范指出：”cleaner 在 System.exit 期间的行为与具体实现有关。不保证 cleaning action 是否被调用。“ 虽然规范没有指明，但对于正常的程序退出来说也是如此。在作者的机器上，在 `Teenager` 的主方法中加入 `System.gc()` 一行就可以使它在退出前打印出 “Cleaning room”，但不能保证你在你的机器上也能看到同样的行为。

### 总结

总之，不要使用 cleaner，或者在 Java 9 之前的版本中不要使用 finalizer，除非作为安全网或终止非关键的本地资源。即使如此，也要注意不确定性和性能方面的后果。

## 9. try-with-resources 优先于 try-finally

Java 库中包含了很多资源，这些资源在使用过必须通过调用 `close()` 方法来手动关闭，例如 `InputSteam`、`OutputStream`和 `java.sql.Connection`。客户端总是会忘记关闭资源，这可能会严重影响性能。许多资源都是使用终结方法作为安全网，但它效果并不理想（第 8 条）。

### try-finally

最初，`try-finally` 语句是保证资源正确关闭的最佳方式，即使遇到异常或返回也不影响：

// try-finally - No longer the best way to close resources!  
static String firstLineOfFile(String path) throws IOException {   
    BufferedReader br = new BufferedReader(new FileReader(path));   
    try {  
		return br.readLine();  
    } finally {  
		br.close();  
	}  
}

但是如果添加第二个资源，就会一团糟了：

// try-finally is ugly when used with more than one resource!  
     
static void copy(String src, String dst) throws IOException {  
    InputStream in = new FileInputStream(src);  
    try {  
        OutputStream out = new FileOutputStream(dst);  
        try {  
            byte[] buf = new byte[BUFFER_SIZE];  
            int n;  
            while ((n = in.read(buf)) >= 0)  
                out.write(buf, 0, n);  
        } finally {  
            out.close();  
        }  
    } finally {  
        in.close();  
    }   
}

这时候，try-finally 的代码就很容易出错。即便 `try-finally` 能正确关闭资源，但也有很多不足。try 块和 finally 块的代码都有可能会抛出异常。例如，假设在 `firstLineOfFile()` 方法中，底层物理设备异常，导致 `readLine()` 抛出异常，并且 `close()` 也因为同样的原因失败。这样，第二个异常就会完全抹除第一个异常，并且在异常堆栈中完全没有第一个异常的记录。这将会导致很难找出错误原因，因为在解决问题的时候通常会关注第一个异常。虽然可以编写代码来抑制掉第二个异常，使得抛出第一个异常，但这样做太麻烦了。

### try-with-resource

所有这些问题都可以通过 Java 7 引入的 `try-with-resources` 解决。要使用这种方法的资源，必须先实现 `AutoCloseable` 接口，其中只包含了一个返回 void 的 `close` 方法 。如果要编写一个代表**必须**被关闭的资源的类，必须要实现 `AutoCloseable` 接口。

// try-with-resources - the the best way to close resources!  
static String firstLineOfFile(String path) throws IOException {  
    try (BufferedReader br = new BufferedReader(new FileReader(path))) {  
        return br.readLine();  
    }   
}

// try-with-resources on multiple resources - short and sweet  
static void copy(String src, String dst) throws IOException {  
    try (InputStream in = new FileInputStream(src);   
         OutputStream out = new FileOutputStream(dst)) {  
        byte[] buf = new byte[BUFFER_SIZE];  
        int n;  
        while ((n = in.read(buf)) >= 0)  
            out.write(buf, 0, n);  
    }  
}

使用 `try-with-resources` 不仅使代码变得更简洁易懂， 也更容易进行诊断 。 以 `first­LineOfFile` 方法为例，如果调用 `readLine` 和（不可见的）`close` 方法都抛出异常，后一个异常就会被抑制，以保留第一个异常。这种被抑制的异常并不是简单地被抛弃了，而是会被打印在堆栈轨迹中，并注明它们是被抑制的。通过调用 Java 7 引入的 `getSuppressed` 方法可以访问到它们。

在 `try-with-resources` 语句中还可以使用 **catch** 子句，就像在平时的 `try-finally` 语句中一样。这样既可以处理异常，又不需要再套用一层代码。下面这个范例中，如果 `firstLineOfFile` 方法不会抛出异常，但是如果它无法打开文件，或者无法从中读取，就会返回一个默认值：

// try-with-resources with a catch clause  
static String firstLineOfFile(String path, String defaultVal) {  
    try (BufferedReader br = new BufferedReader(new FileReader(path))) {  
        return br.readLine();  
    } catch (IOException e) {  
        return defaultVal;  
    }   
}

### 总结

如果资源必须被关闭，那么 `try-with-resourece` 永远优于 `try-catch`。产生的代码更短更清晰，产生的异常也会更有用，并且编写代码时更不容易出错。

# 二. 对于所有对象都通用的方法

## 10. 覆盖 equals 时请遵守约定

以下这些情况不需要覆盖 `equals` 方法：

-   类的每个实例本质上都是唯一的 。对于代表活动实体而不是值的类来说确实如此，例如 `Thread`。 `Object` 提供的 `equals` 实现对于这些类来说正是正确的行为。
    
-   类没有必要提供 “逻辑相等”（logical equality）的测试功能。比如代表正则表达式的 `Pattern`，设计者并不认为客户需要或者期望检查两个 `Pattern` 实例是否代表同一个正则表达式。
    
-   超类已经覆盖了 `equals`，且超类的行为对于这个类也是合适的。
    
-   类是私有的，或者是包级私有，可以确定它的 `equals` 方法永远不会被调用。也可以确保它不会被意外调用：
    
    @Override   
    public boolean equals(Object o) {  
    	throw new AssertionError(); // Method is never called  
    }
    
    果类具有自己特有的“逻辑相等”( logical equality)概念(不同于对象等同的概念)，而且超类还没有覆盖 equals。 这通常属于“值 类”( value class)的情形 。
    

## 11. 覆盖 equals 时总要覆盖 hashcode

**在每个覆盖了 equals 方法的类中， 都必须覆盖 `hashCode` 方法 。**如果不这样做的话，就会违反 `hashCode` 的通用约定，从而导致该类无法结合所有基于散列的集合一起正常运作，这类集合包括 `HashMap` 和 `HashSet`。

下面是约定的内容，摘自 `Object` 规范：

> -   在应用程序的执行期间，只要对象的 `equals` 方法的比较操作所用到的信息没有被修改，那么对同一个对象的多次调用， `hashCode` 方法都必须始终返回同一个值 。 在一个应用程序与另一个程序的执行过程中，执行 `hashCode` 方法所返回的值可以不一致。
>     
> -   如果两个对象根据 `equals(Object)` 方法比较是相等的，那么调用这两个对象中的 `hashCode` 方法都必须产生同样的整数结果。
>     
> -   如果两个对象根据 `equals(Object)` 方法比较是不相等的，那么调用这两个对象中的 hashCode 方法，则不一定要求 `hashCode` 方法必须产生不同的结果。
>     

没有覆盖 `hashCode` 违反了第二条。因为重写的 `equals` 方法，可能使两个实例在逻辑上相等，但 `hashcode` 只会返回两个随机整数。这种情况下，`HashMap` 极大可能将这两个实例放入不同的桶中，即使碰巧落在了同一个桶，也可以同时存在。因为 `HashMap` 会先检查实例的 `hashcode` 是否相同，如果不同就不会再去检验 `equals`。

### 手动编写

一个理想的散列函数会为不同的对象产生不相等的散列码，一个十分接近理想的解决办法：

1.  声明一个 int 类型的变量 result，将它初始化第一个关键域的散列码（关键域指的是影响 equlas 比较的域）。
    
2.  对剩下的每一个关键域完成以下步骤：
    
    1.  计算该域的散列码 c：
        
        1.  如果该域是基本类型，计算 `Type.hashCode()`，这里的 Type 是基本类型对应的装箱基本类型；
            
        2.  如果该域是一个对象引用，并且该类的 `equals` 方法通过递归地调用 `equals` 的方式来比较这个域，则同样为这个域递归地调用 `hashCode`。 如果需要更复杂的比较，则为这个域计算一个“范式”（canonical representation），然后针对这个范式调用 `hashCode`。 如果这个域的值为 null， 则返回一个常数，通常是 0。
            
            > -    不懂范式啥意思。
            
        3.  如果该域是一个数组，则要把每一个元素当作单独的域来处理。也就是说，递归地应用上述规则，对每个重要的元素计算一 个散列码，然后根据步骤 2.2 中的做法把这些散列值组合起来。如果数组域中没有重要的元素，可以使用一个常量，但最好不要用 0。 如果数组域中的所有元素都很重要，可以使用 Arrays.hashCode方法。
            
    2.  将 2.1 中计算得到的散列码 c 合并到 result 中：`result = 31 * result + c;`。
        
3.  返回 `result`。
    

**注意：**

-   计算散列码的时候，可以把衍生域（derived field）排除在外。
    
-   必须排除 equals 比较计算中没用到的任何域，否则可能违反 hashCode 约定的第二条。
    
-   不要试图从散列码计算中排出一个对象的**关键域**，虽然散列函数运行更快，但当散列表面对大量的实例时可能会变得十分慢。
    

步骤 2.2 的乘法部分使得散列值会依赖域的顺序，否则只是字母顺序的不同的 `String` 也会返回相同的散列码。之所以选择 31 ，是因为它是一个奇素数。如果乘数是偶数，并且乘法溢出的话，信息就会丢失，因为与 2 相乘等价于移位运算。使用素数的好处并不很明显，但是习惯上都使用素数来计算散列结果。31 有个很好的特性，即用移位和减法来代替乘法，可以得到更好的性能： `31 * i = = ( i << 5 ) - i`。 现代的虚拟机可以自动完成这种优化 。

### 其他方案

如果想用更好的散列函数，参阅：Guava’s com.google.common.hash.Hashing [Guava]。

`Objects` 的静态方法 `hash()` 接收任意数量的参数并返回一个散列码。与手动编写的方案质量相当，但运行速度慢一些，因为会有数组的创建。而且如果参数有基本类型，还需要装箱和拆箱。

### 缓存散列码

如果类是不可变的，且计算散列码开销较大，可以将散列码缓存在对象内部。如果这个类的大多数实例都会用来作为散列键（hash key），就应该在创建实例的时候计算散列码。否则可以选择延迟初始化散列码。

## 12. 始终要覆盖 toString

`Object` 提供的 `toString` 方法返回类名加 @ 再加上散列码的无符号十六进制。

在静态工具类（详见第 4 条）中编写 `toString` 方法是没有意义的 。 也不要在大多数枚举类型（详见第 34 条）中编写 `toString` 方法，因为 Java 已经为你提供了非常完美的方法 。 但是，在所有其子类共享通用字符串表示法的抽象类中，一定要编写一个 `toString` 方法 。 例如，大多数集合实现中的 `toString` 方法都是继承自抽象的集合类 。

## 13. 谨慎地覆盖 clone

`Cloneable` 接口的目的是作为对象的一个 _minxin_ 接口（详见第 20 条），表明这样的对象允许克隆。这个接口并不包含 `clone` 方法，而 `Object` 的 `clone` 方法是受保护（意思是 native 的？）的。它的作用是：如果一个类实现了 `Cloneable`，`Object` 的 `clone` 方法就返回该对象的逐域拷贝，否则就会抛出 `CloneNotSupportedException` 异常。

> 通常情况下，实现接口是为了表明类可以为它的客户做些什么。然而，对于 `Cloneable` 接口，它改变了超类中受保护的方法的行为 。

虽然规范中没有明确指出，事实上，**实现 `Cloneable` 接口的类是为了提供一个功能适当的公有的 `clone` 方法**，由此得到一种语言之外的机制：它无须调用构造器就可以创建对象 。

> 下面是来自 Object 规范中的约定内容：
> 
> 1.  `x.clone() != x` 返回 true
>     
> 2.  `x.clone().getClass() == x.getClass` 返回 true
>     
> 3.  `x.clone().equals(x)` 返回 true
>     
> 
> 这些都不是绝对的要求

TODO

# 三. 类和接口

## 15. 使类和成员的可访问性最小化

### 信息隐藏

区别组件设计好坏的最重要因素就是：组件对其他组件隐藏其内部数据和其他实现细节的程度。设计良好的组件将它所有的实现细节都隐藏起来，将 API 和它的实现干净地分开。之后，组件直接只通过它们的 API 通信，并且都不知道对方内部所做的工作。这个概念被称为**信息隐藏**或**封装**，是软件设计的一个基本原则。

信息隐藏的最大原因就是它可以将系统组件解耦，使它们可以被开发、测试、优化、使用、理解和独立修改。这加速了系统的开发，因为组件可以并行开发。它也减轻了维护的负担，因为组件容易理解、调试和替换。虽然信息隐藏本身并不能带来良好的性能，但它可以实现有效的性能调整：一旦系统完成，并且剖析确定了哪些组件导致了性能问题（详见第 67 条），这些组件就可以被优化而不影响其他组件的正确性。信息隐藏提高了软件的可复用性。最后，信息隐藏减少了构建大型系统的风险，因为即使系统不成功，单个组件也可能被证明是成功的。

**尽可能使每个类或者成员不被外界访问**，也就是说将访问级别降到最低。

### 类

对于顶层的（top-level or non-nested）类和接口，只有两种访问级别：package-private 和 public。如果顶层的的类或者接口可以是 package-private 的，那么它就应该是 package-private，这样它就成为了实现的一部分，而不是 exported API。并且在之后的版本中对它修改、替换或者删除，都不会破坏客户端。但如果它是 public，就有义务永远维护兼容性。

如果一个 package-private 的顶层类或者接口**只是**在某一个类的内部被用到，就应该考虑使它成为唯一使用它的那个类的 private static 嵌套类（详见第 24 条），将它的可访问范围缩小到使用它的那个类。然而，降低不必要 public 类的可访问性重要的多：因为 public 类是包的 API 的一部分，而 package-private 的顶层类是这个包的实现的一部分 。

### 成员（域、方法、嵌套类和嵌套接口）

-   私有的（private）：只有在声明该成员的顶层类内部（内部包括嵌套类）才可以访问这个成员。
    
-   包级私有的（package-private）：声明该成员的包内部的任何类都可以访问。（接口成员如果不指定访问级别，默认是公有的）
    
-   受保护的（protected）：声明该成员的类的子类和所在包内部的任何类可以访问。
    
-   公有的（public）
    

private 和 package-private 成员都是一个类的实现中的一部分，一般不会影响导出的 API。然而，如果这个类实现了 `Serializable` 接口（详见第 86 条和第 87 条），这些域就有可能被泄露到导出的 API 中。

对于公有类的成员，protected 成员是类导出的 API 的一部分，必须永远得到的支持。导出的类的受保护成员也代表了该类对于某个实现细节的公开承诺（详见第 19 条）。应该尽量少用 protected 成员。

如果方法覆盖了超类中的一个方法， 子类中的访问级别就不允许低于超类中的访问级别。这样可以确保任何可使用超类的实例的地方也都可以使用子类的实例（里氏替换原则，详见第 10 条）。这条规则有一个特例：如果一个类实现了一个接口，那么类所实现的接口方法必须声明为 public。

为了测试，可以将 public 类的 private 变成 package-private，但最好不要超过 pacakge-private。

> 测试类可以当作被测试类是同一个包，所以能访问被测试类 package-private 成员。

**public 类不应该有任何 public 实例域** （详见第 16 条）：

-   如果实例域是非 `final` 的，或者是一个指向可变对象的 `final` 引用， 那么一旦使这个域成为 public 的，那么它能在任何地方被修改。因此，包含 public 可变域的类通常并不是线程安全的。
    
-   即使域是 `final` 的，并且引用不可变的对象，但当把这个域变成 public 的时候，也就放弃了“切换到一种新的内部数据表示法” 的灵活性 。
    

这条建议也同样**适用于 static 域**，只是有一种情况例外。假设常量构成了类提供的整个抽象中的一部分，可以通过 `public static final` 域来暴露这些常量。按惯例，这种域的名称由大写字母组成 ，单词之间用下划线隔开（详见第 68 条）。很重要的一点是，这些域**要么是基本类型，要么是指向不可变对象的引用**（详见第 17 条）。如果 `final` 域包含可变对象的引用，它便具有非 `final` 域的所有缺点。**虽然引用本身不能被修改，但是它所引用的对象却可以被修改**，这会导致灾难性的后果 。

注意，长度非零的数组总是可变的，所以让类具有 `public static final` 数组域，或者返回这种域的访问方法，这是错误的。如果类具有这样的域或者访问方法，客户端将能够修改数组中的内容。 这是安全漏洞的一个常见根源：

// Potential security hole!  
public static final Thing[] VALUES= { .. . };

修正这个问题有两种方法。可以使 public 数组变成 private 的，并增加一个 public 的不可变列表，或者添加一个 public 方法返回 private 数组的一个拷贝：

// 1.  
private static final Thing[] PRIVATE_VALUES = { ... };   
public static final List<Thing> VALUES = Collections.unmodifiableList(Arrays.aslist(PRIVATE_VALUES));  
  
// 2.  
private static final Thing[] PRIVATE_VALUES = { ... };  
public static final Thing[] values() {return PRIVATE_VALUES.clone();}

除了 `public static final` 域的特殊情形之外（此时它们充当常量），**公有类都不应该包含公有域**，并且要确保公有静态 `final` 域所引用的对象都是不可变的 。

### 模块系统

> TODO：感觉不用看，而且也没看懂。

Java 9 引入了两个额外的、隐含的访问级别，作为模块系统（module system）的一部分。模块是一组包，就像包是一组类一样。一个模块可以通过模块声明（module declaration）中的导出声明（export declarations）显式导出一部分包（按照惯例，模块声明包含在一个名为 module-info.java 的源文件中）。模块中未导出的 public 和 protected 成员在模块外无法被访问；在模块内部，可访问性不受导出声明影响。使用模块系统允许你在一个模块内的包之间共享类，而不使它们对所有人可见。在未导出的包中，public 类的 public 成员和 portected 成员产生了两个隐含的访问级别，它们是 intramodular analogues of the normal public and protected levels。对这种共享的需求相对较少，通常可以通过重新安排包中的类来消除。

与四个主要的访问级别不同，两个基于模块的级别主要是咨询性的（advisory）。如果你把模块的 JAR 文件放在应用程序的类路径（class path）上，而不是模块路径（module path）上，那么模块中的包就会恢复到它们的非模块化行为：包的 public 类中的所有 public 成员和 protected 成员都具有正常的可访问性，无论这些包是否被模块导出。这两个新引入的访问级别被严格执行的地方是 JDK 自己：Java 库中未导出的包在其模块之外是真正不可访问的。

对于典型的 Java 程序员来说，模块所提供的访问保护不仅作用有限，而且在很大程度上是咨询性质的；为了利用它，你必须将你的包归入模块，在模块声明中明确它们的所有依赖关系，重新安排你的源代码树，并采取特别的行动来适应从你的模块中对非模块化包的任何访问。现在说模块是否会在 JDK 之外得到广泛使用还为时过早。同时，除非有令人信服的需要，否则最好避免使用它们。

## 16. 在 public 类中使用访问方法，而不是 public 域

下面这种类，除了用于将域组合在一起，没有任何目的：

// Degenerate classes like this should not be public!  
class Point {  
    public double x;  
    public double y;  
}

因为这种类的数据域都可以直接方法，类没有提供给外界任何封装的好处。不改变 API 就不能改变类的表示法（representation）；不能实现约束条件（invariants）；不能在域被访问的时候采取辅助行动。这种类应该被下面的类替代，下面的类使用 private 域、public 访问方法（getters），针对可变类，提供修改方法（mutators 或 setters）：

> -   不能改变类的表示法，也就是类怎么实现自己的功能。如果将域暴露出去，客户端直接使用了这些域，那么即使在该类试图修改内部实现方式的时候，也永远不能删除这个域（修改了就是改变 API），否则客户端会发生编译错误。
>     
> -   不能实现约束条件，如果把可变对象暴露给外界，类的一些约束（比如开始时间在结束之前、一天有 24 小时等）就可能被外界破坏。
>     
> -   不能采取辅助行动，也就是在 get 方法中，对域作辅助处理。比如用 1,2...,7 来表示周一到周日，那么在返回这个数字的时候，可能将它转为字符串。
>     
> -   getter 和 setter 好像可以统称 accessor。
>     

 // Encapsulation of data by accessor methods and mutators  
 class Point {  
     private double x;  
     private double y;  
     public Point(double x, double y) {  
         this.x = x;  
         this.y = y;   
     }  
       
     public double getX() { return x; }  
     public double getY() { return y; }  
       
     public void setX(double x) { this.x = x; }  
     public void setY(double y) { this.y = y; }  
 }

如果一个类是 public，那么就提供访问方法以保持改变该类内部表示的灵活性。如果一个 public 类暴露了它的数据域，那么就不可能再改变内部表示了。

但是，如果一个类是 package-private 的或者是 private nested 类，假设它们充分描述了类所提供的抽象性，那么就可以暴露它的数据域。因为这种方法比访问方法产生的视觉混乱更少。就算类的内部表示法需要修改时，同时要被修改的代码被限制在同一个包中，可以在不影响包外任何代码的情况下进行改变。在 private nested 类的情况下，改变的范围仅仅被限制在外部的类中。

> Java 类库中有好几个违反了这条建议，有名的例子有 java.awt. 包内的 `Point` 和 `Dimension`。正如第 67 条所说，暴露`Dimension` 类的内部结构导致了一个严重的性能问题，这个问题至今仍然存在。

永远不要直接暴露 public 类的域，但是如果暴露不可变的域，影响会稍微小一点。虽然依然不能类表示法，除非修改 API；也不能再读取域的时候，也无法采取辅助行动，但是可以强制约束条件。

总而言之，public 类永远不应该暴露出可变域，暴露不可变域危害稍微小一点，但仍然不建议。但是，对于 package-private 类或 private nested 类来说，无论暴露可变或不可变域的，有时都是可取的（因为只影响包类或外部类）。

## 17. 最小化可变性

不可变类是指其实例不能被修改的类。每个实例中包含的所有信息都必须在创建该实例的时候就提供，并在对象的整个生命周期（lifetime）内固定不变。Java 类库中有很多不可变类，如 `String`、装箱类型、`BigInteger` 和 `BigDecimal`。不可变类比可变类更加易于设计、实现和使用，不容易出错且更加安全。

为了使类成为不可变，要遵循下面五条规则：

1.  不要提供任何会修改对象状态的方法。
    
2.  保证类不会被继承。这可以防止粗心的或恶意的子类通过表现得像对象的状态发生了变化，而破坏类的不可变行为。
    
    > 防止子类化的做法：
    > 
    > 1.  将该类声明为 `final`。
    >     
    > 2.  让类的所有构造器都变成私有的或者包级私有的，并添加公有的静态工厂（static factory）来代替公有的构造器（详见第 1 条）。这种方法还允许添加后面提到的对象缓存能力。
    >     
    > 
    > > `BitInteger` 和 `BigDecimal` 刚编写出来的时候，对于 “不可变的类必须为 `final`” 的说法还没有得到广泛的理解，所以它们的所有方法都有可能被覆盖。为了保持向后兼容，这个问题一直无法得以修正。如果你在编写一个类，它的安全性依赖于来自不可信客户端的 `BigInteger` 或者 `BigDecimal` 参数的不可变性，就必须进行检查，以确定这个参数是否为“真正的” `BigInteger` 或者 `BigDecimal` ，而不是不可信任子类 的实例。如果是后者，就必须在假设它可能是可变的前提下对它进行保护性拷贝（详见第 50 条）：
    > > 
    > > public static BigInteger safeInstance(BigInteger val) {  
    > >     return val.getClass() == BigInteger.class ? val : new BigInteger(val.toByteArray());  
    > > }
    
3.  声明所有的域都是 final 的。通过这种「系统上的强制方式」可以清楚地表明意图。并且，如果对新创建的实例的引用从一个线程传递到另一个线程而不同步，则有必要确保行为的正确性，正如内存模型中所阐述的那样
    
4.  声明所有的域都是私有的。防止客户端访问可变对象域并直接修改这些对象。
    
    > 虽然不可变类可以具有 `public final` 域，只要这些域包含基本类型的值或者指向其他不可变对象的引用。但是不建议这样做（除了 `public static final`），因为暴露出去之后，在后续的版本中就无法改变内部的表示法。
    
5.  确保对于任何可变组件的互斥访问。如果类具有指向可变对象的域，则必须确保该类的客户端无法获得指向这些对象的引用。并且，永远不要用客户端提供的对象引用来初始化这样的域，也不要从任何访问方法（accessor）中返回该对象引用。在构造器、访问方法和 `readObject` 方法（详见第 88 条）中请使用保护性拷贝（defensive copy）技术（详见第 50 条）。（设值方法：mutator）
    

// Immutable complex number class public final class Complex { private final double re; private final double im;  
public Complex(double re, double im) {  
        this.re = re;  
        this.im = im;  
    }  
    public double realPart()      { return re; }  
    public double imaginaryPart() { return im; }  
    public Complex plus(Complex c) {  
        return new Complex(re + c.re, im + c.im);  
	}  
    public Complex minus(Complex c) {  
        return new Complex(re - c.re, im - c.im);  
	}  
    public Complex times(Complex c) {  
        return new Complex(re * c.re - im * c.im,  
                           re * c.im + im * c.re);  
	}  
    public Complex dividedBy(Complex c) {  
        double tmp = c.re * c.re + c.im * c.im;  
        return new Complex((re * c.re + im * c.im) / tmp,  
                           (im * c.re - re * c.im) / tmp);  
	}  
    @Override   
	public boolean equals(Object o) {  
       if (o == this)  
           return true;  
       if (!(o instanceof Complex))  
           return false;  
       Complex c = (Complex) o;  
       return Double.compare(c.re, re) == 0 && Double.compare(c.im, im) == 0;  
    }  
    @Override   
	public int hashCode() {  
        return 31 * Double.hashCode(re) + Double.hashCode(im);  
    }  
    @Override   
	public String toString() {  
        return "(" + re + " + " + im + "i)";  
  
    }   
}

Complex 类提供了访问属性的方法，还有四种运算方法。这四种方法返回了新的 Complex 实例。这种方法的模式成为函数的（functional）方法，因为这些方法返回了一个函数的结果，这些函数对操作数进行运算但并不修改它。与之相对应的是过程的（procedural）或者命令式的（imperative）方法，这种方法将一个过程作用在操作数上，会导致它的状态发生变化。这种方法的名称都是介词（如 plus），函数式方法的名称通常是动词（如 add）。

不可变对象只有**一种状态**，即被创建时的状态，而可变对象有任意复杂的状态空间。

不可变对象本质上是**线程安全**的，它们不要求同步 。

应该尽可能重用现有的不可变类的实例，对于频繁用到的值，为它们提供 `public static final` 常量。也可以进一步拓展：不可变的类可以提供一些静态工厂，把频繁被请求的实例缓存起来。这样，客户端之间可以共享现有的实例，从而降低内存占用和垃圾回收的成本。

> -   基本类型的包装类 和 `BigInteger` 都有这样的静态工厂。
>     
> -   设计新的类时，选择用静态工厂代替公有的构造器可以使得以后有添加缓存的灵活性，而不必影响客户端。
>     

“**不可变对象可以被自由地共享**” 导致的结果是，永远也不需要进行保护性拷贝（defensive copy）（详见第 50 条)。 实际上根本无须做任何拷贝，因为这些拷贝始终等于原始的对象。因此不需要也不应该为不可变的类提供 `clone` 方法或者拷贝构造器（详见第 13 条）。这一点在 Java 平台的早期并不好理解，所以 `String` 类仍然具有拷贝构造器，但是应该尽量少用它（详见第 6条）。

**不仅可以共享不可变对象，甚至也可以共享它们的内部信息。**例如， `Biginteger` 类内部使用了符号数值表示法。符号用 一个 `int` 类型的值来表示，数值则用一个 `int` 数组表 示 。 `negate` 方法产生一个新的 `Biginteger`，其中数值是一样的，符号则是相反的 。 它并不需要拷贝数组，新建的 `Biginteger` 也指向原始实例中的同一个内部数组 。

**不可变对象无偿地提供了失败的原子性**（详见第 76条）。它们的状态永远不变，因此不存在临时不一致的可能性 。

**不可变类真正唯一的缺点是，对于每个不同的值都需要一个单独的对象。**创建这些对象的代价可能很高，特别是大型的对象 。

如果你执行一个多步骤的操作，并且每个步骤都会产生一个新的对象 ，**除了最后的结果之外，其他的对象最终都会被丢弃**，此时性能问题就会显露出来。处理这种问题有两种办法：

-   第一种办法，先猜测一下经常会用到哪些多步骤的操作，然后将它们作为基本类型提供。 如果某个多步骤操作已经作为基本类型提供，不可变的类就无须在每个步骤单独创建一个对象。（将中间对象拆解成多个基本类型？）
    
-   第二种办法，提供可变配套类（companing class）：
    
    -   如果能预测出客户端将要在不可变类上执行哪些复杂的多阶段操作，可以提供包级私有的可变配套类。`BigInteger` 有一个包级私有的可变配套类，它的用途是加速诸如 “模指数” 这样的多步骤操作。
        
    -   否则，最好提供一个公有的可变配套类。如 String 的可变配套类时 `StringBuilder` 类。
        

前面提出的关于不可变类的诸多规则指出没有方法会修改对象，并且它的所有域都必须是 `final` 的。 实际上，这些规则比真正的要求更强硬了一点，为了提高性能可以有所放松。事实上应该是这样：没有一个方法能够对对象的状态产生外部可见（externally visible）的改变。然而，许多不可变的类拥有一个或者多个非 `final` 的域，它们在第一次被请求执行这些计算的时候，把一些开销昂贵的计算结果缓存在这些域中。如果将来再次请求同样的计算，就直接返回这些缓存的值，从而节约了重新计算所需要的开销。这种技巧可以很好地工作，因为对象是不可变的，它的不可变性保证了这些计算如果被再次执行，就会产生同样的结果。

> -   可以将 hashCode 缓存。
>     
> -   如果把计算结果缓存进 `final` 域中，那么就必须在构造方法或者声明的时候初始化。如果用非 `final` 域来缓存，那么就可以实现延迟初始化。
>     

如果你选择让自己的不可变类实现 `Serializable` 接口 ，并且它包含一个或者多个指向可变对象的域，就必须提供一个显式的 `readObject` 或者 `readResolve` 方法，或者使用 `ObjectOutputStream.writeUnshared` 和 `ObjectInputStream.readUnshared` 方法，即便默认的序列化形式是可以接受的，也是如此。否则，攻击者可能从不可变的类创建可变的实例（详见第 88 条）。

不可变的类有许多优点，唯一的缺点是在特定的情况下存在潜在的性能问题。你应该总是使一些小的值对象，比如 PhoneNumber 和 Complex，成为不可变的。 (在 Java 平台类库中，有几个类如 `java.util.Date` 和 `java.awt.Point`，它们本应该是不可变的，但实际上却不是。）你也应该认真考虑把一些较大的值对象做成不可变的，例如 `String` 和 `Biginteger`。只有当你确认有必要实现令人满意的性能时（详见第 67条），才应该为不可变的类提供公有的可变配套类。

如果类不能被做成不可变的，应该尽可能地限制它的可变性。降低对象可以存在的状态数，可以更容易地分析该对象的行为，同时降低出错的可能性。因此，除非有令人信服的理由使域变成非 `final` 的 ，否则让每个域都是 `final` 的。结合这条的建议和第 15 条的建议，你自然倾向于：除非有令人信服的理由要使域变成是非 `final` 的，否则要使每个域都是 `private final` 的 。

构造器应该创建完全初始化的对象，并建立起所有的约束关系。不要在构造器或者静态工厂之外再提供公有的初始化方法，除非有令人信服的理由必须这么做。同样地，也不应该提供 “重新初始化” 方法（它使得对象可以被重用，就好像这个对象是由另一不同的初始状态构造出来的一样）。与所增加的复杂性相比，“重新初始化” 方法通常并没有带来太多的性能优势。

## 18. 复合优先于继承

对普通的具体类（concrete class）进行跨包继承是非常危险的（本节说的继承不适用于类实现接口或者接口继承），在包内使用继承，或者在包外继承专门为了继承而设计并且具有很好的文档说明的类是安全的。

于方法调用不同，继承打破了封装性。子类依赖于其超类中特定功能的实现细节，如果超类发生了变化，那么子类可能会遭到破坏。除非超类是专门为了扩展而设计的。

### 继承的缺点

#### 覆盖（overriding）带来的问题

问题 1：

下面的类试图实现统计 HashSet 创建以来一共被添加过多少次元素。

 // Broken - Inappropriate use of inheritance!  
   public class InstrumentedHashSet<E> extends HashSet<E> {  
       // The number of attempted element insertions  
       private int addCount = 0;  
       public InstrumentedHashSet() {  
       }  
       public InstrumentedHashSet(int initCap, float loadFactor) {  
           super(initCap, loadFactor);  
       }  
       @Override public boolean add(E e) {  
            addCount++;  
            return super.add(e);  
        }  
        @Override public boolean addAll(Collection<? extends E> c) { addCount += c.size();  
        return super.addAll(c);  
        }  
        public int getAddCount() {  
            return addCount;  
        }  
	}

看似合理，但并不能正常工作：

 InstrumentedHashSet<String> s = new InstrumentedHashSet<>();  
 s.addAll(List.of("Snap", "Crackle", "Pop"));

`getAddCount()` 返回的结果是 6 而不是 3。因为 `HashSet` 的 `addAll` 方法是基于 `add` 方法来实现的。这种自用型（self-use）是实现细节，而不是承诺，不能保证在 Java 平台的所有实现中都保持不变。

> `super.addAll` 之后，父类的 `addAll` 方法内部会调用 `add` 方法，因为子类覆盖了 `add` 方法，所以父类会去调用子类的 `add` 方法。

问题 2：

假设实现一个类继承了某个集合类，保证添加到集合中的所有元素都满足某个条件，这就需要覆盖目前所有能够添加元素的方法，来确保添加的元素是满足条件的。但在后续版本中，集合类可能增加了添加元素的新方法。如果调用这个未被子类覆盖的方法，那么就有可能添加了非法元素。

#### 扩展带来的问题

扩展会比覆盖安全的多，但仍然会有风险。

如果子类扩展了超类的方法，但超类在后续的版本中碰巧提供下面两种新方法：

-   与子类扩展的方法签名相同但返回类型不同，那么编译的时候就会失败。
    
-   与子类扩展的方法签名和返回类型都相同，那么就又回到了上述覆盖带来的两个问题。
    

### 复合（composition）

现有的类变成了新类的一个组件。新类中的每个实例方法都可以调用被包含的现有类实例中对应的方法，并返回它的结果。这被称为转发（forwarding），新类中的方法被称为转发方法（forwarding method）。这样得到的类将会非常稳固，它不依赖于现有类的实现细节。即使现有的类添加了新的方法，也不会影响新的类。

// Reusable forwarding class  
public class ForwardingSet<E> implements Set<E> {  
    private final Set<E> s;  
    public ForwardingSet(Set<E> s) { this.s = s; }  
    public void clear()               { s.clear();            }  
    public boolean contains(Object o) { return s.contains(o); }  
    public boolean isEmpty()  
    public int size()  
    public Iterator<E> iterator()  
    public boolean add(E e)  
    public boolean remove(Object o)  
    public boolean containsAll(Collection<?> c) { return s.containsAll(c); }  
    public boolean addAll(Collection<? extends E> c) { return s.addAll(c);      }  
    public boolean removeAll(Collection<?> c) { return s.removeAll(c);   }  
    public boolean retainAll(Collection<?> c) { return s.retainAll(c);   }  
    public Object[] toArray()          { return s.toArray();  }  
    public <T> T[] toArray(T[] a)      { return s.toArray(a); }  
    @Override public boolean equals(Object o) { return s.equals(o);  }  
    @Override public int hashCode()    { return s.hashCode(); }  
    @Override public String toString() { return s.toString(); }  
}

先实现一个 `Set` 的转发类 `ForwardingSet`。

// Wrapper class - uses composition in place of inheritance  
public class InstrumentedSet<E> extends ForwardingSet<E> {  
    private int addCount = 0;  
    public InstrumentedSet(Set<E> s) {  
        super(s);  
	}  
    @Override public boolean add(E e) {  
        addCount++;  
        return super.add(e);  
    }  
    @Override public boolean addAll(Collection<? extends E> c) { addCount += c.size();  
    	return super.addAll(c);  
    }  
    public int getAddCount() {  
        return addCount;  
    }  
}

再继承 `ForwadingSet`，这样 `InstrumentedSet` 就可以实现统计所有被添加元素的个数了。

> 写成两个类，是为了复用 `ForwardingSet` 来实现其他需求。也可以直接将 `Set` 复合进 `InstrumentedSet` 来实现上述需求。

这个包装类可以包装任何 `Set` 实现，这也正是装饰者（Decorator）模式。包装类不仅比子类更加健壮，而且功能更加强大。

> 包装类几乎没有什么缺点。需要注意的一点是，包装类不适合用于回调框架（callback framework）。在回调框架中，对象把自身的引用传递给其他的对象，用于后续的回调。因为被包装起来的对象并不知道它外面的包装对象，所以它传递一个指向自身的引用（`this`），回调时避开了外面的包装对象。这被称为 SELF 问题。（TODO：没看明白）

> 不必担心转发方法调用带来的性能影响，或者是包装对象导致的内存占用，这些都不会造成什么影响。Guava 为所有的集合接口提供了转发类。

只有当子类真正是超类的子类型（subtype）时，才适合用继承。换句话说，对于两个类 A 和 B，只有当两者之间确实存在 “is-a” 关系的时候，类 B 才应该扩展类 A。 通常情况下，B 应该包含 A 的一个私有实例，并且暴露一个较小的、较简单的 API：A 本质上不是 B 的一部分，只是它的实现细节而已。

> 在 Java 平台类库中，有许多明显违反这条原则的地方。 例如，栈（`Stack`）并不是向量（`Vector`），所以 `Stack` 不应该扩展 `Vector`。同样地，属性列表也不是散列表，所以 `Properties` 不应该扩展 `Hashtable`。在这两种情况下，复合模式才是恰当的 。
> 
> Properties 不合适的继承带来的问题：
> 
> -   p.getProperty(key) 有可能产生与 p.get(key) 不同的结果，因为前一个方法是子类扩展的，考虑了默认的属性表，而后一个方法继承子 Hashtable，没有考虑默认的属性列表。
>     
> -   Properties 设计的目标是只允许字符串作为 key 和 value，如果直接调用超类 Hashtable 的 put 方法，那么就可以违反这个约束条件。
>     

## 19. 要么设计继承并提供文档说明，要么禁止继承

TODO

## 20. 接口优于抽象类

> Java 8 为接口引入了默认方法。
> 
> 因为如果要为接口扩展其他方法，那么所有已经实现接口的类都必须要实现这个方法。
> 
>  interface Cat {  
>   //抽象方法  
>      void play();   
>  ​  
>      //静态方法  
>      static void eat() {  
>          System.out.println("猫吃鱼");  
>      }  
>  ​  
>      //默认方法  
>      default void run() {  
>          System.out.println("猫跑");  
>      }  
>      default void climb() {  
>          System.out.println("猫爬树");  
>      }  
>  }  
>  ​  
>  class WhiteCat implements Cat {  
>      @Override  
>      public void play() {  
>          System.out.println("白猫玩");  
>      }  
>  ​  
>   // 重写默认方法  
>      @Override  
>      public void run() {  
>          System.out.println("白猫跑");  
>      }  
>  }

### 接口的优点

-   -   Java 只允许单继承，所以用抽象类作为类型定义受到了限制。
        
    -   但类层次结构中任何位置的类都允许实现一个接口。
        
-   -   如果需要新的接口，现有的类很容易去实现；
        
    -   但如果现有的类已经有了父类，就无法继承新的抽象类。如果没有父类，并选择去继承新的抽象类，那么之后这个现有类的所有子类也都会基层这个抽象类，无论是否合适。
        
-   -   **接口是定义 mixin（混合类型）的理想选择。**mixin 接口表明它提供了某些可供选择的行为，例如 Comparable。之所以被称为 mixin，是因为它允许任选的功能可被混合到类型的主要功能中。
        
    -   而抽象类不能被用于定义 mixin，同样也是因为单继承，且类层次结构中也没有适当的地方来插入 mixin。
        
-   -   **接口允许构造非层次结构的类型框架。**类型层次对于组织某些事物是非常合适的，但是其他事物并不能被整齐地组织成一个严格的层次结构。例如在现实生活中，有些 Singer 同时也是 Songwriter，所以对于单个类而言，可以同时实现 Singer 和 Songwriter 接口。甚至可以定义第三个接口，同时扩展 Singer 和 Songwriter，并添加一些适合于这种组合的新方法。
        
         public interface Singer {  
             AudioClip sing(Song s);  
         }  
         public interface Songwriter {  
             Song compose(int chartPosition);  
         }  
         ​  
         public interface SingerSongwriter extends Singer Songwriter {  
             AudioClip strum();  
             void actSensitve();  
         }
        
    -   如果采用抽象类，在类型系统中有 n 个类似 Singer 的类，那么就必须支持 2^n 种可能的组合。而且会导致类包含许多方法，并且这些方法只是在参数的类型上有所不同。
        
-   -   接口能安全的实现第 18 条中的包装类模式来增加功能（实现 Set 接口，并把 Set 组合进来，增加 Set 的功能）。
        
    -   如果 Set 是抽象类，就只能通过继承的手段。这样得到的类比包装类功能更差且更加脆弱。（TODO：为什么不能直接组合 Set？）
        

### 接口的骨架实现类

通过对接口提供一个抽象的骨架实现（skeletal implementation）类，可以把接口和抽象类的优点结合起来。接口负责定义类型，还可以提供一些缺省方法，而骨架实现类则负责实现**非基本类型接口方法**。 扩展骨架实现占了实现接口之外的大部分工作，这就是模板方法模式。

> -   如果提供了缺省方法，要确保利用 Javadoc 标签 @implSpec 建立文档（详见第 19条）。
>     
> -   接口可以定义 equals、hashCode 和 toString 等 Object 等方法，但是不允许提供它们的缺省方法。
>     
> -   接口中不允许包含实例域或者非公有的静态成员（私有的静态方法除外）。
>     

按照惯例，骨架实现类被称为 `AbstractInterface`（也可以叫做 `SkeletalInterface`，但 Abstract 更常用），这里的 `Interface` 是指所实现的接口的名字。例如， Collections Framework 为每个重要的集合接口都提供了一个骨架实现，包括 `AbstractCollection`、`AbstractList` 等。如果设计得当，骨架实现（无论是单独一个抽象类，还是接口中唯一包含的缺省方法）可以使程序员更方便实现接口。下面是一个静态工厂方法，除 `AbstractList` 之外，它还包含了一个完整的、功能全面的 List 实现：

   // Concrete implementation built atop skeletal implementation  
   static List<Integer> intArrayAsList(int[] a) {  
       Objects.requireNonNull(a);  
	   // The diamond operator is only legal here in Java 9 and later   
       // If you're using an earlier release, specify <Integer>   
       return new AbstractList<>() {  
           @Override public Integer get(int i) {  
               return a[i];  // Autoboxing (Item 6)  
		   }  
           @Override public Integer set(int i, Integer val) {  
               int oldVal = a[i];  
               a[i] = val;     // Auto-unboxing  
               return oldVal;  // Autoboxing  
		   }  
           @Override public int size() {  
               return a.length;  
           }   
       };  
	}

> 因为认为 get、set 和 size 是 List 接口的基本方法，所以 AbstractList 并没有实现它们，让子类去实现。

对于接口的大多数实现来讲，继承骨架实现类是个很显然的选择，但并不是必须的。

如果现有类无法继承骨架实现类，但依然能手动实现接口。同时，这个类也能使用接口中出现的任何缺省方法。

此外，骨架实现类有助于接口的实现。实现了这个接口的类可以把对于接口方法的调用转发到一个内部私有类的实例上，这个内部私有类扩展了骨架实现类。这种方法被称作模拟多重继承（simulated multiple inheritance），它与第 18 条中讨论过的包装类模式密切相关。这项技术具有多重继承的绝大多数优点，同时又避免了相应的缺陷 。// TODO：没看懂

编写骨架实现类的过程：首先，确定接口中哪些方法是最为基本的，其他的非基本方法则可以根据它们来实现。这些基本方法将成为骨架实现类中的抽象方法（**不需要在抽象类中声明这个方法**）。接下来，在接口中为所有可以在基本方法之上直接实现的方法提供缺省方法。 如果基本方法和缺省方法覆盖了接口。就不需要骨架实现类了。否则，就要编写一个类，声明实现接口，并实现所有剩下的接口方法。这个类中可以包含任何非公有的域，以及适合该任务的任何方法 。

以 Map.Entry 接口为例，明显的基本方法是 getKey、getValue 和（可选的）setValue。接口定义了 equals 和 hashCode 的行为，并且有一个明显的 toString 实现。由于不允许给 Object 方法提供缺省实现，因此所有实现都放在骨架实现类中:

    interface Entry<K,V> {  
        K getKey();  
        V getValue();  
        V setValue();  
        boolean equals(Object o);  
        int hashCode();  
		...  
    }  
  
	// Skeletal implementation class  
   	public abstract class AbstractMapEntry<K,V>	implements Map.Entry<K,V> {  
       	// Entries in a modifiable map must override this method  
       	@Override   
        public V setValue(V value) {  
           	throw new UnsupportedOperationException();  
       	}  
          
        // Implements the general contract of Map.Entry.equals  
       	@Override   
        public boolean equals(Object o) {  
           	if (o == this)  
               	return true;  
           	if (!(o instanceof Map.Entry))  
               	return false;  
            Map.Entry<?, ?> e = (Map.Entry) o;  
        	return Objects.equals(e.getKey(), getKey()) && Objects.equals(e.getValue(), getValue());  
        }  
       	// Implements the general contract of Map.Entry.hashCode  
       	@Override   
            public int hashCode() {  
           	return Objects.hashCode(getKey()) ^ Objects.hashCode(getValue());  
		}  
       	@Override   
            public String toString() {  
           	return getKey() + "=" + getValue();  
		}   
	}

这个骨架实现不能在 Map.Entry 接口中实现，也不能作为子接口，因为不允许缺省方法覆盖 Object 方法。

因为骨架实现类是为了继承的目的而设计的，所以应该遵从第 19 条中介绍的所有关于设计和文挡的指导原则。

骨架实现上有个小小的不同，就是简单实现（simple implementation），AbstractMap.SimpleEntry 就是个例子。简单实现就像骨架实现一样，这是因为它实现了接口，并且是为了继承而设计的，但是区别在于它不是抽象的：它是最简单的可能的有效实现。你可以原封不动地使用，也可以看情况将它子类化。

总而言之，接口通常是定义允许多个实现的类型的最佳途径。如果你导出了一个重要的接口，就应该坚决考虑同时提供骨架实现类。而且，还应该尽可能地通过缺省方法在接口中提供骨架实现，以便接口的所有实现类都能使用。也就是说，对于接口的限制，通常也限制了骨架实现会采用的抽象类的形式 。

> 比如有 List 接口，AbstractList 先简单实现了 List。size、get 等基本方法没有实现，因为子类 size 和 get 实现细节不同，所以留给子类去实现，而类似 iterator 可以通过子类实现的 get 方法来实现迭代器。看不明白的话可以去看看 AbstractList 等的源码。
> 
> public abstract int size();  
> abstract public E get(int index);  
> ...
> 
> add 的写法如下，set 和 remove 也类似。这表明，如果子类想要能够修改元素，还需要重写 add(), set(), remove() 方法，否则会报 `UnsupportedOperationException` 错。
> 
> public boolean add(E e) {  
> 	throw new UnsupportedOperationException();  
> }

## 21. 为后代设计接口

在 Java 8 发行之前，如果不破坏现有的实现，是不可能给接口添加方法的。在 Java 8 中，增加了缺省方法（default method）构造，目的就是允许给现有的接口添加方法。但是给现有接口添加新方法还是充满风险的。Java 8 在核心集合接口中增加了许多新的缺省方法，主要是为了便于使用 lambda (详见第 6章)，Java 类库的缺省方法是高品质的通用实现。虽然可以给现有接口添加方法了，但是并不能确保这些方法在之前存在的实现中都能良好运行。

比如，以 removeIf 方法为例：

// Default method added to the Collection interface in Java 8  
   	default boolean removeIf(Predicate<? super E> filter) {  
       	Objects.requireNonNull(filter);  
       	boolean result = false;  
       	for (Iterator<E> it = iterator(); it.hasNext(); ) {  
           	if (filter.test(it.next())) {  
               	it.remove();  
               	result = true;  
           	}  
		}  
		return result;  
   	}

Apache 版本的 SynchronizedCollection 类（Collection 的实现类）依然有人维护，但是到编写本书之时，它也没有取代 removeIf 方法。如果这个类与 Java 8 结合使用，将会继承 removeIf 的缺省实现，它不会保持这个类的基本承诺：围绕着每一个方法调用执行自动同步。缺省实现压根不知道同步这回事，也无权访问包含该锁定对象的域。如果客户在 SynchronizedCollection 实例上调用 removeIf 方法，同时另一个线程对该集合进行修改，就会导致 ConcurrentModificationException 或者其他异常行为。

为了避免在类似的 Java 平台类库实现中发生这种异常，如 Collections.synchronized Collection 返回的包私有类，JDK 维护人员必须覆盖默认的 removeIf 实现。

建议尽量避免利用缺省方法在现有接口上添加新的方法，除非有特殊需要，但就算在那样的情况下也应该慎重考虑：缺省的方法实现是否会破坏现有的接口实现。然而，在创建接口的时候，用缺省方法提供标准的方法实现是非常方便的，它简化了实现接口的任务（详见第 20 条）。

## 22. 接口只用于定于类型

当类实现接口时，接口就充当可以引用这个类的实例的类型（type）。因此，类实现了接口，就表明客户端可以对这个类的实例实施某些动作。为了任何其他目的而定义接口是不恰当的。

有一种接口被称为常量接口（constant interface），它不满足上面的条件。这种接口不包含任何方法，它只包含 static final 域（接口中所有的域都是 public static final 的），每个域都导出一个常量。使用这些常量的类实现这个接口，以避免用类名来修饰常量名。下面举个例子:

 	// Constant interface antipattern - do not use!  
   	public interface PhysicalConstants {  
       	// Avogadro's number (1/mol)  
       	static final double AVOGADROS_NUMBER   = 6.022_140_857e23;  
       	// Boltzmann constant (J/K)  
       	static final double BOLTZMANN_CONSTANT = 1.380_648_52e-23;  
       	// Mass of the electron (kg)  
       	static final double ELECTRON_MASS      = 9.109_383_56e-31;  
   	}

常量接口模式是对接口的**不良使用**。类在内部使用某些常量，这纯粹是实现细节。实现常量接口会导致把这样的实现细节泄露到该类的导出 API 中。类实现常量接口对于该类的用户而言并没有什么价值，更糟糕的是，它代表了一种承诺：如果在将来的发行版本中，这个类被修改了，它不再需要使用这些常量了， 它依然必须实现这个接口，以确保二进制兼容性。如果非 final 类实现了常量接口，它的所有子类的命名空间也会被接口中的常量所 “污染”。

> 在 Java平台类库中有几个常量接口，例如 java.io.ObjectStreamConstants。这些接口应该被认为是反面的典型。

如果要导出常量，可以有几种合理的选择方案。如果这些常量与某个现有的类或者接口紧密相关，就应该把这些常量添加到这个类或者接口中。例如，在 Java 平台类库中所有的数值包装类，如 Integer 和 Double，都导出了 MIN_VALUE 和 MAX)VALUE 常量。

如果这些常量最好被看作枚举类型的成员，就应该用枚举类型（enum type）（详见第 34 条）来导出这些常量。否则，应该使用不可实例化的工具类（utility class）（详见第4条）来导出这些常量。下面的例子是前面的 PhysicalConstants 例子的工具类翻版：

 	// Constant utility class  
	package com.effectivejava.science;  
  
   	public class PhysicalConstants {  
     	private PhysicalConstants() { }  // Prevents instantiation  
		public static final double AVOGADROS_NUMBER = 6.022_140_857e23;   
        public static final double BOLTZMANN_CONST = 1.380_648_52e-23;   
        public static final double ELECTRON_MASS = 9.109_383_56e-31;  
}

> 注意，有时候会在数字的字面量中使用下划线。 从Java7开始，下划线的使用已经合法了，它对数字字面量的值没有影响，如果使用得当，还可以极大地提升它们的可读性。如果其中包含五个或五个以上连续的数字，无论是浮点还是定点，都要考虑在数字的字面量 中添加下划线。对于基数为 10 的字面量，无论是整数还是浮点，都应该用下划线把数字隔成每三位一组 。

工具类通常要求客户端要用类名来修饰这些常量名，例如 PhysicalConstants.AVO­_GADROS_NUMBER。如果大量利用工具类导出的常量，可以通过利用静态导入（static import）机制，避免用类名来修饰常量名：

 	// Use of static import to avoid qualifying constants  
   	import static com.effectivejava.science.PhysicalConstants.*;  
  
   	public class Test {  
       	double atoms(double mols) {  
           	return AVOGADROS_NUMBER * mols;  
       	}  
		...  
		// Many more uses of PhysicalConstants justify static import   
    }

## 23. 类层次优先于标签类

有时可能会遇到带有两种甚至更多种风格的实例的类，并包含表示实例风格的标签（tag）域。例如，以下面这个类它能够表示圆形或者矩形：

     // Tagged class - vastly inferior to a class hierarchy!  
     class Figure {  
         enum Shape { RECTANGLE, CIRCLE };  
         // Tag field - the shape of this figure  
         final Shape shape;  
         // These fields are used only if shape is RECTANGLE  
         double length;  
         double width;  
         // This field is used only if shape is CIRCLE  
         double radius;  
         // Constructor for circle  
         Figure(double radius) {  
             shape = Shape.CIRCLE;  
             this.radius = radius;  
         }  
         // Constructor for rectangle  
         Figure(double length, double width) {  
             shape = Shape.RECTANGLE;  
             this.length = length;  
             this.width = width;  
         }  
         double area() {  
             switch(shape) {  
                 case RECTANGLE:  
                     return length * width;  
                 case CIRCLE:  
                     return Math.PI * (radius * radius);  
                 default:  
                     throw new AssertionError(shape);  
             }   
         }  
     }

这种标签类（tagged class）有许多缺点：它们中充斥着样板代码，包括枚举声明、标签域以及条件语句。由于多个实现乱七八糟地挤在单个类中，破坏了可读性。由于实例承担着属于其他风格的不相关的域，因此内存占用也增加了。域不能做成 final 的，否则构造器就要初始化不相关的域。构造器必须不借助编译器来设置标签域，并初始化正确的数据域：如果初始化了错误的域，程序就会在运行时失败。如果要添加风格，就必须记得给每个条件语句都添加一个条件。最后，实例的数据类型没有提供任何关于其风格的线索。一句话，标签类过于冗长、容易出错，并且效率低下。

子类型化（subtyping）能更好的定义表示多种风格对象的单个数据类型，标签类是对类层次的一种简单的仿效。

     abstract class Figure {  
         abstract double area();  
     }  
     class Circle extends Figure {  
         final double radius;  
         Circle(double radius) { this.radius = radius; }  
         @Override double area() { return Math.PI * (radius * radius); }   
     }  
     class Rectangle extends Figure {  
         final double length;  
         final double width;  
         Rectangle(double length, double width) {  
             this.length = length;  
             this.width  = width;  
         }  
         @Override double area() { return length * width; }  
    }

-   每个类型都有自己的实现类，不会被其他类型影响；
    
-   所有域都可以是 final 的。
    
-   确保所有类型都能实现 area() 方法，不像之前可能会遗漏一个 switch case。
    

类层次的另一个好处在于，它们可以用来反映类型之间本质上的层次关系，有助于增强灵活性，并有助于更好地进行编译时类型检查。假设上述例子中的标签类也允许表达正方形。类层次可以反映出正方形是一种特殊的矩形这一事实（假设两者都是不可变的）：

 class Square extends Rectangle {  
     Square(double side) {  
         super(side, side);  
     }  
 }

> 注意，上述层次中的域被直接访问，而不是通过访问方法访问。这是为了简洁起见，如果层次结构是公有的（详见第 16条），则不允许这样做。

## 24. 静态成员类优于非静态成员类

嵌套类（nested class）是指定义在另一个类的内部的类。嵌套类存在的目的应该只是为它的外围类（enclosing class）提供服务。如果嵌套类将来可能会用于其他的某个环境中，它就应该是顶层类（top-level class）。嵌套类有四种：**静态成员类**（static member class）、**非静态成员类**（nonstatic member class）、**匿名类**（anonymous class）和**局部类**（local class）。除了第一种之外，其他三种都称为内部类（inner class）。

### 静态成员类

静态成员类是最简单的一种嵌套类。最好把它看作是普通的类，只是碰巧被声明在另一个类的内部而己，它可以访问外围类的所有成员，包括那些声明为私有的成员。静态成员类是外围类的一个静态成员，与其他的静态成员一样，也遵守同样的可访问性规则。如果它被声明为私有的，它就只能在外围类的内部才可以被访问，等等 。

静态成员类的一种常见用法是作为**公有的辅助类**，只有与它的外部类一起使用才有意义。例如，以枚举为例，它描述了计算器支持的各种操作（详见第 34 条）。Operation 枚举应该是 Calculator 类的公有静态成员类，之后 Calculator 类的客户端就可以用诸如Calculator.Operation.PLUS 和 Calculator.Operation.MINUS 这样的名称来引用这些操作 。

### 非静态成员类

非静态成员类和静态成员类语法只是少了一个 static，但有很大的不同。

非静态成员类的每个实例都隐含地与外围类的一个**外围实例**（enclosing instance）相关联。在非静态成员类的实例方法内部，可以调用外围实例上的方法，或者利用修饰过的 this （qualified this）构造获得外围实例的引用。

如果嵌套类的实例可以在它外围类的实例之外**独立存在**，这个嵌套类就必须是静态成员类；在没有外围实例的情况下，要想创建非静态成员类的实例是不可能的。

当非静态成员类的实例被创建的时候，它和外围实例之间的关联关系也随之被建立起来；而且，这种关联关系以后不能被修改。通常情况下，当在外围类的某个实例方法的内部调用非静态成员类的构造器时，这种关联关系被自动建立起来。使用表达式 enclosing-Instance.new MemberClass(args) 来手工建立这种关联关系也是有可能的，但是很少使用。正如你所预料的那样，这种关联关系需要消耗非静态成员类实例的空间，并且会增加构造的时间开销 。

非静态成员类的一种常见用法是定义一个 Adapte，它允许外部类的实例被看作是另一个不相关的类的实例。例如，Map 接口的实现往往使用非静态成员类来实现它们的集合视图（collection view）这些集合视图是由 Map 的 keySet、entrySet 和 values 方法返回的。同样地，诸如 Set 和 List 这种集合接口的实现往往也使用非静态成员类来实现它们的迭代器（iterator）：

// Typical use of a nonstatic member class  
   	public class MySet<E> extends AbstractSet<E> {  
       	... // Bulk of the class omitted  
             
       	@Override   
        public Iterator<E> iterator() {  
           return new MyIterator();  
		}  
		private class MyIterator implements Iterator<E> {   
        	...  
    	}   
   	}

如果声明成员类不要求访问外围实例，就要始终把修饰符 static放在它的声明中， 使它

## 25. 限制源文件为单个顶级类

虽然 Java 编译器允许在一个源文件中定义多个顶级类，但这么做并没有什么好处，只会带来巨大的风险。因为在一个源文件中定义多个顶级类，可能导致给一个类提供多个定 义。哪一个定义会被用到，取决于源文件被传给编译器的顺序。

下面这个源文件中只包含一个 Main 类，它将引用另外两个顶级类（Utensil 和 Dessert）的成员：

public class Main {  
	public static void main(String[] args) {  
		System.out.println(Utensil.NAME + Dessert.NAME);  
	}  
}

现在假设在一个名为 Utensil. java 的源文件 同时定义了 Utensil 和 Dessert：

// Two classes defined in one file. Don't ever do this!  
class Utensil {  
	static final String NAME = "pan";  
}  
class Dessert {  
	static final String NAME = "cake";  
}

程序会输出 "Pancake"。

现在假设不小心在另一个名为 Dessert.java 的源文件中也定义了同样的两个类：

// Two classes defined in one file. Don't ever do this!  
class Utensil {  
	static final String NAME = "pot";  
}  
class Dessert {  
	static final String NAME = "pie";  
}

如果侥幸用命令 javac Main.java Dessert.java 来编译程序，那么编译就会失败，此时编译器会提醒你定义了多个 Utensil 和 Dessert 类。这是因为编译器会先编译 Main.java，当它看到 Utensil 的引用（在 Dessert 引用之前），就会在 Utensil.java 中查看这个类，结果找到 Utensil 和 Dessert 这两个类。当编译器在命令行遇到 Dessert.java 时也会去查找该文件，结果会遇到 Utensil 和 Dessert 这两个定义 。

如果用命令 javac Main.java 或者 javac Main.java Utensil.java 编译程序，结果将如同你还没有编写 Dessert. java 文件一样，输出 pancake。但如果是用命令 javac Dessert.java Main.java 编译程序，就会输出 potpie。程序的行为受源文件被传给编译器的顺序影响，这显然是让人无法接受的 。

这个问题的修正方法很简单，只要把顶级类（在本例中是指 Utensil 和 Dessert）分别放入独立的源文件即可。如果一定要把多个顶级类放进一个源文件中，就要考虑使用静态成员类（详见第 24条），以此代替将这两个类分到独立源文件中去。 如果这些类服从于另一个类，那么将它们做成静态成员类通常比较好，因为这样增强了代码的可读性，如果将这些类声明为私有的（详见第 15 条），还可以使它们减少被读取的概率。以下就是做成静态成员类的范例：

	// Static member classes instead of multiple top-level classes  
   	public class Test {  
       	public static void main(String[] args) {  
           	System.out.println(Utensil.NAME + Dessert.NAME);  
       	}  
       	private static class Utensil {  
           	static final String NAME = "pan";  
		}  
       	private static class Dessert {  
           	static final String NAME = "cake";  
        }   
    }

结论显而易见：永远不要把多个顶级类或者接口放在一个源文件中。遵循这个规则可以确保编译时一个类不会有多个定义。这么做反过来也能确保编译产生的类文件，以及程序结果的行为，都不会受到源文件被传给编译器时的顺序的影响。

# 四. 泛型

> 声明中具有一个或者多个类型参数（type parameter）的类或者接口，就是泛型（generic）类或者接口。泛型类和接口统称为泛型（generic type）。

## 26. 请不要使用原生态类型

每一种泛型定义一种参数化的类型（parameterized type），构成格式为：先是类或者接口的名称，然后用尖括号把对应于泛型形式类型参数的实际类型参数（actual type parameter）列表扩起来。例如，List<String>（读作 “字符串列表”）是一个参数化的类型，表示元素类型为 String 的列表。（String 是与形式的类型参数 E 相对应的实际类型参数。）

每一种泛型都定义一个原生态类型（raw type），即不带任何实际类型参数的泛型名称。例如，与 List<E> 相对应的原生态类型是 List。

如果使用原生态类型，就失掉了泛型在安全性和描述性方面的所有优势。它们的存在主要是为了与泛型出现前的代码相兼容。

1.  原生态类型逃避了泛型检查，如 List，可以插入任何元素，在取出的时候很容易发生转型错误，而且这种错误在编译器不会被发现。
    
2.  泛型有子类型化（subtyping）的规则，List<String> 是原生态类型 List 的一个子类型，而不是参数化类型 List<Object> 的子类型（详见第 28 条）。因此，如果使用像 List 这样的原生态类型，就会失掉类型安全性 ，但是如果使用像 List<Object>这样的参数化类型，则不会 。
    
    // Fails at runtime - unsafeAdd method uses a raw type (List)!  
    public static void main(String[] args) {  
    	List<String> strings = new ArrayList<>();   
        unsafeAdd(strings, 	Integer.valueOf(42));  
    	String s = strings.get(0); // Has compiler-generated cast  
    }  
      
    private static void unsafeAdd(List list, Object o) {   
        list.add(o);  
    }
    
    这段程序可以编译，但是运行时会收到 ClassCastException 异常。
    
    Test.java:10: warning: [unchecked] unchecked call to add(E) as a member of the raw type List  
    	list.add(o);  
    			^
    
    如果在 unsafeAdd 声明中用参数化类型 List<Object> 代替原生态类型 List，编译的时候就会报错。
    
    Test.java:5: error: incompatible types: List<String> cannot be converted to List<Object>  
    	unsafeAdd(strings, Integer.valueOf(42));  
    		^
    
3.  如果要统计集合元素个数，下面的方法是可行的。
    
    // Use of raw type for unknown element type - don't do this!   
    static int numElementsInCommon(Set s1, Set s2) {  
    	int result = 0;  
    	for (Object o1 : s1)  
    		if (s2.contains(o1))  
                result++;  
        return result;  
    }
    
    但使用了原生态类型，也是很危险的。安全的替代是使用无限制的通配符类型（unbounded wildcard type）。
    
    // Uses unbounded wildcard type - typesafe and flexible   
    static int numElementsInCommon(Set<?> s1, Set<?> s2) { ... }
    
    由于可以将任何元素放进使用原生态类型的集合中，因此很容易破坏该集合的类型约束条件；**但不能将任何元素（除了 null 之外）放到 Collection<?> 中**。如果尝试这么做，将会产生一条像下面这样的编译时错误消息。Collection<?> 表示能包含某种未知对象类型的一个集合。
    
     WildCard.java:13: error: incompatible types: String cannot be converted to CAP#1  
    	c.add("verboten");  
    		^  
    	where CAP#1 is a fresh type-variable:  
           CAP#1 extends Object from capture of ?
    

不要使用原生态类型，这条规则有几个小小的例外。

-   必须在类文字（class literal）中使用原生态类型。 规范不允许使用参数化类型（虽然允许数组类型和基本类型）。换句话说，List.class、String[].class 和 int[].class 都合法，但是 List<String>.class 和 List<?>.class 则不合法。
    
-   这条规则的第二个例外与 instanceof 操作符有关。由于泛型信息可以在运行时被擦除，因此在参数化类型而非无限制通配符类型上使用 instanceof 操作符是非法的。用无限制通配符类型代替原生态类型，对 instanceof 操作符的行为不会产生任何影响。在这种情况下，尖括号 （<>）和问号（?）就显得多余了。下面是利用泛型来使用 instanceof 操作符的首选方法：
    
    // Legitimate use of raw type - instanceof operator   
    if (o instanceof Set) { // Raw type  
    	Set<?> s = (Set<?>) o; // Wildcard type  
    	...   
    }
    
    注意，一旦确定这个 o 是个 Set，就必须将它转换成通配符类型 Set<?>，而不是转换成原生态类型 Set。这是个受检的（checked）转换，因此不会导致编译时警告 。
    

![Screen Shot 2021-06-05 at 13.36.13](https://chp-image-hosting.oss-cn-hangzhou.aliyuncs.com/uPic/Screen%20Shot%202021-06-05%20at%2013.36.13.png)

## 27. 消除非受检的警告

用泛型编程时会遇到许多编译器警告：非受检转换警告（unchecked cast warning）、非受检方法调用警告、非受检参数化可变参数类型警告（unchecked parameterized vararg type warning），以及非受检转换警告（unchecked conversion warning）。

要尽可能地消除每一个非受检警告，如果无法消除警告，同时可以证明引起警告的代码是类型安全的，只有在这种情况下才可以用一个 @SuppressWarnings("unchecked") 注解来禁止这条警告。

SuppressWarnings 注解可以用在任何粒度的级别中，从单独的局部变量声明到整个类都可以。应该始终在尽可能小的范围内使用 SuppressWarnings 注解。它通常是个变量声明，或是非常简短的方法或构造器。

如果发现自己在长度不止一行的方法或者构造器中使用了 SuppressWarnings 注解，可以将它移到一个局部变量的声明中。 虽然你必须声明一个新的局部变量，不过这么做还是值得的。例如，看看 ArrayList 类当中的 toArray 方法：

public <T> T[] toArray(T[] a) {  
	if (a.length < size)  
        return (T[]) Arrays.copyOf(elements, size, a.getClass());  
    System.arraycopy(elements, 0, a, 0, size);  
    if (a.length > size)  
        a[size] = null;  
    return a;  
}

如果编译 ArrayList，该方法就会产生这条警告：

ArrayList.java:305: warning: [unchecked] unchecked cast  
return (T[]) Arrays.copyOf(elements, size, a.getClass());  
							^  
     required: T[]  
     found:    Object[]

将 SuppressWarnings 注解放在 return 语句中是合法的，因为它不是声明。你可以试着将注解放在整个方法上，但是在实践中千万不要这么做，而是应该声明一个局部变量来保存返回值，并注解其声明，像这样：

// Adding local variable to reduce scope of @SuppressWarnings  
public <T> T[] toArray(T[] a) {  
	if (a.length < size) {  
        // This cast is correct because the array we're creating   
        // is of the same type as the one passed in, which is T[]. 		  
        @SuppressWarnings("unchecked") T[] result =  
            (T[]) Arrays.copyOf(elements, size, a.getClass());  
        return result;  
    }  
          
    System.arraycopy(elements, 0, a, 0, size);  
    if (a.length > size)  
        a[size] = null;  
    return a;  
}

每当使用 SuppressWarnings("unchecked") 注解时，都要添加一条注释，说明为什么这么做是安全的。这样可以帮助其他人理解代码，更重要的是，可以尽量减少其他人修改代码后导致计算不安全的概率。如果你觉得这种注释很难编写，就要多加思考。最终你会发现非受检操作是非常不安全的。

## 28. 列表优于数组

数组与泛型相比，有两个重要的不同点。

首先，数组是协变的（covariant），表示如果 Sub 为 Super 的子类型，那么数组类型 Sub[] 就是 Super[] 的子类型。相反，泛型则是可变的（invariant）：对于任意两个不同的类型 Type1 和 Type2，List<Type1> 既不是 List<Type2> 的子类型，也不是 List<Type2> 的超类型。你可能认为，这意味着泛型是有缺陷的，但实际上可以说数组才是有缺陷的。下面的代码片段是合法的：

// Fails at runtime!  
Object[] objectArray = new Long[l];  
objectArray[0] = ”I don’t fit in”; // Throws ArrayStoreException

但下面这段代码则不合法：

// Won’t compile!  
List<Object> ol = new Arraylist<Long>(); // Incompatible types   
al.add(”I don’t fit in”);

第二大区别在于数组是具体化的（reified）。因此数组会在运行时知道和强化它们的元素类型。如上所述，如果企图将 String 保存到 Long 数组中，就会得到一个ArrayStoreException 异常。相比之下，泛型则是通过擦除（erasure）来实现的。这意味着，**泛型只在编译时强化它们的类型信息，并在运行时丢弃**（或者擦除）它们的元素类型信息 。 擦除就是使泛型可以与没有使用泛型的代码随意进行互用（详见第 26 条），以确保在 Java 5 中平滑过渡到泛型。

由于上述这些根本的区别，因此数组和泛型不能很好地混合使用。例如，创建泛型、 参数化类型或者类型参数的数组是非法的。这些数组创建表达式没有一个是合法的：`new List<E>[]`、`new List<String>[]` 和 `new E[]`。这些在编译时都会导致一个泛型数组创建（generic array creation）错误。

为什么创建泛型数组是非法的？因为它不是类型安全的。要是它合法，编译器在其他正确的程序中发生的转换就会在运行时失败，并出现一个 ClassCastException 异常。这就违背了泛型系统提供的基本保证。 以下面的代码片段为例 :

// Why generic array creation is illegal - won’t compile!  
List<String>[] stringlists = new List<String>[1]; 	// (1)  
List<Integer> intlist = List.of(42);				// (2)  
Object[] objects = stringlists;						// (3)  
objects[0] = intList;								// (4)  
String s = stringLists[0].get(0);					// (5)

我们假设第 1 行是合法的，它创建了一个泛型数组。第 2 行创建并初始化了一个包含单个元素的 `List<Integer>`。 第 3 行将 `List<String>` 数组保存到一个 Object 数组变量 中，这是合法的，因为数组是**协变**的。第 4 行将 `List<Integer>` 保存到 Object 数组里唯一的元素中，这是可以的，因为泛型是通过擦除实现的：`List<Integer>` 实例的运行时类型只是 `List`，`List<String>[]` 实例的运行时类型则是 `List []`，因此这种安排不会产生 `ArrayStoreException` 异常。但现在我们有麻烦了。我们将一个 `List<Integer>` 实例保存到了原本声明只包含 `List<String>` 实例的数组中。在第 5 行中，我们从这个数组里唯一的列表中获取了唯一的元素。编译器自动地将获取到的元素转换成 String，但它是一个 Integer，因此，我们在运行时得到了一个 ClassCastException 异常。为了防止出现这种情况，（创建泛型数组的）第 1 行必须产生一条编译时错误。

从技术的角度来说，像 `E`、`List<E>` 和 `List<String>` 这样的类型应称作**不可具体化**的（nonreifiable）类型。直观地说，不可具体化的（non-reifiable）类型是指其运行时表示法包含的信息比它的编译时表示法包含的信息更少的类型。唯一可具体化的（reifiable）参数化类型是无限制的通配符类型，如 `List<?>` 和 `Map<?,?>` (详见第 26 条)。虽然不常用，但是**创建无限制通配类型的数组是合法的**。

禁止创建泛型数组可能有点讨厌。例如，这表明泛型一般不可能返回它的元素类型数组（部分解决方案请见第 33 条）。这也意味着在结合使用可变参数（varargs）方法（详见第 53 条）和泛型时会出现令人费解的 警告。这是由于每当调用可变参数方法时，就会创建一 个数组来存放 varargs 参数。如果这个数组的元素类型不是可具体化的（reifialbe），就会得到一条警告。利用 SafeVarargs 注解可以解决这个问题（详见第 32 条）。

当你得到泛型数组创建错误时，最好的解决办法通常是优先使用集合类型 `List<E>`，而不是数组类型 `E[]`。这样可能会损失一些性能或者简洁性，但是换回的却是更高的类型安全性和互用性 。

例如，假设要通过构造器编写一个带有集合的 Chooser 类和一个方法，并用该方法返回在集合中随机选择的一个元素。根据传给构造器的集合类型，可以用 chooser 充当游戏用的色子等。下面是一个没有使用泛型的简单实现：

 // Chooser - a class badly in need of generics!  
public class Chooser {  
    private final Object[] choiceArray;  
    public Chooser(Collection choices) {  
        choiceArray = choices.toArray();  
    }  
    public Object choose() {  
        Random rnd = ThreadLocalRandom.current();  
        return choiceArray[rnd.nextInt(choiceArray.length)];  
    }   
}

要使用这个类，必须将 `choose` 方法的返回值，从 Object 转换成每次调用该方法时想要的类型，如果搞错类型，转换就会在运行时失败。牢记第 29 条的建议，努力将 Chooser 修改成泛型：

// A first cut at making Chooser generic - won't compile   
public class Chooser<T> {  
	private final T[] choiceArray;  
	public Chooser(Collection<T> choices) {   
        choiceArray = choices.toArray();  
    }  
      
    // choose method unchanged  
    public Object choose() {  
        Random rnd = ThreadLocalRandom.current();  
        return choiceArray[rnd.nextInt(choiceArray.length)];  
    }  
}

如果试着编译这个类，将会得到以下错误消息：

Chooser.java:9: error: incompatible types: Object[] cannot be converted to T[]  
           choiceArray = choices.toArray();  
                                        ^  
     where T is a type-variable:  
       T extends Object declared in class Chooser

可以把 Object 数组转换成 T 数组来消除错误消息，但是现在得到了一条警告：

choiceArray = (T[]) choices.toArray();  
  
Chooser.java:9: warning: [unchecked] unchecked cast  
      choiceArray = (T[]) choices.toArray();  
                                         ^  
	required: T[], found: Object[]  
    where T is a type-variable:  
T extends Object declared in class Chooser

编译器告诉你，它无法在运行时检查转换的安全性，因为程序在运行时还不知道 T 是什么——记住（TODO：为什么呢），元素类型信息会在运行时从泛型中被擦除。这段程序可以运行吗？可以，但是编译器无法证明这一点。你可以亲自证明，只要将证据放在注释中，用一条注解禁止警告，但是最好能消除造成警告的根源（详见第 27条）。

要消除未受检的转换警告，必须选择用列表代替数组。下面是编译时没有出错或者警告的 Chooser 类版本：

 // List-based Chooser - typesafe  
public class Chooser<T> {  
	private final List<T> choiceList;  
	public Chooser(Collection<T> choices) {   
        choiceList = new ArrayList<>(choices);  
	}  
	public T choose() {  
        Random rnd = ThreadLocalRandom.current();  
        return choiceList.get(rnd.nextInt(choiceList.size()));  
    }   
}

这个版本的代码稍微冗长 一点，运行速度可能也会慢一点，但是在运行时不会得到 ClassCastException 异常，为此也值了。

总而言之，数组和泛型有着截然不同的类型规则。数组是协变且可以具体化的；泛型是不可变的且可以被擦除的。因此，数组提供了运行时的类型安全，但是没有编译时的类型安全，反之，对于泛型也一样。一般来说，数组和泛型不能很好地混合使用。如果你发现自己将它们混合起来使用，并且得到了编译时错误或者警告，你的第一反应就应该是用列表代替数组。

## 29. 优先考虑泛型

以第 7 条中简单的堆栈实现为例：

// Object-based collection - a prime candidate for generics  
public class Stack {  
	private Object[] elements;  
	private int size = 0;  
	private static final int DEFAULT_INITIAL_CAPACITY = 16;  
	public Stack() {  
		elements = new Object[DEFAULT_INITIAL_CAPACITY];  
		}  
	public void push(Object e) {   
        ensureCapacity();   
        elements[size++] = e;  
	}  
	public Object pop() {   
        if (size == 0)  
			throw new EmptyStackException();  
		Object result = elements[--size];  
		elements[size] = null; // Eliminate obsolete reference   
        return result;  
	}  
    public boolean isEmpty() {  
        return size == 0;  
	}  
    private void ensureCapacity() {  
        if (elements.length == size)  
            elements = Arrays.copyOf(elements, 2 * size + 1);  
    }   
}

这个类应该先被参数化，但是它没有，我们可以在后面将它泛型化（generify）。将它参数化，但不会破坏原来非参数化版本的客户端代码。也就是说，客户端必须转换从堆栈里弹出的对象，以及可能在运行时失败的那些转换。将类泛型化的第一步是在它的声明中添加一个或者多个类型参数。在这个例子中有一个类型参数，它表示堆栈的元素类型，这个参数的名称通常为 E（详见第 68条）。

下一步是用相应的类型参数替换所有的 Object 类型，然后试着编译最终的程序：

// Initial attempt to generify Stack - won't compile!   
public class Stack<E> {  
	private E[] elements;  
	private int size = 0;  
	private static final int DEFAULT_INITIAL_CAPACITY = 16;  
	public Stack() {  
		elements = new E[DEFAULT_INITIAL_CAPACITY];  
	}  
	public void push(E e) {   
        ensureCapacity();   
        elements[size++] = e;  
	}  
	public E pop() {   
        if (size == 0)  
			throw new EmptyStackException();  
		E result = elements[--size];  
		elements[size] = null; // Eliminate obsolete reference   
        return result;  
	}  
       ... // no changes in isEmpty or ensureCapacity  
}

这个类会产生一个错误：

Stack.java:8: generic array creation  
	elements = new E[DEFAULT_INITIAL_CAPACITY];  
				^

如第 28 条中所述，不能创建不可具体化的类型的数组，如 E。每当编写用数组支持的泛型时，都会出现这个问题。解决这个问题有两种方法。

-   第一种，直接绕过创建泛型数组的禁令：创建一个 Object 的数组，并将它转换成泛型数组类型。现在错 误是消除了，但是编译器会产生一条警告。这种用法是合法的，但（整体上而言0不是类型安全的：
    
        // The elements array will contain only E instances from push(E).   
        // This is sufficient to ensure type safety, but the runtime  
        // type of the array won't be E[]; it will always be Object[]!   
        @SuppressWarnings("unchecked")  
        public Stack() {  
            elements = (E[]) new Object[DEFAULT_INITIAL_CAPACITY];  
        }  
    	  
      
    Stack.java:8: warning: [unchecked] unchecked cast  
    found: Object[], required: E[]  
    		elements = (E[]) new Object[DEFAULT_INITIAL_CAPACITY];   
    						^
    
    编译器不可能证明你的程序是类型安全的，但是你可以。你自己必须确保未受检的转换不会危及程序的类型安全性。相关的数组（即 elements 变量）保存在一个私有的域中，永远不会被返回到客户端，或者传给任何其他方法。这个数组中保存的唯一元素，是传给 push 方法的那些元素，它们的类型为 E，因此未受检的转换不会有任何危害。
    
    一旦你证明了未受检的转换是安全的，就要在尽可能小的范围中禁止警告（详见第 27 条）。在这种情况下，构造器只包含未受检的数组创建，因此可以在整个构造器中禁止这条警告。通过增加一条注解 @SuppressWarnings 来完成禁止，Stack 能够正确无误地进行编译，你就可以使用它了，无须显式的转换，也无须担心会出现 ClassCastException 异常。
    
-   消除 Stack 中泛型数组创建错误的第二种方法是，将 elements 域的类型从 `E[]` 改 为 `Object[]`。这么做会得到一条不同的错误。
    
    Stack.java:19: warning: [unchecked] unchecked cast  
    found: Object, required: E  
    		E result = (E) elements[--size];   
    								^
    
    由于 E 是一个不可具体化的类型，编译器无法在运行时检验转换。你还是可以自己证实未受检的转换是安全的，因此可以禁止该警告。根据第 27 条的建议，我们只要在包含未受检转换的任务上禁止警告，而不是在整个 pop 方法上禁止就可以了，方法如下:
    
    	// Appropriate suppression of unchecked warning  
       	public E pop() {  
           	if (size == 0)  
               	throw new EmptyStackException();  
    		// push requires elements to be of type E, so cast is correct 		  
           	@SuppressWarnings("unchecked") E result =  
               	(E) elements[--size];  
           	elements[size] = null; // Eliminate obsolete reference  
           	return result;  
       	}
    

这两种消除泛型数组创建的方法，各有所长。第一种方法的可读性更强：数组被声明为 `E[]` 类型清楚地表明它只包含 E 实例。它也更加简洁：在一个典型的泛型类中，可以在代码中的多个地方读取到该数组；第一种方法只需要转换一次（创建数组的时候），而第二 种方法则是每次读取一个数组元素时都需要转换一次。 因此，第一种方法优先，在实践中也更常用。但是，它会导致堆污染（heap pollution），详见第 32条：数组的运行时类型与它的编译时类型不匹配（除非 E 正好是 0bject)。这使得有些程序员会觉得很不舒服，因而选择第二种方案，虽然堆污染在这种情况下并没有什么危害。

下面的程序示范了泛型 Stack 类的使用方法。程序以倒序的方式打印出它的命令行参数，并转换成大写字母。如果要在从堆栈中弹出的元素上调用 String 的 toUpperCase 方法，并不需要显式的转换，并且确保自动生成的转换会成功：

	// Little program to exercise our generic Stack  
   	public static void main(String[] args) {  
       	Stack<String> stack = new Stack<>();  
       	for (String arg : args)  
           	stack.push(arg);  
       	while (!stack.isEmpty())  
	}

第 28 条鼓励优先使用列表而非数组。实际上不可能总是或者总想在泛型中使用列表。Java 并不是生来就支持列表，因此有些泛型如 ArrayList 必须在数组上实现。为了提升性能，其他泛型如 HashMap 也在数组上实现。

1.  不能创建基本类型的泛型。
    
2.  有一些泛型限制了可允许的类型参数值：
    
    class DelayQueue<E extends Delayed> implements BlockingQueue<E>
    

总而言之，使用泛型比使用需要在客户端代码中进行转换的类型来得更加安全，也更加容易。

## 30. 优先考虑泛型方法

静态工具方法尤其适合于泛型化。Collections 中的所有 算法方法（例如 binarySearch 和 sort）都泛型化了。

 	// Uses raw types - unacceptable! (Item 26)  
   	public static Set union(Set s1, Set s2) {  
       	Set result = new HashSet(s1);  
       	result.addAll(s2);  
       	return result;  
	}

这个方法可以编译，但是有两条警告：

Union.java:5: warning: [unchecked] unchecked call to   
HashSet(Collection<? extends E>) as a member of raw type HashSet  
		Set result = new HashSet(s1);  
					 ^  
Union.java:6: warning: [unchecked] unchecked call to  
addAll(Collection<? extends E>) as a member of raw type Set  
		result.addAll(s2);  
					 ^

将方法声明修改为声明一个类型参数，表示这三个集合的元素类型（两个参数和一个返回值）。声明类型参数的类型参数列表，**处在方法的修饰法及其返回值之间**。如下，类型参数列表为 `<E>`。

// Generic method  
public static <E> Set<E> union(Set<E> s1, Set<E> s2) {  
	Set<E> result = new HashSet<>(s1); result.addAll(s2);  
	return result;  
}

union 方法的局限性在于三个集合的类型必须完全相同。利用有限制的通配符类型可以使方法变得更加灵活（详见第 31 条）。

有时可能需要创建一个不可变但又适用于许多不同类型的对象。由于泛型是通过擦除（详见第 28 条）实现的，可以给所有必要的类型参数使用单个对象，但是需要编写一个静态工厂方法，让它重复地给每个必要的类型参数分发对象。这种模式称作泛型单例工厂（generic singleton factory），常用于函数对象（详见第 42 条），如 `Collections.reverse­Order`，有时也用于像 `Collections.emptySet` 这样的集合。

假设要编写一个恒等函数（identity function）分发器。类库中提供了 `Function.identity`，因此不需要自己编写（详见第 59条），但是自己编写也很有意义。如果在每次需要的时候都重新创建一个，这样会很浪费，因为它是无状态的( stateless)。如果 Java 泛型被具体化了，每个类型都需要一个恒等函数，但是它们被擦除后，就只需要一个泛型单例。请看以下示例：

// TODO：从这开始

# 六. Lambda 和 Stream

## 42. Lambda 优先于匿名类

根据以往的经验，是用带有单个抽象方法的接口（可以但几乎都不是抽象类）作为函数类型（function type）。它们的实例称作函数对象（function object），表示函数或者要采取的动作。自从 1997 年发布 JDK 1. l 以来，创建函数对象的主要方式是通过匿名类（anonymous class，详见第 24条)。下面是一个按照字符串的长度对字符串列表进行排序的代码片段，它用一个匿名类创建了排序的比较函数：

	// Anonymous class instance as a function object - obsolete!  
   	Collections.sort(words, new Comparator<String>() {  
       	public int compare(String s1, String s2) {  
           	return Integer.compare(s1.length(), s2.length());  
       	}  
	});

在 Java 8 中，形成 “带有单个抽象方法的接口是特殊的，值得特殊对待” 的观念。这些接口现在被称作函数接口（functional interface），Java 允许利用 Lambda 表达式（Lambda expression）创建这些接口的实例。Lambda 类似于匿名类的函数，但是比它简洁得多。以下是上述代码用 Lambda 代替匿名类之后的样子。样板代码没有了，其行为也十分明确：

// Lambda expression as function object (replaces anonymous class)  
Collections.sort(words, (s1, s2) -> Integer.compare(s1.length(), s2.length()));

注意， Lambda 的类型（Comparator<String>）、其参数的类型（s1 和 s2，两个都是 String）及其返回值的类型（int），都没有出现在代码中。编译器利用一个称作类型推导（type inference）的过程，根据上下文推断出这些类型。在某些情况下，编译器无法确定类型，你就必须指定。类型推导的规则很复杂，几乎没有程序员能够详细了解这些规则，但是没关系。删除所有 Lambda **参数的类型**吧，除非 它们的存在能够使程序变得更加清晰。如果编译器产生一条错误消息，告诉你无法推导出 Lambda 参数的类型，那么你就指定类型。有时候还需要转换返回值或者整个 Lambda 表达式，但是这种情况很少见。

关于类型推导应该增加一条警告 。 第 26 条告诉你不要使用原生态类型，第 29 条说过要支持泛型类型，第 30 条说过要支持泛型方法。在使用 Lambda 时，这条建议确实非常重要，因为编译器是**从泛型获取到得以执行类型推导的大部分类型信息的**。如果你没有提供这些信息，编译器就无法进行类型推导，你就必须在 Lambda 中手工指定类型，这样极大地增加了它们的烦琐程度。如果上述代码片段中的变量 words 声明为原生态类型 List ，而不是参数化的类型 List<String>，它就不会进行编译。当然，如果用 Lambda 表达式（详见第 14 条和第 43 条）代替比较器构造方法（comparator construction method），有时这个代码片段中的比较器还会更加简练：

Collections.sort(words, comparingInt(String::length));

事实上，如果利用 Java 8 在 List 接口中添加的 sort 方法，这个代码片段还可以更加简短一些：

words.sort(comparingInt(String::length));

Java 中增加了 Lambda 之后，使得之前不能使用函数对象的地方现在也能使用了。例如，以第 34 条中的 Operation 枚举类型为例。由于每个枚举的 apply 方法都需要不同的行为，我们用了特定于常量的类主体，并覆盖了每个枚举常量中的 apply 方法。 通过以下代码回顾一下：

	// Enum type with constant-specific class bodies & data (Item 34)  
   	public enum Operation {  
       	PLUS("+") {  
			public double apply(double x, double y) { return x + y; }   
        },  
		MINUS("-") {  
            public double apply(double x, double y) { return x - y; }  
       	},  
       	TIMES("*") {  
			public double apply(double x, double y) { return x * y; }   
        },  
		DIVIDE("/") {  
			public double apply(double x, double y) { return x / y; }  
		};  
       	private final String symbol;  
       	Operation(String symbol) { this.symbol = symbol; }  
          
       	@Override   
        public String toString() { return symbol; }  
       	public abstract double apply(double x, double y);  
   	}

由第 34 条可知，枚举实例域优先于特定于常量的类主体。Lambda 使得利用前者实现特定于常量的行为变得比用后者来得更加容易了。 只要给每个枚举常量的构造器传递一个实现其行为的 Lambda 即可。构造器将 Lambda 保存在一个实例域中，apply 方法再将调用转给 Lambda。由此得到的代码比原来的版本更简单，也更加清晰 :

// Enum with function object fields & constant-specific behavior  
public enum Operation {  
	PLUS ("+", (x, y) -> x + y),   
    MINUS ("-", (x, y) -> x - y),   
    TIMES ("*", (x, y) -> x * y),   
    DIVIDE("/", (x, y) -> x / y);  
         
    private final String symbol;  
	private final DoubleBinaryOperator op;  
      
	Operation(String symbol, DoubleBinaryOperator op) {  
		this.symbol = symbol;  
		this.op = op;  
	}  
	@Override   
    public String toString() { return symbol; }  
	public double apply(double x, double y) {  
		return op.applyAsDouble(x, y);  
	}   
}

注意，这里给 Lambda 使用了 DoubleBinaryOperator 接口，代表枚举常量的行为。这是在 java.util.function（详见第 44条）中预定义的众多函数接口之一。它表示一个带有两个 double 参数的函数并返回一个 double 结果。

看看基于 Lambda 的 Operation 枚举，你可能会想，特定于常量的方法主体已经形同虚设了，但是实际并非如此。与方法和类不同的是， Lambda 没有名称和文档：如果一个计算本身不是自描述的，或者超出了几行，那就不要把它旋在一个 Lambda 中。对于 Lambda 而言，一行是最理想的， 三行是合理的最大极限。如果违背了这个规则，可能对程序的可读性造成严重的危害。如果 Lambda 很长或者难以阅读，要么找一种方法将它简化，要么重构程序来消除它。而且，传入枚举构造器的参数是在静态的环境中计算的。因而，枚举构造器中的 Lambda 无法访问枚举的实例成员。如果枚举类型带有难以理解的特定于常量的行为，或者无法在几行之内实现，又或者需要访问实例域或方法，那么特定于常量的类主体仍然是首选。

Lambda 限于函数接口。如果想创建抽象类的实例，可以用匿名类来完成，而不是用 Lambda。同样地，可以用匿名类为带有多个抽象方法的接口创建实例。最后一点，Lambda 无法获得对自身的引用。在 Lambda 中，关键字 this 是指外围实例，这个通常正是你想要的。在匿名类中，关键字 this 是指匿名类实例。如果需要从函数对象的主体内部访问它，就必须使用匿名类 。

Lambda 与匿名类共享你无法可靠地通过实现来序列化和反序列化的属性 。 因此， 尽可 能不要(除非迫不得已)序列化一个 Lambda (或者匿名类实例) 。 如果想要可序列化的函数 对象，如 Comparator，就使用私有静态嵌套类(详见第 24条)的实例。

总而言之，从 Java 8 开始，Lambda 就成了表示小函数对象的最佳方式。千万不要给函数对象使用匿名类，除非必须创建非函数接口的类型的实例。同时，还要记住， Lambda 使得表示小函数对象变得容易，因此打开了之前从未实践过的在 Java 中进行函数编程的大门 。

## 43. 方法引用优于 Lambda

map.merge(key, 1, (oldValue, val) -> oldValue + val);

如果指定的键没有映射，该方法就会插入指定值；如果有映射存在，merge 方法就会将指定的函数应用到当前值和指定值上，并用结果覆盖当前值。针对此例，如果 map 中有 key 这个键，那么就加上 1；否则插入 (key, 1)。

这样的代码读起来清晰明了，但仍有些样板代码 。 参数 oldValue 和 val 没有添加太多价值，却占用了不少空间。实际上， Lambda 要告诉你的就是，该函数返回的是它两个参数的和。从 Java8 开始， Integer（以及所有其他的数字化基本包装类型都）提供了一个名为 sum 的静态方法，它的作用也同样是求和。我们只要传人一个对该方法的引用，就可以更轻松地得到相同的结果：

map.merge(key, 1, Integer::sum);

方法带的参数越多，能用方法引用消除的样板代码就越多。但在有些 Lambda 中，即便它更长，但你所选择的参数名称提供了非常有用的文档信息，也会使得 Lambda 的可读性更强，并且比方法引用更易于维护。

只要方法引用能做的事，就没有 Lambda 不能完成的（只有一种情况例外，有兴趣的读者请参见 JLS,9.9-2）。也就是说，使用方法引用通常能够得到更加简短、清晰的代码。如果 Lambda 太长，或者过于复杂，还有另一种选择：从 Lambda 中提取代码，放到一个新的方法中，并用该方法的一个引用代替 Lambda。你可以给这个方法起一个有意义的名字，并用自己满意的方式编写进入文档。如果是用 IDE 编程，则可以在任何可能的地方都用方法引用代替 Lambda。 有时候，Lambda 也会比方法引用更加简洁明了。这种情况大多是当方法与 Lambda 处在同一个类中的时候。比如下面的代码片段，假定发生在一个名为 GoshThisClassNameisHumongous 的类中：

service.execute(GoshThisClassNameIsHumongous::action);

Lambda 版本如下：

service.execute(() -> action());

这个代码片段使用了方法引用，但是它既不比 Lambda 更简短，也不比它更清晰，因此应该优先考虑 Lambda。类似的还有 Function 接口，它用一个静态工厂方法返回 id 函数 Function.identity()。如果它不用这个方法，而是在行内编写同等的 Lambda表达式：x -> x，一般会比较简洁明了。

许多方法引用都指向静态方法，但其中有 4 种没有这么做。其中两个是有限制（bound）和无限制（unbound）的实例方法引用。在有限制的引用中，接收对象是在方法引用中指定的。有限制的引用本质上类似于静态引用：函数对象与被引用方法带有相同的参数。在无限 制的引用中，接收对象是在运用函数对象时，通过在该方法的声明函数前面额外添加一个参数来指定的。无限制的引用经常用在流管道（Stream pipeline）（详见第 45 条）中作为映射和过滤函数。最后，还有两种构造器（constructor）引用，分别针对类和数组。构造器引用是充当工厂对象。这五种方法引用概括如下：![Screen Shot 2021-05-30 at 21.43.49](https://chp-image-hosting.oss-cn-hangzhou.aliyuncs.com/uPic/Screen%20Shot%202021-05-30%20at%2021.43.49.png)

总而言之，方法引用常常比 Lambda 表达式更加简洁明了。只要方法引用更加简洁、清晰，就用方法引用；如果方法引用并不简洁，就坚持使用 Lambda。

## 44. 坚持使用标准的函数接口

在出现了 Lambda 后，API 编写的最佳实践发生了改变，例如可以不去用模版方法模式了，现在的替代方法是提供一个接受函数对象的静态工厂或者构造器。

以 `LinkedHashMap` 为例，每当调用 put 的时候，内部都会调用 protected 方法 `removeEldestEntry` 方法来删除最早被添加的键值对。

	protected boolean removeEldestEntry(Map.Entry<K,V> eldest) {  
        return false;  
    }

子类可以通过重写这个方法，来达到缓存的目的：

	private static final int MAX_ENTRIES = 100;  
        
	protected boolean removeEldestEntry(Map.Entry eldest) {  
		return size() > MAX_ENTRIES;  
	}

这种做法很好，但使用 Lambda 可以完成的更漂亮。

### 标准函数接口

假如现在编写 `LinkedHashMap`，它会有一个带函数对象的静态工厂或者构造器。看一下 `removeEldestEntry` 的声明，你可能会以为该函数对 象应该带一个 `Map.Entry<K, V>`，并且返回一 个 boolean，但实际并非如此：`removeEldestEntry` 会调用 `size` 方法来获取数量，因为它自己本身也是一个实例方法。但**传到构造器的函数对象则不是 Map 中的实例方法**，无法获取到数量，因为调用其工厂或者构造器时，这个 Map 还不存在。所以，Map 必须将它自身传给函数对象，因此必须传入映射以及最早被添加的 Entry：

	// Unnecessary functional interface; use a standard one instead.  
   @FunctionalInterface interface EldestEntryRemovalFunction<K,V>{  
       boolean remove(Map<K,V> map, Map.Entry<K,V> eldest);  
	}

虽然这样可以，但是最好的办法是尽可能使用 `java.util.function` 包中提供的标准函数接口，这样也能使得 API 更加易懂。例如此例中，应该优先使用 `BiPredicate<Map<K, v>, Map.Entry<K, V>>`。

标准函数接口有 43 个，但只需记住 6 个基本的即可：

-   `Operator` 接口代表返回值和参数类型相同的函数。有 Unary 和 Binary 两种。
    
-   `Predicate` 接口代表有一个参数并且返回 boolean 的函数。
    
-   `Function` 接口代表返回值和参数类型不同的函数。
    
-   `Supplier` 接口代表没有参数并且返回（或 supplies）一个值的函数。
    
-   `Consumer` 接口代表有一个参数并且没有返回值的函数，只是消费参数。
    

总结如下：

![Screen Shot 2021-06-06 at 16.09.20](https://chp-image-hosting.oss-cn-hangzhou.aliyuncs.com/uPic/Screen%20Shot%202021-06-06%20at%2016.09.20.png)

这六种基本接口每个都针对 int、long 和 double 有三个变式。 如 `IntPredicate、` 和 `LongBinaryOperator`。除了 `Function` 变体以外的其他变体接口的类型都不是参数化的，`Function` 变体是以返回类型为参数。例如 `LongFunction<int[]>` 有一个 `long` 类型的参数然后返回一个 `int[]`。

`Function` 接口的参数和返回值类型总是不同的，因为如果相同，那么它就会是一个 `UnrayOperator` 了。（实际上 Operator 都是继承 Fuction 来实现的，例如 `UnaryOperator<T>` 继承了 `Function<T, T>`。）

`Function` 接口还有 9 种额外变体，它们的返回值类型都是 primitive：

-   如果参数和返回值都是 primitive，它们的命名格式是 `SrcToResultFunction`，比如 `LongToIntFunction`（6 种变式）。
    
-   如果参数类型是对象引用而返回值是 primitive，命名格式为 `<Src>ToObjFunction`，比如 `DoubleToObjFunction` （3 种变式）。
    

有三种基本类型有两个参数的版本（9 种变式）：

-   `BiPredicate<T, U>`。
    
-   `BiFunction<T, U, R>`。类似的，`BiFunction` 还会有三种返回基本类型的变体：`ToIntBiFunction<T, U>`、`ToLongBiFunction<T, U>` 和 `ToDoubleBiFunction<T, U>`。
    
-   `BiConsumer<T, U>`。除此之外，`Consumer` 接口还有接收两个参数的变式，这两个参数一个是对象引用，一个是 primitive：`ObjDoubleConsumer<T>`、`ObjIntConsumer<T>` 和 `ObjLongConsumer<T>`。
    

最后就是 `BooleanSupplier` 接口，返回值为 boolean，这也是 boolean 在 43 种函数接口名字中第一次出现（但返回值是 boolean 的有 `Predicate` 和它的四个变式）。

绝大部分标准函数接口都支持 primitive 类型。最好不要把 boxed primitives 用到 primiteve 函数接口上，虽然这样可行，但不仅违反了 61 条，而且在批量操作时性能会很差。

### 自己编写函数接口

当所有的标准函数接口没有一个是需要的时候，就可以自己编写了。比如需要一个 `Predicate`，它有三个参数或者可以抛出一个已检查的异常。

但在有的时候，标准函数接口有我们需要的结构，但却还是不使用。比如 `Comparator<T>`，虽然它在结构上和 `ToIntBiFunction<T, T>` 相同，但如果使用后者的话就错了。原因有三：

1.  Comparator 的名字提供了很好的说明；
    
2.  Comparator 有着严格的条件限制，构成了它的总则（general contract）。
    
3.  它内部实现了大量好用的缺省方法，可以对 Comparator 进行转换和合并。
    

所以，当需要编写的接口具有和 Comparator 一样的理由的时候，就可以自己额外编写专用的函数接口。

### 函数接口注解

必须用 `@FunctionalInterface` 来注解函数接口，它和 `@Override` 类似，用来表明设计意图。有三个目的：

1.  告诉读者，这个类是针对 Lambda 设计的；
    
2.  这个接口不会进行编译，除非它只有一个抽象方法；
    
3.  避免后续维护人员不小心给该接口添加抽象方法。
    

### 建议

最后一点是关于函数接口在 API 中的使用。不要在相同的参数位置，提供不同的函数接口来进行多次重载的方法，否则可能在客户端导致歧义。这不仅仅是理论上的问题。比如 ExecutorService 的 submit 方法就可能带有 `Callable<T>` 或者 `Runnable`，并且还可以编写一个客户端程序，要求进行一次转换，以显示正确的重载（详见第 52 条）。避免这 个问题的最简单方式是，不要编写在同一个参数位置使用不同函数接口的重载 。 这是该建议的一个特例，详情请见第 52条。

## 45. 谨慎使用 Stream

### 介绍

Stream API 提供了两个关键抽象：

-   Stream（流）代表元素有限或无限的顺序。
    
-   Stream pipeline（流管道）代表这些元素的一个多级运算。
    

Stream 元素可以来自集合、数组、文件、正则表达式模式匹配器、伪随机数生成器等。这些元素可以是对象引用或者基本类型（只支持 int、long 和 double）。

一个 Stream pipeline 种包含一个源 stream，接着是 0 个或多个**中间操作**（intermediate operation）和一个**终止操作**（terminal operation）。每个中间操作都会通过某种方式对 Stream 进行转换，如映射或者过滤，所有中间操作都是将一个 Stream 转换成另一个 Stream，中间的元素类型也可能发生改变。终止操作会在最后一个中间操作产生的 Stream 上执行一个最终的计算，如将元素保存到一个集合中并返回某一个元素，或者打印出所有元素等。

Stream pipeline 通常是 lazy 的，知道调用终止操作时才会开始计算，对于完成终止操作不需要的数据元素，将永远都不会被计算。正是这种 lazy 计算，使无限 Stream 成为可能。但注意，没有终止操作的 Stream pipeline 将是一个静默的无操作指令，因此千万不能忘记终止操作。

Stream API 是流式（fluent）的：所有包含 pipeline 的调用可以链接成一个表达式。多个 pipeline 也可以链接在一起，成为一个表达式。

在默认情况下， Stream pipeline 是按顺序运行的。要使 pipeline 并发执行，只需在该 pipeline 的任何 Stream 上调用 parallel 方法即可，但是通常不建议这么做（详见第 48 条）。

### 谨慎使用

Stream 可以执行任何计算，但并不意味着应该在任何时候都用 Stream。Stream 可以使程序变得更加简洁、清晰；但如果使用不当，会使程序变得混乱且难以维护。对于什么时候应该使用 Stream，并没有硬性的规定，但是可以有所启发。

下面的程序统计用户指定最低值的所有换位词（anagram）：

   // Prints all large anagram groups in a dictionary iteratively  
   public class Anagrams {  
       public static void main(String[] args) throws IOException {  
           File dictionary = new File(args[0]);  
           int minGroupSize = Integer.parseInt(args[1]);  
           Map<String, Set<String>> groups = new HashMap<>();  
           try (Scanner s = new Scanner(dictionary)) {  
               while (s.hasNext()) {  
                   String word = s.next();   
                     
                   groups.computeIfAbsent(alphabetize(word),  
                       (unused) -> new TreeSet<>()).add(word);  
               }   
           }  
             
           for (Set<String> group : groups.values())  
               if (group.size() >= minGroupSize)  
                   System.out.println(group.size() + ": " + group);  
       }  
       private static String alphabetize(String s) {  
           char[] a = s.toCharArray();  
           Arrays.sort(a);  
           return new String(a);  
  
       }   
   }

下面这段代码同样能解决上述问题，只不过大量使用了 Stream。滥用 Stream 会使程序代码更难以读懂和维护。

   	// Overuse of streams - don't do this!  
   	public class Anagrams {  
     	public static void main(String[] args) throws IOException {  
       	Path dictionary = Paths.get(args[0]);  
       	int minGroupSize = Integer.parseInt(args[1]);  
         	try (Stream<String> words = Files.lines(dictionary)) {  
           	words.collect(  
             	groupingBy(word -> word.chars().sorted()  
                         	.collect(StringBuilder::new,  
                           	(sb, c) -> sb.append((char) c),  
                           	StringBuilder::append).toString()))  
             	.values().stream()  
                .filter(group -> group.size() >= minGroupSize)  
                .map(group -> group.size() + ": " + group)  
                .forEach(System.out::println);  
            }   
        }  
    }

可以采用中间方案，这样程序会变得简短又清晰：

	 // Tasteful use of streams enhances clarity and conciseness  
   	public class Anagrams {  
      	public static void main(String[] args) throws IOException {  
         	Path dictionary = Paths.get(args[0]);  
         	int minGroupSize = Integer.parseInt(args[1]);  
         	try (Stream<String> words = Files.lines(dictionary)) {  
            	words.collect(groupingBy(word -> alphabetize(word)))  
                    .values().stream()  
                    .filter(group -> group.size() >= minGroupSize)   
                    .forEach(g -> System.out.println(g.size() + ": " + g));  
            }   
        }  
        // alphabetize method is the same as in original version  
        private static String alphabetize(String s) {  
           	char[] a = s.toCharArray();  
           	Arrays.sort(a);  
           	return new String(a);  
       }   
    }

个 Stream 中的 pipeline 没有中间操作；它的终止操作将所有的单词集合到一个映射中，按照它们的字母排序形式对单词进行分组（详见第 46 条）。这个映射与前面两个版本中的是完全相同的。随后，在映射的`values()` 视图中 打开了一个新的 `Stream<List<String>>`。这个 Stream 中的元素都是换位词分组。 Stream 进行了过滤，把所有单词长度小于 minGroupSize 的单词都去掉了，最后，通过终止操作的 `forEach` 打印出剩下的分组。

> 在没有显式类型的情况下，仔细命名 Lambda 参数， 这对于 Stream pipeline 的可读性至关重要。

在 Stream pipeline 中使用 helper 方法（如上面的 `alphabetize`），对于可读性而言，比在迭代化（循环）代码中使用更为重要。并且如果在上例 Stream pipeline 中实现 alphabetize 可能会导致速度变慢，因为不支持 char Stream。不支持它是因为 Stream 处理 char 值有很多危险：

"Hello world!".chars().forEach(System.out::print);  
输出：721011081081113211911111410810033

因为 chars() 返回的 Stream 是 IntStream，里面的元素是 int。可以通过转型：

"Hello world!".chars().forEach(x -> System.out.print((char) x));

### Stream pipeline 和 迭代化代码

Stream pipeline 利用函数对象（一般是 Lambda 或者方法引用）来描述重复的计算，而迭代版代码则利用代码块来描述重复的计算。下列工作只能通过代码块，而不能通过函数对象来完成：

-   -   代码块中可以读写范围内的任何局部变量；
        
    -   Lanbda 只能读取 final 或者有效的 final 变量，并且不能修改任何局部变量。
        
-   -   代码块中，可以从外围方法中 return、break 或 continue 外围循环，或者抛出受检异常；
        
    -   Lambda 则无法完成上述事情。
        

Stream 适合的：

-   统一转换元素序列。
    
-   过滤元素序列。
    
-   利用单个操作（如添加、连接或者计算最小值）合并元素序列。
    
-   将元素序列存放到一个集合中，比如根据某些公共属性进行分组。
    
-   搜索满足某些条件的元素序列。
    

### 使用 Stream 的另一个难事

Stream 很难完成的一件事件就是，访问之前 pipeline 中相应元素：一旦将一个值映射到其他值，原来的值就会丢失。一种解决方法是将每个值都映射到包含原始值和新值的一个对象对（pair object），但当 piperline 的多个阶段都需要时，代码将会变得混乱，违背 Stream 的初衷。最好的解决方法是，当需要访问较早阶段的值时，将映射颠倒过来。

例如，编写一个打印前 20 个梅森素数（Mersenne primes）的程序。这是一个形式为 2^p - 1 的数字，如果 p 是素数，那么对应的梅森数字也是素数，那么它就是一个梅森素数。

作为 pipeline 的第一个 Stream，我们想要的是所有素数。下面的方法将返回（无限）Stream。假设使用的是静态导入，便于访问 `Biginteger` 的静态成员：

static Stream<BigInteger> primes() {  
	return Stream.iterate(TWO, BigInteger::nextProbablePrime);  
}

方法的名称（primes）是一个复数名词，它描述了 Stream 的元素。强烈建议返回 Stream 的所有方法都采用这种命名惯例，可以增强 Stream pipeline 的可读性。该方法使用静态工厂 `Stream.iterate`，它有两个参数：Stream 中的第一个元素，以及从前一个元素中生成下一个元素的一个函数。下面的程序用于打印出前 20 个梅森素数：

public static void main(String[] args) {  
    primes().map(p -> TWO.pow(p.intValueExact()).subtract(ONE))  
        .filter(mersenne -> mersenne.isProbablePrime(50))  
        .limit(20)  
        .forEach(System.out::println);  
}

代码从素数开始，计算出相应的梅森素数，过滤掉所有不是素数的数字（其中 50 是个神奇的数字，它控制着这个概率素性测试），限制最终得到的 Stream 为 20 个元素，并打印出来。

> `isProbablePrime(int certainty)`：如果此 BigInteger 可能为素数，则返回 true，如果它一定为合数，则返回 false。如果 certainty <= 0，则返回 true。

现在假设想要在每个梅森素数之前加上其指数（p）。这个值只出现在第一个 Stream 中， 因此在负责输出结果的终止操作中是访问不到的。将发生在第一个中间操作中的映射颠倒过来，便可以很容易地计算出梅森数字的指数。该指数只不过是一个以二进制表示的位数，因此终止操作可以产生所要的结果：

 .forEach(mp -> System.out.println(mp.bitLength() + ": " + mp));

### 选择 Stream 还是迭代

假设 `Card` 是一个不变值类，用于封装 `Rank` 和 `Suit`，这两者都是枚举类型。现在需要计算从这两个集合中选择所有元素对来初始化所有 Card。

如果采用迭代：

   // Iterative Cartesian product computation  
   private static List<Card> newDeck() {  
       List<Card> result = new ArrayList<>();  
       for (Suit suit : Suit.values())  
           for (Rank rank : Rank.values())  
               result.add(new Card(suit, rank));  
       return result;  
   }

如果采用 Stream：

// Stream-based Cartesian product computation  
   	private static List<Card> newDeck() {  
       	return Stream.of(Suit.values())  
           	.flatMap(suit ->   
                  Stream.of(Rank.values())  
                     .map(rank -> new Card(suit, rank)))   
            .collect(toList());  
	}

> 利用了中间操作 `flatMap`，将 Stream 中的每个元素都映射到一个 Stream 中，然后将这些新的 Stream 全部合并到一个 Stream（或者将它们扁平化）。

这两种版本谁更好完全取决于个人偏好，以及编程环境。

总之，有些任务最好用 Stream 完成，有些则要用迭代，而有许多任务则最好是结合使用这两种方法来一起完成。

## 46. 优先选择 Stream 中无副作用的函数

### 正确使用 Stream

Stream 并不只是一个 API，它是一种基于函数编程的模型。为了获得 Stream 带来的描述性和速度，有时还有并行性，必须采用范型以及 API。

Stream 范型最重要的部分是把计算构造成一系列变型，每一级结果都尽可能靠近上一级结果的纯函数（pure function）。纯函数是指其结果只取决于输入的函数：它不依赖任何可变的状态，也不更新任何状态。为了做到这一点，传入 Stream 操作的任何函数对象，无论是中间操作还是终止操作，都应该是无副作用的。

如果要统计单词在一个文本文件中出现的频率：

// Uses the streams API but not the paradigm--Don't do this!  
Map<String, Long> freq = new HashMap<>();  
try (Stream<String> words = new Scanner(file).tokens()) {  
    words.forEach(word -> {  
        freq.merge(word.toLowerCase(), 1L, Long::sum);  
    });   
}

> `Scanner` 的 `Stream` 方法可以获得 Stream，这是 Java 9 中增加的。如果是更早的版本，可以把实现 Iterator 的扫描器，翻译成使用了类似于 47 条中适配器的 Stream（`streamOf (Iterable<E>)`）。

虽然使用了 Stream、Lambda 和方法引用，但这根本不是 Stream 的代码，只是伪装成 Stream 代码的迭代式代码。它并没有享受到 Stream API 带来的优势，代码反而更长了点，可读性也差了点，并且比相应的迭代化代码更难维护。因为这段代码利用一个改变外部状态（频率表）的 Lambda，完成了在终止操作的 forEach 中的所有工作。forEach 操作的任务不只展示由 Stream 执行的计算结果，这在代码中并非好事，改变状态的 Lambda 也是如此。那么这段代码应该是下面这样：

// Proper use of streams to initialize a frequency table  
Map<String, Long> freq;  
try (Stream<String> words = new Scanner(file).tokens()) {  
    freq = words  
        .collect(groupingBy(String::toLowerCase, counting()));  
}

这个代码正确的使用了 Stream API，变得更加简洁、清晰。那么为什么有人会以其他的方式编写呢？这是为了使用他们已经熟悉的工具。Java 程序员都知道如何使用 for-each 循环，终止操作的 forEach 也与之类似。但 forEach 操作是终止操作中最没有威力的，也是对 Stream 最不友好的。它是显式迭代，因而不适合并行。**forEach 操作应该只用于报告 Stream 计算的结果，而不是执行计算。**有时候，也可以将 forEach 用于其他目的，比如将 Stream 计算的结果添加到之前已经存在的集合中去。

### Collectors 接口

`Collectores` 有 39 种方法，可以把它当作封装缩减（将 Stream 元素合并到单个对象中）策略的黑盒对象。

#### collect to Collection

这种比较简单，有 `toList()`、`toSet()` 和 `toCollection(collectionFactory)`，最后一个方法返回指定的集合类型。

下面代码从频率表中提取排名前十的单词：

// Pipeline to get a top-ten list of words from a frequency table  
List<String> topTen = freq.keySet().stream() 		  
    .sorted(comparing(freq::get).reversed())   
    .limit(10)  
    .collect(toList());

> 这里静态导入了 Collectors 的所有成员，这样可以提升 Stream pipeline 的可读性。

这段代码有技巧的部分时传给 `sorted` 的比较器 `comparing(freq::get).reversed()`，`comparing()` 带有一个键提取函数

#### 其他 36 种方法

其他方法大部分是将 Stream 集合到 Map 中，这会复杂很多：每个 Stream 元素都有一个关联的键和值，多个 Stream 元素可以关联同一个键。

##### toMap

###### toMap(keyMapper, valueMapper)

两个参数都是 `Fuction`，分别将 Stream 元素映射到键和值。采用第 34 条 `fromString` 实现中的收集器，将枚举的字符串形式映射到枚举本身：

// Using a toMap collector to make a map from string to enum  
private static final Map<String, Operation> stringToEnum =  
    Stream.of(values()).collect(  
    	toMap(Object::toString, e -> e));

但是如果多个 Stream 元素映射到了同一个键，pipeline 就会抛出一个 `IllegalStateException` 异常将它终止。

###### toMap(keyMapper, valueMapper, mergeFunction)

这种形式可以解决上述冲突。

第三个参数是一个 merge function。这个 Function 是一个 `BinaryOperator<V>`，V 是映射的值类似。当不同的值映射到同一个键上的时候，merge function 就开始起作用。

> 不要被 merge 名字迷惑了，要知道的只有：这是一个 `BinaryOperator<V>`。
> 
> > `BinaryOperator<T> extends BiFunction<T, T, T>`，但这并不重要。

与其说可以解决冲突，倒不如说是让用户有更多的操作。假设有一个 Stream，代表不同歌唱家的唱片，下面的代码可以得到一个从歌唱家到最畅销唱片之间的映射。这种情况下，我们的目的根本不是解决冲突。

// Collector to generate a map from key to chosen element for key  
Map<Artist, Album> topHits = albums.collect(   
    toMap(Album::artist, a->a, maxBy(comparing(Album::sales))));

这个比较器使用了静态工厂方法 `maxBy`，这是从 `BinaryOperator` 静态导入的。该方法将 `Comparator<T>` 转换成一个 `BinaryOperator<T>`，用于计算指定比较器产生的最大值。在这个例子中，比较器是由比较器构造器方法 `comparing` 返回的，它有一 个键提取函数 `Album::sales`。

这种形式还有一种用途：生成一个收集器，当有冲突时强制保留最后更新（last-write-wins）：

 // Collector to impose last-write-wins policy  
toMap(keyMapper, valueMapper, (v1, v2) -> v2)

###### toMap(keyMapper, valueMapper, mergeFunction, mapSupplier)

这是 `toMap` 的最后一种形式，这是一个 Map 工厂，可以指定特殊的 Map 实现，如 `EnumMap`。

这三种 `toMap` 版本还有另外的变换形式：`toConcurrentMap`。

##### groupingBy

它返回收集器来生成 map，根据**分类函数**将元素分类，分类函数带有一个元素，并返回其所属的类别。这个类别就是元素的映射键。

###### groupingBy(Function classifier)

只有一个分类器，并返回一个 Map，映射值为每个分类中所有元素的列表。下列代码就是在第 45条的 Anagram 程序中用于生成 Map 的收集器：

words.collect(groupingBy(word -> alphabetize(word)))

###### groupingBy(Function classifier, Collector downstream)

如果要让 `groupingBy` 返回一个收集器用它生成一个值而不是列表的映射，除了分类器之外，还可以指定 一个下游收集器（downstream collector）。下游收集器从包含某个类别中所有元素的 Stream 中生成一个值。这个参数最简单的用法是传入 `toSet()`，结果生成一个 Map，这个映射值为元素集合而非列表。

另一种方法是传入 `toCollection(collectionFactory)`，允许创建存放各元素类别的集合。 这样就可以自由选择自己想要的任何集合类型了。带两个参数的 `groupingBy` 版本的另一种简单用法是，传入 `counting()` 作为下游收集器。这样会生成一个 map，它将每个类别与该类别中的元素数量关联起来，而不是包含元素的集合。例如实现单词频率表：

Map<String, Long> freq = words   
    .collect(groupingBy(String::toLowerCase, counting()));

###### groupingBy(Function classifier, Supplier mapFacotry, Collector downstream)

这个版本可以指定一个 Map 工厂。 groupingBy 的这个版本可以控制 map 的类型，以及内部值（集合）的类型。因此，比如可以定义一个收集器，让它返回一个值类型为 TreeSet 的 TreeMap。

> 这个方法违背了标准的可伸缩参数列表模式：参数 `mapFactory` 在 `downStream` 参数之前，而不是在它之后。

###### groupingByConcurrent

和 `toConcurrentMap` 一样，`groupingByConcurrent` 提供了 `groupingBy` 三种重载的变体。

###### partitioningBy

这是 `groupingBy` 用的比较少的一种变体。

有两个重载方法：

-   带一个 `Predicate` 参数，并返回一个键为 Boolean 的 Map。
    
-   除了 `Predicate` 之外还带有 downstream collector。
    

##### 下游收集器

`counting` 方法返回的收集器只用作下游收集器。但通过 Stream 上的 count 方法，直接就有相同的功能，因此压根没有理由使用 `collect(counting())`。

Collector 还有 15 种方法，其中有 9 种方法的名称都是以 suming、averaging 和 summarizing 开头。还包括 maping、flatMapping 和 collectingAndThen 方法。

这些收集器试图部分复制收集器中 Stream 的功能，以便下游收集器可以成为 ministream。

##### 最后三个方法

这三个方法都在 `Collectors` 中，但是并不包含集合。

前两个是 `minBy` 和 `maxBy`，它们有一个比较器，并返回由比较器确定的 Stream 中的最少元素或者最多元素。它们是 Stream 接口中 `min` 和 `max` 方法的粗略概括，也是 `BinaryOperator` 中同名方法返回的二元操作符，与收集器相类似。

最后一个方法是 `joining`，它只在 `CharSequence` 实例的 Stream 中操作，例如字符串。它以参数的形式返回一个简单地合并元素的收集器。其中一种参数形式带有一个名为 delimiter（分界符）的 `CharSequence` 参数，它返回一个连接 Stream 元素并在相邻元素之间插入分隔符的收集器（注意不要引起歧义）。这三种参数形式，除了分隔符之外，还有一个前缀和一个后缀。

## 47. Stream 要优先使用 Collection 作为返回类型

### 介绍

很多方法会返回元素序列，Java 8 之前，这些序列可以是：集合接口 Collection、Set 和 List；Iterable；数组，通常很容易决定应该返回哪种序列类型。标准是一个集合接口。如果一个方法只是为了 for-each 循环或者是返回元素序列，无法用它来实现 Collection 接口的一些方法（通常是 `contains(Object)`），就可以使用 Iterable 接口。如果返回的元素是基本类型，或者有强烈的性能需求的时候，通常使用数组。在 Java 8 中添加了 Stream，这就使得要返回元素序列的方法更难去选择返回类型了。

正如 45 条所述的 Stream 和迭代的选择，在这里 Stream 也并不总是最好的选择。有可能 API 返回了 Stream，但用户想通过 for-each 循环来遍历。目前，Stream 接口在 Iterable 接口中只包含了一个抽象方法，Stream 和 Iterable 接口对这个方法的规范是兼容的。唯一阻止程序员在使用 for-each 循环遍历 Stream 的是 Stream 无法去继承 Iterable 接口。

### Stream 还是 for-each

这直到目前也没有好的解决办法。第一眼会觉得传一个方法引用给 Stream 的迭代器方法就可以解决这个问题，但这通过不了编译：

// Won't compile, due to limitations on Java's type inference  
for (ProcessHandle ph : ProcessHandle.allProcesses()::iterator) {   
    // Process the process  
}  
  
Test.java:6: error: method reference not expected here  
for (ProcessHandle ph : ProcessHandle.allProcesses()::iterator) {  
						^

可以将方法引用转换成适当参数化的 Iterable：

 // Hideous workaround to iterate over a stream  
for (ProcessHandle ph : (Iterable<ProcessHandle>)  
     					ProcessHandle.allProcesses()::iterator)

这段代码虽然可以运行，但过于杂乱和不清晰，更好的做法是实现一个适配器方法。JDK 并没有提供，但是这很容易编写。这个方法中不需要进行转型，因为 Java 的类型引用在这里派上了用场（TODO：类型引用）。

// Adapter from  Stream<E> to Iterable<E>  
public static <E> Iterable<E> iterableOf(Stream<E> stream) {  
	return stream::iterator;  
}

使用这个适配器，就可以在 for-each 里遍历任何 Stream：

for(ProcessHandle p:iterableOf(ProcessHandle.allProcesses())){   
    // Process the process  
}

注意：34 条中的 Anagrams 程序的 Stream 版本使用了 `Files.lines` 方法来读取字典，而迭代版本使用了 scanner。前者比 scanner 更好，因为 scanner 会无声吞掉读文件中遇到的所有异常。这是一种妥协，因为 `Files.lines` 才是正确的做法，但用户可能想通过 for-each 来遍历。

反过来也成立，也可以提供 Iterable 到 Stream 的适配器：

// Adapter from Iterable<E> to Stream<E>  
public static <E> Stream<E> streamOf(Iterable<E> iterable) {  
	return StreamSupport.stream(iterable.spliterator(), false);  
}

如果编写一个方法来返回元素序列，并且清楚知道它只会被用在 stream pipeline 中，那就应该返回 Stream，这同样适用 Iterable。但是当编写一个公共 API 的时候，应该为用户提供这两种选项，除非肯定绝大部分用户只会适用其中一种方式。

### Collection 接口

`Collection` 接口是 `Iterable` 接口的子类型，它有一个 `stream` 方法，所以它可以提供 Stream 和 for-each 两种访问元素的方式。**因此，Collection 或者其他合适的子类型通常是一个返回元素序列的公共方法最好的返回值类型。**

数组也提供了这两种访问方式：`Arrays.asList` 和 `Stream.of`。

如果返回的序列足够小且容易存储，那么最好返回标准的集合实现，如 ArrayList 或这 HashSet。但是**千万不要为了把它们作为一个集合返回，而在内存中保存巨大的序列。**

<<<<<<< HEAD 如果返回的序列很大，但是可以被准确展示，可以考虑实现一个专用的集合。比如要返回一个给定集合的幂集（power set），它由给定集合的所有子集组成。如果给定集合的大小为 n，那么幂集的大小就是 2^n。所以不应该将这个幂集存储在标准集合实现中，可以借助 `AbstracList` 来实现一个定制集合。

可以采用位向量（bit vector）的方式：

// Returns the power set of an input set as custom collection  
public class PowerSet {  
    public static final <E> Collection<Set<E>> of(Set<E> s) {  
        List<E> src = new ArrayList<>(s);  
        if (src.size() > 30)  
            throw new IllegalArgumentException("Set too big " + s);   
          
        return new AbstractList<Set<E>>() {  
            @Override public int size() {  
                return 1 << src.size(); // 2 to the power srcSize  
            }  
            @Override public boolean contains(Object o) {  
                return o instanceof Set && src.containsAll((Set)o);  
            }  
            @Override public Set<E> get(int index) {  
                Set<E> result = new HashSet<>();  
                for (int i = 0; index != 0; i++, index >>= 1)  
                    if ((index & 1) == 1)  
                        result.add(src.get(i));  
                return result;  
            }  
        };   
    }  
}

> 注意 PowerSet 的 of 方法在传入进来的 Set 大小超过 30 时会抛出异常。这也是 `Collection` 作为返回值类型比 Stream 和 Iterable 不足的地方：Collection 的 size 方法返回的是 int 值，这就限制了返回的元素序列最多有 2^31 - 1 个

为了在 `AbstracCollection` 上编写出 `Collection` 的一个实现，除了 Iterable 必须的方法之外，只需要实现两个方法：`contains` 和 `size`。如果这两个方法实现不了，可能是因为在迭代之前没法确定元素序列的内容，这种情况就应该选择返回 Stream 还是 Iterable，或者是都返回。

### 再谈 Stream、Iterable 和 Collection

在有些时候，可以仅仅通过 Stream、Iterable 和 Collection 哪种更容易实现来选择。比如要返回一个列表所有相邻的列表，这个返回的列表大小会是源列表大小的平方。这个大小是不可接受的。如果跟之前的幂集一样定制集合来实现，会更加麻烦。

但是用 Stream 却很简单。假设源列表为 [a, b, c]，那么设 prefix 为 [a], [a, b], [a, b, c]，suffix 为 [a, b, c], [b, c], [c]。这样，子列表就变成了 prefix 的 suffix 再加上一个空列表：

// Returns a stream of all the sublists of its input list  
public class SubLists {  
    public static <E> Stream<List<E>> of(List<E> list) {  
        return Stream.concat(Stream.of(Collections.emptyList()),  
                             prefixes(list).flatMap(SubLists::suffixes));  
    }  
    private static <E> Stream<List<E>> prefixes(List<E> list) {  
        return IntStream.rangeClosed(1, list.size())  
            .mapToObj(end -> list.subList(0, end));  
    }  
         
    private static <E> Stream<List<E>> suffixes(List<E> list) {  
        return IntStream.range(0, list.size())  
            .mapToObj(start -> list.subList(start, list.size()));  
    }   
}

这段代码的实现本质上和 for-each 类似：

for (int start = 0; start < src.size(); start++)  
    for (int end = start + 1; end <= src.size(); end++)  
        System.out.println(src.subList(start, end));

这个 for 循环也可以直接翻译成一个 Stream。这样得到的结果比前一个 Stream 实现更加简洁，但是可读性稍微差了一点。 它本质上与第 45 条中笛卡尔积的 Stream 代码相类似 :

// Returns a stream of all the sublists of its input list  
public static <E> Stream<List<E>> of(List<E> list) {  
    return IntStream.range(0, list.size())  
        .mapToObj(start ->  
            IntStream.rangeClosed(start + 1, list.size())  
            .mapToObj(end -> list.subList(start, end)))  
        .flatMap(x -> x);  
}

这两个 Stream 的实现都很好，但用户要想适用迭代就必须要适用适配器，这就会明显影响性能。还有，如果实现了定制 Collection，这会很麻烦但性能也会明显提高。

总结：如果可以返回集合，就返回集合。如果集合中已经有元素（TODO：这句看不懂）或者序列中的元素数量很少，那就返回一个标准的集合，否则可以考虑定制的集合。如果无法返回集合，就返回 Stream 或者 Iterable，或者返回两个。如果将来 Stream 实现了 Iterable 接口，那就可以放心的返回 Stream 了。

## 48. 谨慎使用 Stream 并行

### 错误使用 Stream 并行

全性和活性失败（liveness failure）是并发编程中需要面对的问题， Stream pipeline 并行也不例外。

下面是第 45 条中的程序：

// Stream-based program to generate the first 20 Mersenne primes  
   public static void main(String[] args) {  
       primes().map(p -> TWO.pow(p.intValueExact()).subtract(ONE))  
           .filter(mersenne -> mersenne.isProbablePrime(50))  
           .limit(20)  
           .forEach(System.out::println);  
}  
   static Stream<BigInteger> primes() {  
       return Stream.iterate(TWO, BigInteger::nextProbablePrime);  
}

在 pipeline 中添加 `paralle()` 后，不仅可能会慢一点点，而且很可能会根本不打印出任何内容，并持续有着极高的 CPU 使用率（liveness failure）。

> 这段程序并行的最后虽然可能打印出正确答案，但并不是按升序的，必须使用 `forEachOrdered` 来代替 `forEach`。

如果源头是来自 `Stream.iterate`，或者使用了 `limit` 这个中间操作，那么并行 pipeline 是不会提升性能的。处理 limit 的默认并行策略是认为**「每个线程多处理一部分额外的元素，并放弃不需要的结果」是不影响性能的**。在此例中，每查找一个梅森素数的时间大概是上一个梅森素数查找时间的两倍。换句话说，计算额外一个元素的时间近似相等于计算之前所有元素的时间总和。

### 适合 Stream 并行的数据结构

要想通过 Stream 并行来获得最好的效果，应该通过 `ArrayList` `HashMap` `HashSet` `ConcurrentHashMap` 实例；数组；int range 和 long range。这些数据结构都有下面两个优点：

-   它们都可以准确且轻松地被分割成任何大小的子范围，这样可以使得并行线程分工更简单。Stream 类库用来执行这个任务的抽象是分割迭代器（`spliterator`），它是由 Stream 和 Iterable 中的 `spliterator` 方法返回的。
    
-   它们在进行顺序处理时它们提供了优异的引用局部性（locality of reference）：顺序的元素引用一起保存在内存中（注意上面没有说 `LinkedList` 等内部元素引用内存不连续的数据结构）。但是这些引用所指的对象在内存中可能并不接近，这就影响了引用的局部性 。**引用局部性对于并行批处理来说至关重要**：没有它，有些线程可能会花费很多时间等待数据从内存转移到处理器的缓存。**具有最佳引用局部性的数据结构是基本类型数组**，因为数据本身是相邻地保存在内存中的 。
    

### Stream pipeline 的终止操作

如果整个 pipeline 中有大量工作在终止操作中完成，并且这个操作是固定的顺序，那么并行 pipeline 的效率就会受到限制（我理解的：终止操作是汇集所有并发线程结果的单线程任务）。并行的最佳终止操作是做减法（reduction），用一个 Stream 的 `reduce` 方法，或者内置的像 `max`、`min`、`count` 和 `sum` 等方法，将所有从 pipeline 产生的元素都合并在一起。骤死式操作（short-circuiting operation）如 `anyMatch`、`allMatch` 和 `noneMatch` 也都可以并行。由 Stream 的 collect 方法执行的操作都是可变的减法（mutable reduction）不适合并行，因为合并集合的成本非常高。

### 再议 Stream 并行风险

如果自己编写 Stream、Iterable 或者 Collection 的实现，并且想要有良好的并发效率，就必须重写 `spliterator` 方法，并**需要进行大量结果 Stream 的性能测试**。但编写高质量的 `spliterator` 过于困难。

并行 Stream 不仅可能会导致性能差，还包括活性失败，而且还可能导致错误的结果和不可预测的行为（安全性失败 safety failures）。安全性失败可能是因为并行的 pipeline 使用了 mapper、filter 或者程序员编写的函数对象，但没有去遵守它们的规范。Stream 规范对这些函数对象有着严格要求。例如，传到 Stream reduce 操作的 accumulaotr 函数和 combiner 函数，必须是有关联、互不干扰和无状态的 。 如果不满足这些条件（在第 46 条中提到了一些），但是按顺序运行 pipeline，可能会得到正确的结果；如果并发运行，则很可能会失败。

即使使用了一个可以高效分割的源 Stream，一个可并行的或者简单的终止操作， 以及互不干扰的函数对象，除非 pipeline 完成了足够的实际工作来抵消与并行相关的成本，不然也无法从并行中获得提速 。 据不完全估计，Stream 中的元素数乘以每个元素所执行的代码行数，应该至少有十万行。

尽量不要并行 Stream pipeline，除非有充分的理由来保证正确和可以提升效率，并且要经过大量的测试。

### 其他有效的 Stream 并行例子

// Prime-counting stream pipeline - benefits from parallelization  
static long pi(long n) {  
    return LongStream.rangeClosed(2, n)  
        .mapToObj(BigInteger::valueOf)  
        .filter(i -> i.isProbablePrime(50))  
        .count();  
}

// Prime-counting stream pipeline - parallel version  
static long pi(long n) {  
    return LongStream.rangeClosed(2, n)  
        .parallel()  
        .mapToObj(BigInteger::valueOf)  
        .filter(i -> i.isProbablePrime(50))  
        .count();  
}

这两个版本在作者的电脑上分别执行了 31 秒 和 9.2 秒。

根据上文，这里并行起效果的原因是，每个 pipeline 都不会相互干扰，并且都做了大量工作，终止操作只是统计个数。

如果要并行一个随机数 Stream，最好使用 `SplittableRandom` 而不是 `ThreadLocalRandom` 或是已经过时的 `Random`。`SplittableRandom` 就是为此设计的，有着线性提速的可能。而 `ThreadLocalRandom` 是为单线程使用而设计的，它可以适应自己作为一个并行的 Stream 源，但不会像`SplittableRandom` 那样快。Random 会在每个操作上都进行同步，因此会严重影响并发性能。

# 七. 方法设计

## 49. 检查参数的有效性

如果没检查参数，那么可能在处理的时候失败，或者产生费解的异常，或者返回错误的计算结果，甚至可能悄悄破坏某个对象的状态，并在将来引起错误。没有验证参数的有效性，可能会违背**失败原子性（failure atomicity）**，详见第 76 条。

### public & protected

public 和 protected 方法，要使用 Javadoc 的 `@throw` 标签（tag）在文档中说明违反参数值限制时会抛出的异常（详见第 74 条），通常为 `IllegalArgumentException`、`IndexOutOfBoundsException` 或 `NullPointerException` （详见第 72 条）。下面是个例子：

/**  
* Returns a BigInteger whose value is (this mod m). This method  
* differs from the remainder method in that it always returns a   
* non-negative BigInteger.  
*  
* @param m the modulus, which must be positive  
* @return this mod m  
* @throws ArithmeticException if m is less than or equal to 0 */  
public BigInteger mod(BigInteger m) {   
    if (m.signum() <= 0)  
        throw new ArithmeticException("Modulus <= 0: " + m);  
    ... // Do the computation  
}

上面的 doc 并没有说 mod 方法会返回 NPE，虽然在调用 m.signum 时会发生。但这个异常已经在方法所属的 BigInteger 类上注释了，而类级别的注释适用于类 public 方法的所有参数。这样就可以避免在每个方法上都注释了。这可以和 `Nullable` 或其他注解结合使用，来提醒某个特定的参数可能会空。

Java 7 新增的 `Objects.requireNonNull` 方法十分灵活和方便，所以没必要手动空值检查了。还可以在参数中定制异常信息。

this.strategy = Objects.requireNonNull(strategy, "strategy");

Java 9 在 `Objects` 类新增了三个范围检查的方法：`checkFromIndexSize`、`checkFromToIndex` 和 `checkIndex`。这几个方法不能定制异常信息，只能用于 list 和 array 索引，并且不能处理左闭右闭的情况。

### unexported

对于不导出（unexported）方法（TODO：private & default？），包作者可以控制这些方法被调用的情况，所以应该保证只能传入合法参数。因此，非公共（nonpublic）方法可以用断言（assertion）来判断这些参数：

// Private helper function for a recursive sort  
private static void sort(long a[], int offset, int length) {  
	assert a != null;  
	assert offset >= 0 && offset <= a.length;  
	assert length >= 0 && length <= a.length - offset;   
    ... // Do the computation  
}

本质上，断言是用来声明这些条件是 true，不用去管所在的包如何被客户端调用（因为它们是不导出的方法）。和一般合法性检查不一样，断言在失败时会抛出 `AssertionError`；断言没有影响并且没有成本，除非添加 JVM 参数 -ea（或者 -enableassertions）。

### 特殊参数

一定要注意检查**没有被当前方法使用，但会被储存并在之后使用的参数**。101 页的静态工厂方法接收一个 int array，然后将这个 array 转为 List 并返回。假设客户端传入了参数 null，并且这个静态工厂方法没有进行非空校验，那么返回给客户端的 List 一经调用就会抛出 NPE。

构造器是一个典型情况。不仅要检查上述参数，还要避免构造出违反类不变式（invariants）（或约束条件？）的对象。

### 例外

并不总是要在方法计算前检查参数，一个重要的例外是，参数合法性校验代价大或者不合法的情况是不现实，并且在方法内部计算过程中已经隐式检查过了。比如 Collections.sort(List) 方法，list 中的元素都必须实现了 Comparable 接口，否则某两个对象比较过程中会抛出 `ClassCastException`。因此提前检查 list 里的元素都实现 Comparable 代价很大并且没有多大意义。

但也要注意，不加区分的依赖这种隐式参数检查会导致丢失失败原子性（failure atomicity）。

有时候隐式参数检查失败后，会抛出一个非预期、没有记录在注释中的异常。这种情况下，应该使用第 73 条讲述的异常转换（exception translation）方法，将这个异常转换为正确的异常。

### 总结

并不是对参数的任何限制都是好事，相反，应该设计尽可能通用且符合实际需要的方法。假设方法对于它接收的所有参数都能返回合理的结果，那么参数的限制就越少越好。但是通常情况下，有些限制对于被实现的抽象来说是固有的。

每次编写方法或者构造器的时候，都应该考虑参数要有哪些限制，并且把这些限制写进文档、在方法体开头进行显式检查。

## 50. 必要时进行保护性拷贝

### 为什么要进行保护性（defensive）拷贝

没有对象的帮助，另一个类不可能修改对象的内部状态，但是对象很容易在无意识的情况下提供这种帮助。假设需要实现一个 immutable 类 Period：

// Broken "immutable" time period class  
public final class Period {  
    private final Date start;  
    private final Date end;  
    /**  
    * @param start the beginning of the period  
    * @param end the end of the period; must not precede start   
    * @throws IllegalArgumentException if start is after end  
    * @throws NullPointerException if start or end is null  
    */  
    public Period(Date start, Date end) {  
        if (start.compareTo(end) > 0)  
            throw new IllegalArgumentException(  
            start + " after " + end);  
        this.start = start;  
        this.end   = end;  
    }  
    public Date start() {  
        return start;  
    }  
    public Date end() {  
        return end;  
    }  
    ...  // Remainder omitted  
}

第一眼可能会觉得这个类可以实现 immutable，并且有 start 在 end 之前的限制。但是因为 Date 类本身是 mutable，所以很容易**违反这个类的约束**：

// Attack the internals of a Period instance  
Date start = new Date();  
Date end = new Date();  
Period p = new Period(start, end);   
end.setYear(78); // Modifies internals of p!

Java 8 中可以通过使用 `Instant`（或 `LocalDateTime`、`ZonedDateTIme`）代替 Date 来解决这个问题，因为 `Instant` 和其他 `java.time` 包下的类都是 immutable（第 17 条）。而 Date 已经过时了，且不应该再使用了。但是 API 和内部表达式中总会需要使用一些 mutable 值类型。

### Immutable 类需要进行防御性拷贝

#### 在构造方法中进行保护性拷贝

首先该构造器中的 mutable 参数进行保护性拷贝，这样就能避免上面的攻击：

// Repaired constructor - makes defensive copies of parameters  
public Period(Date start, Date end) {  
    this.start = new Date(start.getTime());  
    this.end   = new Date(end.getTime());  
    if (this.start.compareTo(this.end) > 0)  
        throw new IllegalArgumentException(  
        this.start + " after " + this.end);  
}

注意到：保护性拷贝发生在参数检查（第 49 条）之前，并且参数检查进行在拷贝后的参数上。这看起来不正常，这是为了避免这样的情况：参数通过了校验之后被另一个线程修改为非法的，然后被拷贝进类中。这被称作 Time-Of-Check/Time-Of-Use 或者 TOCTOU 攻击。

##### 在构造器中，对于不可信的可被继承类参数不要使用 clone 方法

并且上面代码，并没有使用 Date 类的 `clone` 方法来实现保护性拷贝。因为 Date 类不是 final 的，`clone` 方法并不能保证返回 java.util.Date 类对象，甚至可能返回一个专门出于恶意目的设计的不可信子类的实例。例如，这些子类可以在创建每个对象的时候，都把这个对象引用记录到 private static 列表中，使得攻击者可以控制所有实例。

#### 访问方法使用防御性拷贝

Period 实例依然可能被攻击：

// Second attack on the internals of a Period instance  
Date start = new Date();  
Date end = new Date();  
Period p = new Period(start, end);   
p.end().setYear(78); // Modifies internals of p!

通过修改访问方法来防御第二种攻击：

// Repaired accessors - make defensive copies of internal fields  
public Date start() {  
    return new Date(start.getTime());  
}  
public Date end() {  
    return new Date(end.getTime());  
}

现在，Period 类是真正的 immutable 了，并且 start 会永远在 end 之前，因为此时没有任何类可以接触到 Period 的 mutable 属性，这些属性完全被对象封装起来了。

##### 在访问方法中，可以使用 clone 方法

这和构造器不同，因为此时的属性是在构造器中通过防御性拷贝生成的，我们能控制它到底是什么类，比如此例中，我们知道 start 一定是一个 java.util.Date 类对象。这说明了，最好使用构造器和静态工厂来复制对象，原因在第 13 条。

### 不止是 Immutable 类需要防御性拷贝

在任何时候，方法或者构造器在**内部数据结构**中存储了一个引用，指向客户端提供的对象。如果这个客户端提供的对象是 mutable，并且方法或者构造器所在的类不能应对这个对象进入数据结构之后发生的变化，那么就必须要对这个对象进行保护性拷贝，让拷贝后的对象进入数据结构中。例如，使用客户端的对象作为内部 Set 或者 Map 的 key，如果这个对象插入 Set 或者 Map 之后发生改变，那么 Set 或者 Map 的约束条件就可能会遭到破坏。

> 比如 Map 的 Key 是客户端提供的 Person，如果 Person 的 name 相同，则 equals 返回 true。这样可能两个 name 不同的 Person 都能进入 Map，但其中一个 Person 的 name 被修改成另一个 Person 的 name，这时候 Map 就存储了两个相同的 key。

### 返回内部 mutable 组件时可能需要防御性拷贝

当返回内部 mutable 组件给客户端之前，无论这个类是否是 immutable，都要考虑是否要对这个 mutable 组件做防御性拷贝。例如针对数组，只要它的长度非零，那么它就总是 mutable。在返回内部数组时，一定要进行保护性拷贝，或者返回该数组的 immutable view（这两种方法详见第 15 条）。

### 例外情况

1.  如果类信任调用它的客户端不会修改内部组件（可能因为它们是同一个包下的），可以不采用保护性拷贝。这种情况下，类的文档必须说清楚调用者必须不能修改受到影响的参数和返回值；
    
2.  不在同一个包下也有可能出现例外情况。有一些方法和构造器，可能会接收客户端传来的对象，并要获得这个对象的控制权。这种方法和构造器必须在文档中清楚说明，客户端必须保证不会在以后修改所传的参数（形式上有点类似 18 条的包装者模式）。
    

### 总结

1.  尽可能在类中使用 immutable 对象来作为组件，如用 Instant 代替 Date，或者用 Date.getTime() 返回的 long 来做为组件。
    
2.  如果类包含从客户端传来或返回给客户端的 mutable 对象，一定要进行保护性拷贝。只有在考虑到性能、客户端可信、有明确文档说明的情况下，才可以不用保护性拷贝。
    

## 51. 谨慎设计方法签名

本条目是若干 API 设计技巧的总结。

### 谨慎选择方法名

命名要始终遵守标准命名习惯（详见第 68 条）。首先命名要易于理解，且和同一个包中的其他命名风格一致。其次要符合广泛共识。尽量避免长命名。

如果还有疑问的话，可以去参考 Java 类库中的 API。

### 不要过于追求提供便利的方法

每个方法都应该尽其所能。方法太多会使类难以理解、使用、文档化、测试和维护。这对接口来说更是如此，太多的方法会让实现者和使用者都十分费解。对于你的类或接口所支持的每个行为，都提供一个功能齐全的方法。只有在经常使用的情况下才考虑提供一个 "速记（shorthand）"，但如果有疑问的话，就不要提供。

> 功能齐全的方法和速记应该是这样吧：前者是参数很多的方法，而后者是参数很少的方法，但内部调用前者并为缺少的参数提供默认值。

### 避免过长的参数列表

四个参数或者更少是最好的。如果你的许多 API 参数都过长，用户记不了这么多就会不停去查看文档。

**而相同类型的长参数列表尤其有害。**用户不仅可能会记不清参数顺序，从而导致弄错参数顺序但程序依然通过了编译。

解决办法有 种：

1.  将长参数方法拆分成多个方法，每个方法需要之前方法参数的一个子集。但这样可能会导致方法过多。方法过多的问题可以通过提升方法的正交性（orthogonality）来解决。
    
    > 提升方法正交性：如 java.util.List，并没有提供「在某个子列表（sublist）中查找某个元素第一次或最后一次出现的位置」的方法，这两个的方法都会需要三个参数。List 提供了 `subList` 方法返回子列表的视图（view），可以配合 `indexOf` 和 `lastIndexOf` 来实现上述需求，这两个方法只需要一个参数。而且子列表还可以和其他 List 操作结合，这样的 API 就会有很高的功能-权重（power-to- weight）比。
    
2.  如果方法的一些参数可以代表一个类，可以创建辅助类或使用现有的类来代替一连串参数。
    
3.  第三种方法结合前两种的优点：从**构造对象到执行方法**，都使用 Builder 模式（详见第 2 条）。
    

### 参数类型最好是接口而不是类

详见第 64 条。

### 最好使用两元素枚举类型而不是 Boolean

除非方法名中可以清楚的了解到这个 boolean 的意义。

枚举会使代码更好编写和阅读，并且它们在以后可以很容易地拓展其他选择。

例如有个使用静态工厂创建的 Thermometer 类：

// 1. boolean 参数  
Thermometer.newInstance(true);  
  
// 2. 两元素枚举  
public enum TemperatureScale { FAHRENHEIT, CELSIUS }  
Thermometer.newInstance(TemperatureScale.CELSIUS)

上例使用枚举，在以后还可以添加更多信息，如给每个枚举添加摄氏度范围等、将摄氏度转为华氏度等。

## 52. 慎用重载

### 反面例子

public class CollectionClassifier {  
    public static String classify(Set<?> s) {  
        return "Set";  
    }  
    public static String classify(List<?> lst) {  
        return "List";  
    }  
    public static String classify(Collection<?> c) {  
        return "Unknown Collection";  
    }  
       
    public static void main(String[] args) {  
        Collection<?>[] collections = {  
            new HashSet<String>(),  
            new ArrayList<BigInteger>(),  
            new HashMap<String, String>().values()  
        };  
        for (Collection<?> c : collections)  
            System.out.println(classify(c));  
    }   
}

程序会输出三个 “Unknown Collection“。

因为三次循环中，classify 的参数 `c` 在编译期间类型都是 `Collection<?>`，运行时类型每个 `c` 都不同。而调用哪个重载方法是在编译期间根据参数编译期间类型确定的，所以三次循环都调用了第三个方法。（因为 collections 数组的类型是 Collection，具体类型在运行期才知道）

> 而覆盖不同，覆盖方法是在运行时根据方法所在对象的运行时类型来动态选择的。

最好的方法是下面这样：

public static String classify(Collection<?> c) {  
    return c instanceof Set  ? "Set" :  
	       c instanceof List ? "List" : "Unknown Collection";  
}

### 安全保守的做法

1.  永远不要导出两个参数数量相同的方法；
    
2.  如果方法使用可变参数，不要重载它（除了第 53 条描述的情形外）；
    

如果上面两条做不到，可以新建一个名字不同的方法。例如 `ObjectOutputStream` 类，它并没有采用为 primitive 类型和 reference 类型都重载一个 `write` 方法，而是为每种类型单独编写一个方法，如 `writeBoolean`、`writeInt` 等。并且 `ObjectInputStream` 还提供了对应的 `read` 方法。

### 构造器

同一个类的多个构造器必然是重载的。如第 1 条所说，很多情况下可以导出静态工厂而不是构造器。

当导出了相同参数数目的构造器时要尤其注意，使用下面一小节的方法。

### 当重载方法参数数量相同时

如果必须要这样，那么每一对重载方法都必须至少有一个位置相同的参数的类型完全不同。如果两个类都不是对方的子类，那么这两个类就是不同的。为了保证这点，要注意自动装箱、Lambda 和数组。

#### 自动装箱

在 Java 5 之前，所有 primitive 类型都不同于所有的引用类型，但之后出现自动装箱：

public class SetList {  
    public static void main(String[] args) {  
        Set<Integer> set = new TreeSet<>();  
        List<Integer> list = new ArrayList<>();  
        for (int i = -3; i < 3; i++) {  
            set.add(i);  
            list.add(i);  
        }  
        for (int i = 0; i < 3; i++) {  
            set.remove(i);  
            list.remove(i);  
        }  
        System.out.println(set + " " + list);  
    }  
}

期望的结果是在 set 和 list 中删除非负数，并输出 [-3, -2, -1] [-3, -2, -1]，但实际上输出 [-3, -2, -1] [-2, 0, 2]。

`set.remove(i)` 调用重载方法 `remove(E)`，这里的 E 是 （Integer）Set 的元素类型，将 i 从 int 自动装箱到 Integer，因此程序能正常执行。

而 `list.remove(i)` 调用选择重载方法 `remove(int i)`，删除 list 指定位置的元素。为了使能输出期望结果，必须 `list.remove((Integer) i)` 或 `list.remove(Integer.valueOf(i))`。

> 因为 List<E> 接口有两个重载的 remove 方法：remove(E) 和 remove(int)。当它在 Java 5 发行版本中被泛型化之前，List 接口有一个 remove(Object) 而不是 remove(E)，而 Object 和 int 根本不同。但是自从有了泛型和自动装箱之后，这两种参数类型就不再根本不同了。 Java语言中添加了泛型和自动装箱之后，破坏了 List 接口。

#### Lambda

TODO：看不懂，242页，The addition of lambdas ... switch -Xlint:overloads.。

#### 数组

1.  数组类型和 Object 类以外的所有类都不同；
    
2.  数组类型和 Serializable、Clonable 接口以外的所有接口都不同。
    

#### 可以违反的情况

在更新现有类的时候，很可能会违反要「参数类型完全不同」的规则。

如 Java4 以来，String 类一直有个 contentEquals(String buffer) 方法。Java 5 新增了一个 `CharSequence` 接口，用来为 StringBuilder、StringBuffer、String、CharBuffer 等提供公共接口。同时，也重载了 contentEquals 方法，即 contetnEquals(CharSequence)。

虽然，这违反了本条原则，但是只要当这两个重载方法在同样的参数上被调用时，它们执行的是相同的功能，重载就不会带来危害。 程序员可能并不知道哪个重载函数会被调用，但只要这两个方法返回相同的结果就行。确保这种行为的标准做法是，让更具体化的重载方法把调用转发给更一般化的重载方法：

// Ensuring that 2 methods have identical behavior by forwarding  
public boolean contentEquals(StringBuffer sb) {  
    return contentEquals((CharSequence) sb);  
}

> 但 Java 类库也有很多类真正的违反了本条目的规则。比如 String 类导出两个重载的静态工厂方法：valueOf(char []) 和 valueOf(Object)，它们两个被传递同样的对象引用时做了完全不同的事（TODO：同样的对象引用是什么意思？）。

### 总结

-   重载方法的选择是在编译期根据编译类型选择的；
    
-   重载方法时：
    
    -   不要重载出两个参数数目相同的方法和构造器；
        
        -   如果方法或构造器参数数目相同，就要保证至少一对相同位置的参数类型不同；
            
            -   如果还是做不到，就应该保证传递同样参数时，所有重载方法的行为必须一致；
                
    -   如果方法使用可变参数，不要重载它（除了第 53 条描述的情形外）；
        
    -   如果上面两条都做不到，可以考虑给方法一个新命名。
        

## 53. 慎用可变参数

### 介绍

可变参数（varargs）方法一般被称作 variable arity methods（可匹配不同长度变量的方法），它接受零个活多个指定类型的参数。可变参数机制首先会创建一个数组，数组的大小为在调用位置所传递的参数数量，然后将参数值传到数组中，最后将数组传递给方法。

Varargs 是为 printf（和可变参数一起被添加到 Java 中）和核心反射机制（详见第 65 条）设计的，它们都从 varargs 中受益很多。

### 正确使用

假设有下面的方法：

// Simple use of varargs  
static int sum(int... args) {  
    int sum = 0;  
    for (int arg : args)  
        sum += arg;  
    return sum;   
}

这种方法的可变参数可以为零个或者多个，但有时候会希望可变参数至少为一个：

// The WRONG way to use varargs to pass one or more arguments!  
static int min(int... args) {  
    if (args.length == 0)  
        throw new IllegalArgumentException("Too few arguments");   
    int min = args[0];  
    for (int i = 1; i < args.length; i++)  
        if (args[i] < min)  
            min = args[i];  
    return min;   
}

上面的代码有两个问题：

1.  客户端在调用这个方法的时候，很可能因为没有传参数而导致运行时异常，而更好的方法是编译失败。
    
2.  上面的代码通过显式判断 args 长度来进行合法性校验，很不美观。或者将 min 初始化为 Integer.MIN_VALUE，同样也很不美观。
    

正确的方法应该是：

// The right way to use varargs to pass one or more arguments  
static int min(int firstArg, int... remainingArgs) {  
    int min = firstArg;  
    for (int arg : remainingArgs)  
        if (arg < min)  
            min = arg;  
    return min;   
}

### 性能问题

在重视性能的情况下，使用可变参数机制要十分小心，因为每次调用可变参数方法都会导致一次数组初始化和分配。假设确定对某个方法 95% 的调用会有 3 个或者更少的参数，就声明该方法的 5 个重载，每个重载方法带有 0 至 3 个普通参数，当参数的数目超过 3 个时，就使用一个可变参数方法：

public void foo() { }  
public void foo(int a1) { }  
public void foo(int a1, int a2) { }  
public void foo(int a1, int a2, int a3) { }  
public void foo(int a1, int a2, int a3, int... rest) { }

此时，只有 5% 的情况下，才需要可变参数机制。

> `EnumSet` 类对它的静态工厂使用了这种方法，最大限度地减少创建枚举集合的成本。当时这么做是有必要的，因为枚举集合为位域（bit fields）提供了在性能方面有竞争力的替代方法（详见第 36条）。

### 总结

简而言之，在定义参数数目不定的方法时，可变参数方法是一种很方便的方式。在使用可变参数之前，要先包含所有必要的参数，并且要关注使用可变参数所带来的性能影响。

## 54. 返回空数组或集合，而不是 null

### 返回 null 的危害

下面的代码是很常见的：

public List<Cheese> getCheeses() {  
       return cheesesInStock.isEmpty() ? null : new ArrayList<>(cheesesInStock);  
}

把没有奶酷可买的情况当作是一种特例，这是不合常理的。这样做会要求客户端中必须有额外的代码来处理 null 返回值，如果忘记了，可能很久之后才会发生错误。

### 为什么要返回空数组或者集合

可能有人会认为分配长度为 0 的数组或者集合会带来额外的开销，所以应该返回 null，但这站不住脚，原因有下面两点。

-   在这种级别的上并不应该担心性能，除非可以分析出来这个分配是导致性能问题的原因（详见第 67 条）。
    
-   可以通过不分配空数组或者集合来返回它们，典型用法如下：
    
     //The right way to return a possibly empty collection  
    public List<Cheese> getCheeses() {  
           return new ArrayList<>(cheesesInStock);  
    }  
      
    //The right way to return a possibly empty array  
    public Cheese[] getCheeses() {  
        return cheesesInStock.toArray(new Cheese[0]);  
    }
    
    > TODO：什么叫不分配返回？而且上面两种代码的方式，在内部实现上和下面要讲的重复返回同一个空集合或数组时一样的。但有两点区别：
    > 
    > 1.  集合。
    >     
    >     -   上面的没做 cheesesInStock 非空判断，在 ArrayList 构造方法中会判断，如果为空，初始化内部数组为空。但此时返回的空 ArrayList 仍是可变对象；
    >         
    >     -   下面的代码判断 cheesesInStock 为空后直接返回了不可变空集合。
    >         
    > 2.  数组。
    >     
    >     -   上面没做非空判断，每次都传入一个新的空数组，在 toArray 内部将这个空数组扩容至合适大小，或者原样返回；
    >         
    >     -   下面每次都传入同样的空数组。
    >         
    >     -   注意，空数组永远是不可变对象，所以这两种方式都返回了不可变空数组。
    >         
    

### 性能提升

如果真的证明返回空集合或者数组降低了程序性能，可以用下面两种做法来优化（在使用后要再次测量性能，以确保真的能提升性能）：

-   可以重复返回同一个不可变的空集合，因为不可变对象可以被自由共享（详见第 17 条）。常见方法有：`Collections.emptyList()`、`Collections.emptySet()`、`Collections.emptyMap()` 等，这些方法都返回了不可变对象，在用户尝试添加的元素的时候会抛出异常。自己实现的时候要注意不可变性，否则重复返回的对象将可能不再是空集合。
    
    // Optimization - avoids allocating empty collections  
    public List<Cheese> getCheeses() {  
        return cheesesInStock.isEmpty() ? Collections.emptyList()  
            : new ArrayList<>(cheesesInStock);  
    }
    
-   可以重复返回同一个零长度的数组，因为**所有零长度的数组都是不可变的**：
    
    // Optimization - avoids allocating empty arrays  
    private static final Cheese[] EMPTY_CHEESE_ARRAY = new Cheese[0];  
    public Cheese[] getCheeses() {  
        return cheesesInStock.toArray(EMPTY_CHEESE_ARRAY);  
    }
    
    将同一个零长度的数组传进了每一次的 `toArray` 调用，每当 cheesesInStock 为空时，就会从 getCheese 返回这个数组。
    
    > 看一下 ArrayList 的 toArray 源码：
    > 
    > public <T> T[] toArray(T[] a) {  
    >  if (a.length < size)  
    >      // Make a new array of a's runtime type, but my contents:  
    >      return (T[]) Arrays.copyOf(elementData, size, a.getClass());  
    >  System.arraycopy(elementData, 0, a, 0, size);  
    >  if (a.length > size)  
    >      a[size] = null;  
    >  return a;  
    > }
    > 
    > 如果 cheesesInStock 为空时，最终会直接返回 a。
    
    千万不要指望通过预先分配传入 toArray 的数组（指的是初始化数组的长度）来提升性能，这样只会适得其反：
    
    // Don’t do this - preallocating the array harms performance!  
    return cheesesInStock.toArray(new Cheese[cheesesInStock.size()]);
    
    ### 总结
    
    在可以返回空数组或集合的时候，永远不要返回 null。
    

## 55. 谨慎返回 optional

### 介绍

Java 8 之前，要编写一个在特定环境下无法返回任何值的方法时，有两种方法：要么抛出异常，要么返回 null（假设返回类型是一个对象引用类型）。但这都不是好办法。异常应该为异常条件保留（详见第 69 条），并且抛出异常是很昂贵的，因为要捕捉整个 stack trace。返回 null 没有这些缺点，但是客户端必须对可能的 null 值作特殊处理，否则可能会引发 NPE。

从 Java 8 开始，有了一种新的方式来编写可能不会有返回值的方法。`Optional<T>` 类代表了一个 immutable 容器，它可以存放一个非 null 的 T 引用或者什么都没有。不包含任何内容的 optional 被称为 empty，包含一个值（称为 value is present）的 optional 被称为 not empty。一个 optional 本质是一个最多保护一个元素的 immutable 集合。`Optional<T>` 虽然没有实现 `Collection<T>`，但原则上是可以的。

当一个方法，可以返回一个 T，但是在某些情况下不能返回，这时候可以用 `Optional<T>` 来作为该方法的返回值。这可以让方法返回一个 empty result 来表明当前不能返回一个 valid result。这种方式比抛异常更灵活且使用简单，比返回 null 更不容易出错。

### 用法

在第 30 条中，有一个计算集合中最大元素的方法：

// Returns maximum value in collection - throws exception if empty  
public static <E extends Comparable<E>> E max(Collection<E> c) {   
    if (c.isEmpty())  
        throw new IllegalArgumentException("Empty collection");  
    E result = null;  
    for (E e : c)  
        if (result == null || e.compareTo(result) > 0)  
            result = Objects.requireNonNull(e);  
    return result;  
  
}

可以修改为：

// Returns maximum value in collection as an Optional<E>  
public static <E extends Comparable<E>> Optional<E> max(Collection<E> c) {  
    if (c.isEmpty())  
        return Optional.empty();  
    E result = null;  
    for (E e : c)  
        if (result == null || e.compareTo(result) > 0)  
            result = Objects.requireNonNull(e);  
    return Optional.of(result);   
}

> 不要传 null 给 Option.of(value)，会抛出 NPE，可以用 Option.ofNullable(value)。

许多 Stream 的终止操作都返回 optional，可以将 max 方法用 Stream 重写：

// Returns max val in collection as Optional<E> - uses stream  
public static <E extends Comparable<E>> Optional<E> max(Collection<E> c) {  
    return c.stream().max(Comparator.naturalOrder());  
}

### 何时该用 optional 代替抛异常或返回 null

Optional 本质上和 checked exceptions 类似，它强迫 API 的用户要去处理可能没有返回值的情况。但是抛出 unchecked exceptions 或返回 null 可能会让用户忽略了这个可能发生的事情。但是抛出 checked exceptions 会需要额外的样板代码。

如果使用了 optional，客户端必须去选择如果方法没有返回值的时候该怎么做。

#### 可以指定默认值

// Using an optional to provide a chosen default value   
String lastWordInLexicon = max(words).orElse("No words...");

#### 可以抛出异常

// Using an optional to throw a chosen exception  
Toy myToy = max(toys).orElseThrow(TemperTantrumException::new);

> 注意这里传入的是一个 exception factory 而不是一个真正的 exception。只有当真正抛出的时候才创建异常，避免了额外的开销。

#### 可以直接获取值

如果可以证明 optional 非空，可以不指定当 optional 为空时的做法，而直接从 optional 获取值。但是如果 optional 真的为空的时候，会抛出 `NoSuchElementException`：

// Using optional when you know there’s a return value   
Element lastNobleGas = max(Elements.NOBLE_GASES).get();

### 一些方法的使用

#### orElse 和 orElseGet

如果觉得通过 `orElse` 方式获取默认值开销大，可以使用 `orElseGet(Supplier<? extends T>)` 方法。但这个方法似乎应该叫做 orElseCompute，因为很接近 Map 中以 compute 开头的三个方法。

> public T orElse(T other) {  
>  return value != null ? value : other;  
> }  
>   
> public T orElseGet(Supplier<? extends T> other) {  
>  return value != null ? value : other.get();  
> }
> 
> `orElse` 和 `orElseGet` 最大的区别在于，前者立即计算，后者是延迟计算。所以如果备选值是无需计算的、现在已有的，那就用 `orElse`。如果值还没得到，那最好用`orElseGet` 延迟执行。一般最多的情况是类似字符串拼装、创建新对象这样的，都应该用 `orElseGet`。假设默认值是一个字符串的拼接，每次调用 `orElse` 都会提前计算拼接后的结果再去判断 optional 是否为 empty。而 `orElseGet` 会先判断 optional 是否为 empty，如果是，再去拼接字符串。

#### 其他方法

Optional 还有一些方法可以处理更特殊的场景：`filter`、`map`、`flatMap`、`ifPresent`，以及 Java 9 新增的 `or` 和 `ifPresentOrElse`。但要注意使用 `ifPresent` 的方法，许多用使用它的代码都可以被其他方法代替，并且效率更高且代码更短且清晰。

下面这段代码打印出了一个进程的父进程 PID，如果没进程则打印出 N/A。代码使用的 ProcessHandle 类是 Java 9 中引进的。

Optional<ProcessHandle> parentProcess = ph.parent();   
System.out.println("Parent PID: " + (parentProcess.isPresent() ?  
		String.valueOf(parentProcess.get().pid()) : "N/A"));

这段代码可以使用 map 来改写：

System.out.println("Parent PID: " +  
		ph.parent().map(h -> String.valueOf(h.pid())).orElse("N/A"));

在 `Stream<Options<T>` 取出所有 nonempty optionals 中的元素来组成 `Stream<T>`，在 Java 8 中可以使用下面的方式：

streamOfOptionals  
    .filter(Optional::isPresent)  
    .map(Optional::get)

Java 9 中 Optional 有了一个 `stream()` 方法，来将 Optional 转成一个 Stream，如果 Optional not empty，那么 Stream 包含一个元素，否则为空。配合 Stream 的 flatMap 方法，可以将上面代码改写为：

streamOfOptionals.  
    .flatMap(Optional::stream)

### 不适合使用 Optional 的返回值

optionals 不应该将容器类型如 collections、maps、streams、arrays 和 optionals 等 wrapper 起来。比起返回一个 empty `Optional<List<T>>` ，可以简单返回一个 empty `List<T>` （详见第 54 条）。直接返回空容器会让客户端免于多处理一个 optional。

> `ProcessHandle` 类有一个返回 `Optional<Stirng[]>` 的方法，这是不应该的。

### 何时返回 Optional<T> 而不是 T

一个准则：如果可能无法返回结果并且当没有返回结果时客户端必须执行特殊的处理，那么就应该声明该方法返回 Optional<T>。

返回 Optional<T> 的时候需要额外的成本，因为 Optional 是一个必须分配和初始化的对象，并且从 Optional 中读取值需要额外的开销。这就导致了 Optional 不适合注重性能的场合（确定使用 Optional 的方法是否影响性能，必须经过测试）。

### 不要使用包装装箱类型的 Optional<T>

这样比直接返回 primitive 类型开销大的多，因为这样的话 Optional 会有两层包装。因此，应该使用专门为 primitive 设计的 `OptionalInt`、`OptionalLong` 和 `OptionalDouble`，它们包含了 Optional<T> 中的大部分方法。

> 小的基本类型可以使用 Optional<T> ，比如 Boolean、Byte、Character、Short 和 Float。

### Optional 不应该作为 key、value 和集合或数组里的元素

例如将 Optional 作为 map 的 value，那么就有两种方式来表达一个 key 的 logic absence：

1.  key 不存在 map 中；
    
2.  key 存在 map 中，但映射的 value 是一个 empty optional。
    

### 谨慎选择 Optioanl 作为实例域

有时候使用包含 Optional 域的子类是合理的。（这个「子类」是什么意思）

第 2 条第 NutirionFacts 类包含了许多不是必须需要的域：

1.  不可能给每种域的组合都提供一个子类；
    
2.  有 primitive 域，如果不用上面的办法，也不方便表达这些域的缺失
    

所以 NutritionFacts 的 getter 应该为每个可选的域返回一个 Optional，因此可以直接将这些 Optioanl 作为域保存在对象中（代替以前的可选域）。

### 总结

1.  如果方法有时可能没有返回值，并且需要使用者来考虑没有返回值的情况，那么就应该考虑返回一个 Optional；
    
2.  返回 Optioanl 确实会影响性能，如果真的很严重，可能返回 null 或抛出异常是更好的选择；
    
3.  不要将 Optional 用作返回值以外的用途（作为实例域也是为了简化在需要的 getter 方法中创建 Optional）。
    

## 56. 为所有导出的 API 元素编写文档注释

Javadoc 的具体用法在 _How to Write Doc Comments_ web page [Javadoc- guide]，虽然 Java 4 之后就再也没有更新过了，但依然很有价值。Java 5 添加了 {@literal} 和 {@code}；Java 8 添加了 {@implSepc}；Java 9 添加了 {@index}。

为了正确编写 API 文档，应该在每个被导出的类、接口、构造器、方法和域的声明之前增加文档注释。如果类是 serializable，应该注释它的序列化形式。为了代码可维护，还应该为一些没被导出的类、接口、构造器、方法和与域名编写文档注释。

方法的文档注释应该简洁地描述出它和客户端之间的约定。除了专门为继承设计的方法外（详见第 19 条），这个约定应该说明这个方法做了什么，而不是怎样做。文档注释应该列举出方法所有的 preconditions（调用方法前必须满足的条件）和 postconditions（成功调用方法后必须满足的条件）。一般情况下，preconditions 是由针对 unchecked exception 的 `@throws` 标签来隐式描述的，每个 unchecked exception 对应一个 precondition violation（违反前置条件）。也可以在一些受影响的参数的 `@param` 标签上指定 preconditions。

除了 precondition 和 postcondition 外，还应该注明方法的副作用（side effect）。这个副作用是指系统状态中可观测到的变化，但这个变化不是为了实现 postcondition 而明确要求的。比如，如果方法启动了后台线程，，文档注释中就应该说明这一点。

为了完整描述方法的约定，应该在文档注释上为每个参数添加一个 `@param` 标签、为非 void 方法添加一个 `@return` 标签、为方法抛出的每一个 checked or unchecked exception 添加一个 `@throws` 标签。如果 `@return` 标签中的描述和方法描述完全相同，那么就可以省略它（TODO：这个它指方法描述还是 `@return`？）。

按照惯例，`@param` 和 `@return` 标签后的文字应该是一个名词短语，用来描述参数和返回值所代表的值。在极少数情况下，也会用算术表达式来代替这个名词短语，如 `BigInteger`。`@throws` 标签后的文字应该以 “if” 开头的句子，来描述在什么情况下会抛出异常。按照惯例，`@param`、`@return` 和 `@throws` 标签后面的名词短语或子句都不需要以句号结尾。下面有个例子：

/**  
* Returns the element at the specified position in this list.   
*  
* <p>This method is <i>not</i> guaranteed to run in constant  
* time. In some implementations it may run in time proportional   
* to the element position.  
*  
* @param index index of element to return; must be  
* 		 non-negative and less than the size of this list  
* @return the element at the specified position in this list  
* @throws IndexOutOfBoundsException if the index is out of range  
*		  ({@code index < 0 || index >= this.size()})  
*/  
E get(int index);

TODO：这章看的没意思。。

# 八. 通用编程

## 57. 最小化局部变量作用域

最小化局部变量作用域可以提升代码的可读性和可维护性，并且减少了出错的概率。

**最好的办法就是在第一次使用局部变量之前声明它**，如果提前声明很可能会使读者分心，并且等到真正用到的时候，读者可能以及忘了这个变量的类型和初始值。

局部变量的作用域从声明开始，拓展到包围它的代码块结束。过早声明局部变量，会使得它的作用域早开始且晚结束。如果局部变量在它被使用到的代码块之外声明，那么程序退出这个代码块后，它仍然是可见的。这样就可能导致这个变量在目标作用区域之外被不小心使用，从而带来不好的后果。

### try-catch

几乎每个局部变量的声明都需要初始化，如果还不能进行有意义地初始化，就应该推迟声明。try-catch 是一个例外。如果一个变量通过一个可能抛出 checked exception 的表达式或方法初始化，那么这个变量就必须在 try 块里初始化（除非当前的方法可以 propagete 这个 exception）。如果这个变量需要在 try 块外被使用，那么它就要在 try 块前声明，虽然此时它可能还不能被有意义地初始化（可以参照 283 页第 65 条的例子）。

### loop variable

循环提供了一个特殊的方式来最小化变量作用域。传统 for 循环和 for-each 都允许声明 loop variables，这样它们的作用域就被限制在 for 循环里。**因此，如果变量只用在循环里，那么 for 就优于 while。**

遍历集合或数组的首选方式：

// Preferred idiom for iterating over a collection or array  
for (Element e : c) {  
    ... // Do Something with e  
}

如果需要用到 iterator，比如需要调用它的 `remove` 方法，就可以使用传统 for 循环代替 for-each 循环：

// Idiom for iterating when you need the iterator  
for (Iterator<Element> i = c.iterator(); i.hasNext(); ) {  
    Element e = i.next();  
    ... // Do something with e and i  
}

下面这段代码可以证明在上面的情况下，for 比 while 更好：

Iterator<Element> i = c.iterator();  
while (i.hasNext()) {  
    doSomething(i.next());  
}  
...  
Iterator<Element> i2 = c2.iterator(); while (i.hasNext()) { // BUG!  
    doSomethingElse(i2.next());  
}

第一个迭代器 i 在使用完后还是 visiable，所以可能会犯这种错误。这种错误能通过编译，并且在运行时也不会抛出异常。for 循环不会有这种错误，并且在不同的 for 循环中还可以重用 loop variables 的名字。for 循环的另一个优势就是代码更短更可读。

下面是另一种最小化 loop variables 的方式：

for (int i = 0, n = expensiveComputation(); i < n; i++) {  
    ... // Do something with i;  
}

这个 for 循环有两个 loop variable，n 存储了 i 的限制，可以避免每次迭代的重复计算。通常，如果循环测试中涉及方法调用，并且可以保证在每次迭代中都会返回同样的结果，就应该使用这种做法。

### 让方法小而集中

最后一种最小化局部变量作用域的方法就是让**方法小而集中**。 如果把两个操作（activity）合并到同一个方法中，与其中 一个操作相关的局部变量就有可能会出现在执行另一个操作的代码范围之内。为了防止这种情况发生，只需将这个方法分成两个，每个操作用一个方法来完成。

## 58. for-each 优于传统 for

### 单层迭代

#### 传统 for

// Not the best way to iterate over a collection!  
for (Iterator<Element> i = c.iterator(); i.hasNext(); ) {  
    Element e = i.next();  
    ... // Do something with e  
}  
  
// Not the best way to iterate over an array!  
for (int i = 0; i < a.length; i++) {  
    ... // Do something with a[i]  
}  

这两个传统 for 循环虽然优于 while 循环（详见第 57 条），但是不够完美。这两个 for 循环中的迭代器和索引变量都是没用的（clutter），我们需要的只是集合或数组中的元素。第一个循环中迭代器出现了三次，第二循环中索引出现了四次，吸引了不必要的注意且容易发生错误，而编译期间不一定能捕捉到这个错误。

#### for-each

for-each 通过隐藏迭代器或索引变量来解决传统 for 循环可能出现的问题，它也被称作 ehanced for statement。

// The preferred idiom for iterating over collections and arrays  
for (Element e : elements) {  
    ... // Do something with e  
}

":" 的意思是 ”in“。使用 for-each 完全不会影响性能，JVM 为 for-each 生成的代码和手写的一模一样。

### 嵌套迭代

#### 传统 for

下面就是使用 for 循环的一个常见错误：

// Can you spot the bug?  
enum Suit { CLUB, DIAMOND, HEART, SPADE }  
enum Rank { ACE, DEUCE, THREE, FOUR, FIVE, SIX, SEVEN, EIGHT,  
           NINE, TEN, JACK, QUEEN, KING }  
...  
static Collection<Suit> suits = Arrays.asList(Suit.values());  
static Collection<Rank> ranks = Arrays.asList(Rank.values());  
List<Card> deck = new ArrayList<>();  
for (Iterator<Suit> i = suits.iterator(); i.hasNext(); )  
    for (Iterator<Rank> j = ranks.iterator(); j.hasNext(); )  
        deck.add(new Card(i.next(), j.next()));

错误在于外层循环迭代器的 next 方法会在内层循环调用很多次，它应该在外层循环中调用。如果 suits 的大小大于等于，或者内外层都是同一个集合，这样程序就会正常结束（但这仍然是错误的），否则就必然会抛出 `NoSuchElementException`。比如：

// Same bug, different symptom!  
enum Face { ONE, TWO, THREE, FOUR, FIVE, SIX }  
...  
Collection<Face> faces = EnumSet.allOf(Face.class);  
for (Iterator<Face> i = faces.iterator(); i.hasNext(); )  
    for (Iterator<Face> j = faces.iterator(); j.hasNext(); )  
        System.out.println(i.next() + " " + j.next());

这段代码不会抛出异常，而是会输出：

ONE ONE  
TWO TWO  
THREE THREE  
FOUR FOUR  
FIVE FIVE  
SIX SIX

为了修复这个 bug，必须要在外层循环中保存一个外部元素，但这样很不美观：

// Fixed, but ugly - you can do better!  
for (Iterator<Suit> i = suits.iterator(); i.hasNext(); ) {  
    Suit suit = i.next();  
    for (Iterator<Rank> j = ranks.iterator(); j.hasNext(); )  
        deck.add(new Card(suit, j.next()));  
}

#### for-each

for-each 循环在嵌套迭代的时候优势尤其显著。

如果使用 for-each 循环，那么这个问题自然就消失了：

// Preferred idiom for nested iteration on collections and arrays  
for (Suit suit : suits)  
    for (Rank rank : ranks)  
        deck.add(new Card(suit, rank));

### for-each 不能使用的情况

#### Filtering

如果需要遍历**集合**并且删除某些元素，那么就得使用显式的迭代器，并且使用它的 `remove` 方法。

同样，可以使用 `Collection` 接口的 `removeIf` 方法来避免显式遍历。

#### Transforming

如果需要遍历 **list 或数组**并且替换某些元素的值，可以使用 list iterator 或者数组索引的方式。

#### Parallel iteration

如果需要并行地遍历多个集合（这里并行是指同时遍历多个集合，而不是多线程），那么就需要显式控制迭代器或索引变量，以使它们同步移动。

### Iterable

实现了 `Iterable` 接口的对象也可以通过 for-each 遍历。

public interface Iterable<E> {  
    // Returns an iterator over the elements in this iterable  
    Iterator<E> iterator();  
}

如果要编写的类表示一组元素，即使在没有实现 Collection 接口的情况下，也可以去考虑实现 Iterable 接口。

## 59. 了解和使用类库

### 随机数的例子

可能会编写下面的方法来返回 0 到 n 中间的一个随机数：

// Common but deeply flawed!  
static Random rnd = new Random();  
static int random(int n) {  
    return Math.abs(rnd.nextInt()) % n;  
}

这段方法有三个缺陷。

1.  如果 n 是 2 的一个较小次方，产生的随机数序列将会出现短周期性重复；
    
2.  如果 n 不是 2 的次方，那么随机数序列中有些数会比其它数出现的更频繁。如果 n 很大，这个差距会更明显；
    
3.  这个 random 方法在极少数情况下会运行失败，这是因为使用了 `Math.abs` 方法。如果 `nextInt()` 返回了 `Integer.MIN_VALUE`，那么 `Math.abs` 方法也会返回 `Integer.MIN_VALUE`。如果 n 不是 2 的次方，那么和 n 取余后会返回负值。这就可能导致运行错误，并且这个错误很难重现。
    

如果要自己修正上面的错误，需要学习伪随机数生成器、数论、2 的求补算法。但 Java 类库已经提供了这个方法：`Random.nextInt(int)`。

Java 7 之后，就不应该再使用 `Random` 类了，更好的随机数生成器是 `ThreadLocalRandom`。它产生的随机数质量更高且更快。对于 fork join pool（TODO：这是什么？）和并行 Stream，就应该使用 `SplittableRandom`。

### 使用类库的好处

1.  可以充分利用专家的知识和前人的经验；
    
2.  可以使我们不必去为那些与工作不相干的问题提供特别解决方案；
    
3.  类库提供的方法会一直在改善，并且不会影响到我们的代码；
    
4.  类库总是会添加新的方法来满足更多需求；
    
5.  可以使我们的代码主导程序，并且这样的代码更易读、易维护和易重用。
    

### 学习类库

#### 学习新特性

每个重要的版本，类库都会添加许多重要的特性，我们需要保持与这些新特性同步。比如，在 Java 9 之前，要想实现类似 Linux 的 curl 命令的效果是十分枯燥的，但 Java 9 在 `InputStream` 中添加了 `transferTo` 方法：

// Printing the contents of a URL with transferTo, added in Java 9  
public static void main(String[] args) throws IOException {  
    try (InputStream in = new URL(args[0]).openStream()) {  
        in.transferTo(System.out);  
    }  
}

#### 学习基础

类库是十分庞大的，很难全部学习完。但每个程序员都应该去熟悉 `java.lang`、`java.util`、`java.io` 和它们的子包，其他类库可以根据需要学习。

每个程序员都应该会使用 collections framwork 和 streams library（详见 45-48 条），同样还应该会使用 `java.util.concurrent` 中的部分并发工具。这个包既包含了高级的并发工具（详见第 81 82 条）来简化多线程编程，也包含了低级的并发基本类型（并发基本类型的原文是 primitive，在这里不是指基本类型，是指并发编程中和 int、long 等类似的并发基本类型），来让专家编写他们自己更高级别的并发抽象。

### 当标准类库无法满足需要时

编写代码的第一想法是使用标准类库，如果不能满足需要，可以去寻找高质量的第三方类库，如 Google 的 Guava。如果这些类库都没有的时候，再去自己实现。

## 60. 如果需要精确答案，就避免使用 float 和 double

### float 和 double 的危害

float 和 double 类型主要是为了科学计算和工程计算而设计的。它们执行二进制浮点运算（binary floating-point arithmetic），这是为了在广泛的数值范围上提供**较为精确的快速近似计算**而精心设计的。所以，它们并没有提供完全精确的结果，不应该被用于需要精确结果的场合。它们尤其不适合用于货币计算，因为要让一个 float 或者 double 不可能精确地表示 10 的任何负数次方值。

System.out.println(1.03 - 0.42);			// 0.6100000000000001  
System.out.println(1.00 - 9 * 0.10);		// 0.09999999999999998  
  
public static void main(String[] args) {  
    double funds = 1.00;  
    int itemsBought = 0;  
    for (double price = 0.10; funds >= price; price += 0.10) {  
        funds -= price;  
        itemsBought++;  
    }  
    System.out.println(itemsBought + " items bought.");  
    System.out.println("Change: $" + funds);		// ¥0.3999999999999999  
}

### 精确计算的正确方式

#### BigDecimal

public static void main(String[] args) {  
    final BigDecimal TEN_CENTS = new BigDecimal(".10");  
    int itemsBought = 0;  
    BigDecimal funds = new BigDecimal("1.00");   
    for (BigDecimal price = TEN_CENTS; funds.compareTo(price) >= 0;  
         									price = price.add(TEN_CENTS)) {  
        funds = funds.subtract(price);  
        itemsBought++;  
    }  
    System.out.println(itemsBought + " items bought.");  
    System.out.println("Money left over: $" + funds);		// ¥0.00  
}

注意到 `BigDecimal` 构造方法的参数使用了 String 而不是 double。

但使用 `BigDecimal` 也有缺点：比使用 primitive 麻烦很多，且慢很多。

#### int 或 long

可以使用 int 或 long 来代替 `BigDecimal`，但需要自己处理十进制（decimal）小数点。

public static void main(String[] args) {  
    int itemsBought = 0;  
    int funds = 100;  
    for (int price = 10; funds >= price; price += 10) {  
        funds -= price;  
        itemsBought++;  
    }  
    System.out.println(itemsBought + " items bought.");  
    System.out.println("Cash left over: " + funds + " cents");  
}

这种方式适合数值不大的情况。如果不超过 9 位十进制数字，就可以使用 int；如果不超过 18 位数字，就可以使用 long；否则必须使用 `BigDecimal`。

## 61. 基本类型优先于装箱基本类型

### 主要区别

1.  primitives 只有值，而 boxed primitives 有值和身份（identity），也就是说，两个 boxed primitives 可能值相同但身份不同。
    
2.  primitives 只有 fully functional value，但每个 boxed primitive 除了有对应的 functional value 外还有一个 nonfunctional value —— null。
    
3.  primitives 在时间和空间上都优于 boxed primitives。
    

### 使用 boxed-primitives 可能带来的问题

#### 使用 == 操作符

假设写了一个 comparator 来表示 Integer 值的升序：

// Broken comparator - can you spot the flaw?  
Comparator<Integer> naturalOrder =  
    (i, j) -> (i < j) ? -1 : (i == j ? 0 : 1);

这个 Comparator 在很多情况下都是正确的，但有一个严重的缺陷：`naturalOrder.compare(new Integer(42), new Integer(42))` 会返回 1。

原因是：

1.  第一步 i < j，Integer 会 auto-unboxed，所以会返回 true；
    
2.  第二步 i == j，这会对两个 Integer 对象引用进行身份对比（identity comparison），所以会返回 false；
    
3.  第三步，返回 1。
    

**在 boxed-primitives 之间使用 == 操作符几乎永远是错的。**

> 如果需要 Comparator 描述一个类型的 natural order，可以直接调用 `Comparator.natualOrder()`。如果要自己编写 Comparator，就需要使用 Comparator 的构造方法或者在 primitive 类型上使用静态 compare 方法（详见第 14 条）

可以添加两个局部变量来避免这个问题：

Comparator<Integer> naturalOrder = (iBoxed, jBoxed) -> {  
    int i = iBoxed, j = jBoxed; // Auto-unboxing  
    return i < j ? -1 : (i == j ? 0 : 1);  
};

#### 初始化

public class Unbelievable {  
    static Integer i;  
    public static void main(String[] args) {  
        if (i == 42)  
            System.out.println("Unbelievable");  
    }   
}

这段程序会抛出 NPE，因为 i 是一个 Integer 而不是 int，所以它的初始值为 null。然后在 i == 4 中，i 会被 auto-unboxed，因此抛出 NPE。

#### 性能

// Hideously slow program! Can you spot the object creation?  
public static void main(String[] args) {  
    Long sum = 0L;  
    for (long i = 0; i < Integer.MAX_VALUE; i++) {  
           sum += i;  
    }  
    System.out.println(sum);  
}

这段第 6 条中的程序没有问题，但性能很差。因为 sum 是 boxed primitive（包含了一次对象创建），在循环中会重复进行 boxing 和 unboxing。

### 何时该用 boxed primitives

1.  可以用于集合中的 element、key 和 value，因为不能将 primitive 放入集合中；
    
2.  可以用于参数化类型和方法中的类型参数（详见第 5 章），原因同上；
    
3.  可以用于反射方法调用（详见第 65 条），原因同上。
    

## 62. 在有其他选择的时候不要使用 String

### String 不适合代替其他值类型

只有在值是文本信息的时候才使用 String。如果有其他合适的值类型，无论是 primitive 还是对象引用，都应该使用它；如果没有，就写一个新的类型。

### String 不适合代替枚举类型

枚举类型比 String 更加适合用来表示枚举类型的常量，详见第 34 条。

### String 不适合代替聚合类型

如果一个实体有多个组件，最好别用一个 String 来表示它。如果这样，那么在访问某个对象域的时候，就需要解析 String，这会很慢、很繁琐并且容易出错。You can’t provide equals, toString, or compareTo methods but are forced to accept the behavior that String provides（TODO：没明白什么意思）。更好的办法是编写一个类来表示这个聚合，通常是一个 private static 类（详见第 24 条）。

### String 不适合替代 capabilites

在 Java 有 ThreadLocal 之前，可能会通过下面的代码来实现：

// Broken - inappropriate use of string as capability!  
public class ThreadLocal {  
    private ThreadLocal() { } // Noninstantiable  
    // Sets the current thread's value for the named variable.  
    public static void set(String key, Object value);  
    // Returns the current thread's value for the named variable.  
    public static Object get(String key);  
}

这种方法的问题是，作为 key 的 string 代表了一个 thread-local 变量共享的全局命名空间。当两个客户端碰巧使用了同样的 string 作为 key 的时候，它们就会共享一个 thread-local 遍历。并且这个缺陷可能被恶意客户端利用，来非法访问其他客户端的数据。

解决办法很简单，可以通过使用一个不可伪造（unforgeable）的 key 来代替 string，这种 key 叫做 capability：

public class ThreadLocal {  
    private ThreadLocal() { }  // Noninstantiable  
     
    public static class Key {  // (Capability)  
        Key() { }  
    }  
      
    // Generates a unique, unforgeable key  
    public static Key getKey() {  
        return new Key();  
    }  
    public static void set(Key key, Object value);  
    public static Object get(Key key);  
}

其实并不需要静态方法，它们可以成为 `Key` 的实例方法，这样也就表示 `Key` 不再是映射到 thread-local 变量的 key，而它自己就是一个 thread-local 变量。从而，`Key` 的外部类 `ThreadLocal` 也就没用了，可以删除它，并将 `Key` 重命名为 `ThreadLocal`。

> Key 代表 Key 类，key 代表映射中的 key。

 public final class ThreadLocal {  
    public ThreadLocal();  
    public void set(Object value);  
    public Object get();  
}

这个 API 不是类型安全的，因为必须将 get 得到的 Object 转型为真正的类型。不可能使最开始基于 String 的 API 为类型安全的，要使基于 `Key` 的 API 为类型安全的也很困难，但是通过将 ThreadLocal 类泛型化（详见第 29 条），使这个 API 变成类型安全的就是很简单的事情了：

public final class ThreadLocal<T> {  
    public ThreadLocal();  
    public void set(T value);  
    public T get();  
}

此时，既解决了基于 String 的 API 带来的问题，也比基于 `Key` 的 API 性能好且更优雅。

## 63. 了解 String 连接的性能

为连接 n 个字符串而重复地使用字符串 连接操作符，时间复制度是 O(n^2)。这是因为字符串是 immutable（详见第 17 条）而导致的。而使用 `StringBuilder` 的时间复杂度是 O(n)。

// Inappropriate use of string concatenation - Performs poorly!  
   public String statement() {  
       String result = "";  
       for (int i = 0; i < numItems(); i++)  
           result += lineForItem(i);  // String concatenation  
       return result;  
}  
  
  
public String statement() {  
    StringBuilder b = new StringBuilder(numItems() * LINE_WIDTH);   
    for (int i = 0; i < numItems(); i++)  
        b.append(lineForItem(i)); return b.toString();  
}

在作者机器上，入股哦numItesm 返回 100 且 lineForItem 返回一个长度为 80 的 String，那么下面的方法会比上面快 6.5 倍，即使不预先分配 StringBuilder，也会比上面快 5.5 倍。

所以，只有性能不重要的时候使用 + 来连接 String，否则用 StringBuilder。也可以使用字符数组，或者每次处理一个 String，而不是将它们合并起来。

## 64. 多考虑用接口引用对象

### 使用接口

第 51 条说应该使用接口而不是类作为参数的类型，更一般的来说就是，优先使用接口而不是类来引用对象。如果有合适的接口存在，那么参数、返回值、变量和域都应该用接口类型声明。唯一需要用类去引用对象的时候就是创建它们的时候。

使用接口类型会让代码更灵活，如果要切换实现类，只需要在创建对象的时候改变类名。而且这样完全不会影响其他代码能运行。

但有一点要注意，如果原先的实现提供了一些特殊的功能，而这个功能不是这个接口通用合约所要求的，并且代码依赖这个功能。那么在切换后的实现类的时候就必须具有相同的功能。例如，如果代码依赖 LinkedHashSet 的有序性，那么就不能用 HashSet 来代替它。

如果使用实现类的类型来声明一个变量，虽然在我们的代码中可以通过同时修改声明类型和实现类型，但改变之后可能会导致编译失败。因为可能客户端使用了原先实现类型的方法，但这个方法可能在新的实现类型上不存在；也有可能客户端将原来的实例传递给了接受这个原来的实现类型的方法。

### 使用类

如果没有合适的接口存在，那么就完全可以使用类来引用对象。没有合适接口的情况大概有三点。

#### 值类

以值类（value classes）为例，比如 String 和 BigInteger。值类在编写的时候很少考虑到多种实现。它们通常是 final 的，并且很少有对应的接口。所以使用这样的值类作为参数、变量、域和返回值的类型是十分合适的。

#### 抽象类

对象属于一个框架，这个框架的基本（fundamental）类型是类而不是接口。如果一个对象属于这样一个基于类的框架，最好用相关的基类（base class，通常是抽象的）来指代它，而不是用其实现类。许多 java.io 类，如`OutputStream` 就属于这一类。

#### 实现类有接口没有的方法

只有当程序依赖这些额外的方法，才应该使用这个实现类来引用对象。例如 `PriorityQueue` 有一个 comparator 方法，但它实现的接口 `Queue` 没有。

## 65. 接口优于反射

核心反射机制，java.core.reflect，提供了对任意类的程序化访问。给定一个 Class 对象，可以获得`Constructor`、 `Method` 和 `Field` 实例，分别代表了 **Class 实例所代表的类**的构造器、方法和域。

TODO：没看完。。

## 66. 谨慎使用 native 方法

JNI（Java Native Interface）使 Java 程序员可以调用本地方法，本地方法是指 native programming languages，如 C 和 C++。它们提供对平台特定设施（platform-specific facilites）的访问，如注册表（registries）。它们提供对现有本地代码库的访问，包括遗留代码库（它可以提供对遗留数据的访问）。最后，本地方法可以同过用本地语言，编写应用程序中注重性能的部分。 使用本地方法来访问平台特定的设施是合法的，但很少有必要：随着 Java 平台的成熟，它提供了对许多以前只存在在 host platforms（宿主平台？）上特性的访问。例如，Java 9 中增加的进程 API 提供了对操作系统进程的访问。当 Java中没有相应的库时，通过使用本地方法来使用本地库也是合法的。 **为了提高性能而使用本地方法很少是可取的。**在 Java 3 之前，这往往是必要的，但从那以后 JVM 变得更快。对于大多数任务，现在可以在 Java 中获得与本地方法几乎相同的性能。例如，当 java.math 在 1.1 版中被添加时，BigInteger 依赖于当时用 C 语言编写的快速多精度算术库。在 Java 3 中，BigInteger 被重新用 Java 实现，并被调教到比原来的本地实现更快。

> 这个故事有一个悲伤的结局：BigInteger 从那时起就没有什么变化，除了在 Java 8 中加快了大数的乘法运算。在那段时间里，本地库的工作继续快速进行，特别是 GNU 多精度算术库（GMP）。需要真正高性能多精度算术的 Java程序员现在有理由通过本地方法使用 GMP。

使用本地方法有严重的缺点。因为**本地语言并不安全**（详见第 50 条），所以使用本地方法的应用程序不能免受内存损坏错误的影响。因为本地语言比 Java 更依赖平台，使用本地方法的程序的可移植性更差。它们也更难调试。如果你不小心，本地方法会降低性能，因为垃圾收集器不能自动化、甚至不能跟踪本地内存的使用情况（详见第 8 条），而且进入和退出本地代码也有一定成本。最后，本地方法需要 "胶水代码（glue code）"，而这些代码很难阅读，编写起来也很繁琐。

总之，在使用本地方法之前请三思。你很少需要使用它们来提高性能。如果你必须使用本地方法来访问低级别的资源或本地库，请尽量少用本地代码，并对其进行彻底测试。本机代码中的一个错误就可以破坏整个应用程序。

> 这章几乎全是翻译的，挺难读的。

## 67. 谨慎地优化

有三句关于优化的名言：

-   以效率的名义（不一定能实现）犯下的计算过失比任何其他原因（包括盲目的愚蠢）都多。
    
-   不要去计较效率上一些小的得失，在 97% 的情况下，premature optimization 才是一切问题的根源。
    
    > 不知道这里的 premature 的意思是过早的还是不成熟的。
    
-   在优化方面应该遵守两条规则：
    
    1.  不要进行优化；
        
    2.  （仅适用于专家）暂时不要这样做，也就是说，在你有一个完美的、未经优化的解决方案之前，不要这样做。
        
        > 原文：Don’t do it yet—that is, not until you have a perfectly clear and unoptimized solution.
        

这三句名言比 Java 早了 20 年，它们都讲述了一个关于优化的深刻真理：优化时很容易造成弊大于利的情况，尤其是不成熟的优化。以至于可能最终产生的软件既不快也不正确，且还不容易修正。

不要为了性能而放弃合理的架构原则，要努力编写好程序而不是运行快的程序。如果一个好程序运行得不够快，那么它的架构会容许它进行优化。

TODO：没看完。。

## 68. 遵守普遍接受的命名惯例

Java 有一套很好的命名管理（naming conventions），其中有许多都被包含在《The Java Language Specification》中。命名惯例大致分为两类：typographical（排版的）和 grammatic（语法的）。

### 排版惯例

这种惯例比较少，但也涉及了包、类、接口、方法、域和类型变量，尽量不要违反这个惯例。

#### 包和模块

包和模块的名称应该是层次状的，用句号分隔每部分。每个部分都应该由小写字母组成，很少会有数字。

包名称的开头部分应该是所在的组织的 Internet 域名，而且这个域名是反过来的。如 edu.cmu、com.google、org.eff。标准类库和一些包的名称以 java 和 javax 开头，这是一种例外，用户千万不能以 java 或 javax 开头。

包名称的剩下部分应该由一个或者多个描述该包的部分组成。每部分都应该尽少于 8 个字符，并且通常来说是一个单词或者缩写。如果使用缩写，要有意义，如使用 util 而不是 utilities。首字母缩写也是可以接受的，如 awt。

包名称通常除了 Internet 域名外只有一个部分，如果这个包特别大，可以将它们分割成非正式的层次结构。如 javax.util 包中有 javax.util.concurrent.atomic。这通常称为子包，但 Java 语言层面上并没有对这种层级提供支持。

#### 类和接口

类和接口，包括枚举和注释类型的命名应该由若干单词组成。尽量不要使用缩写，除非是首字母缩写或常见缩写，如 max 和 min。但对于首字母缩写来说，到底应该全部大写还是只有第一个大写，没有统一定论。一些认为只有第一个要大写的人认为，如果连续出现多个首字母缩写的形式，就很难区分一个单词的起始和结尾，如类名 HttpUrl 明显比 HTTPURL 更清晰。

#### 方法和域

方法和域命名与类和接口命名的 typographical 惯例相同，除了首字母小写。如果方法和域名称的第一个单词正好是首字母的缩写，那么也要小写。

唯一的例外是常量域，它的命名应该包括一个大写单词或多个被 “_” 分隔的大写单词。常量域是一个值不可变的 static final 域。如果一个 static final 域有一个 primitive 类型或者不可变的引用类型（详见第 17 条），那它就是一个常量域；如果 static final 域有一个可变的引用类型，但引用的对象是不可变的，那么它仍然是一个常量域。

#### 局部变量

局部变量命名与 member（方法和与域）命名的 typographical 惯例相同，但它允许缩写，也允许用单个字符或短字符序列来命名，因为它的含义取决于它们出现的上下文。

输入参数是一种特殊的局部变量，应该仔细命名，因为它们的命名是所在方法的文档的一个组成部分。

#### 类型参数

类型参数的命名通常是单个字符，最常见的有下面五种：

-   T 表示任意类型，如果要表示多个任意类型，可以使用 T、U、V 或 T1、T2、T3；
    
-   E 表示集合中的元素的类型；
    
-   K 和 V 表示 map 中的 key 和 value 的类型；
    
-   X 表示异常；
    
-   R 表示函数的返回类型。
    

### 语法惯例

语法惯例比排版惯例更灵活，但也更有争议。

没有给包命名的语法惯例。

#### 类和接口

可实例化的类，包括枚举类，通常用一个名词或者名词短语命名，如 Thread 或 PriorityQueue；不可实例化的工具类（详见第 4 条）通常用复数名词命名，如 Collectors 或 Collections。

接口的命名和类相似，如 Collection 或 Comparator；或者使用一个以 **able** 或 **ible** 结尾的形容词命名，如 Runnable、Iterable 或 Accessible。

注释类型由太多用处，没有一种主导的命名方式。名词、动词、介词和形容词都很常见，如 BindingAnnotation、Inject、InplementedBy 或 Singleton。

#### 方法

-   完成某个动作的方法通常用动词或动词短语（包括宾语），如 append 或 drawImage；
    
-   返回 boolean 的方法的名称通常以 is 或 has（比前者少见）开头，后面接着一个名词、名词短语或者任何能作为形容词的单词或短语，如 isDigit、isProbablePrime、isEmpty、isEnabled 或 hasSiblings
    
-   返回被调用对象中非 boolean 的 function 或属性的方法，通常被命名成一个名词、名词短语或者是一个以 get 开头的动词短语，如 size、hashCode 或 getTime。
    
-   还有些方法的命名优点特殊：
    
    -   转换对象类型的实例方法通常被命名为 toType，如 toString 或 toArray；
        
    -   返回一个视图（详见第 6 条）的方法，并且这个视图的类型不同与接收对象的类型，这种方法通常被命名为 asType，如 asList；
        
    -   返回一个与被调用对象的值相同的 primitive 的方法通常被命名为 typeValue，如 intValue；
        
    -   静态工厂的常用命名有：from、of、valueOf、instance、newInstance、getType 和 newType（详见第 1 条）。
        

#### 域和局部变量

与类、接口和方法的命名相比，域命名的语法惯例不太完善，也不太重要，因为设计良好的 API 几乎不包含任何暴露的字段。boolean 类型的字段通常像 boolean 访问器方法一样命名，省略了首字母，例如，initialized 和 composite。其他类型的字段通常用名词或名词短语来命名，如 height、digits 或 bodyStyle。

局部变量命名的语法惯例与域命名的语法惯例相似，但更弱一些。

# 九. 异常

当充分发挥异常的优点，可以提高程序的可读性、可靠性和可维护性。如果使用不当，它们也会产生负面影响。

TODO：这章看的不太明白，基本上都是纯翻译。

## 69. 只在异常情况下使用异常

### 异常不能用于控制流程

// Horrible abuse of exceptions. Don't ever do this!  
try {  
    int i = 0;  
    while(true)  
        range[i++].climb();  
} catch (ArrayIndexOutOfBoundsException e) {  
}

如果看到上面的代码，我们会根本不知道它在干什么，这也就是不使用它的原因（详见第 67 条）。这个无限循环会在数组第一次越界的时候，通过抛出、捕捉和忽略 ArrayIndexOutOfBoundsException 来被终止。写出这种代码的原因可能是有人认为，如果在 try-catch 中访问数组，JVM 就不会每次都要检查越界情况，而 for-each 每轮都要做这个检查。这个想法明显是错的：

-   异常机制是为了特殊的情况设计的；
    
-   把代码放进 try-catch 块里会抑制 JVM 可能会进行的优化；
    
-   标准遍历数组不一定会做冗余的越界检查，许多 JVM 的实现都对这个做了优化。
    

这种基于异常的数组遍历方式，不仅模糊了代码的意图、降低了它的性能，而且它不一定能正常工作。假设这个循环中调用另一个方法，这个方法会访问另一个数组，此时如果越界了，那么就会被这个循环外的 catch 语句捕捉到并忽略，这就好像是正常的数组遍历结束。

**异常只应该在特殊情况中使用，它们绝对不能用于控制流程中。**

### API 设计

上面这条原则对 API 也使用。有一个 state-dependent 方法的类（这个方法只有在特定条件下才能被调用），如何让用户不通过异常的方式来进行流程控制。

#### 方式一

提供有一个 state-testing 方法，用来判断是否可以调用 state-dependent 方法。例如，Iterator 接口有一个 state-dependent 方法：next，和对应的 state-testing 方法：hashNext。这就避免了在使用迭代器的时候不需要通过异常来结束迭代，例如下面这样：

// Do not use this hideous code for iteration over a collection!  
try {  
    Iterator<Foo> i = collection.iterator();  
    while(true) {  
        Foo foo = i.next();  
        ...   
    }  
} catch (NoSuchElementException e) {  
}

#### 方式二

还有一种不需要 state-testing 方法的 API 设计方式：如果 state-dependent 方法无法执行，就返回一个 empty optional 或一个可识别的值，如 null。

#### 如何选择

-   如果一个对象会被异步并发访问，那就必须第二种方式。因为对象的状态可能在 state-testing 和 state-dependent 被调用的期间改变。
    
-   如果第一种方式的 state-testing 方法会重复做了 state-dependent 方法的工作，出于性能的考虑，使用第二种方式。
    
-   如果其他条件都相同，那么第一种方式会略好与返回可识别的值（没说 Optional）。因为它提供了稍微更好的可读性，并且可能更容易检测到错误：如果忘记调用 state-testing，那么 state-dependent 方法会抛出异常来说明原因；但如果忘记去检查这个可识别的值，可能就很难找到错误（返回 optional 不会有这个问题）。
    

## 70. 对可恢复的情况使用 checked exception，对编程错误使用 runtime exceptions

Java 提供了三种 throwable：checked exceptions、runtime exceptions 和 errors。

抛出一个 checked exception 还是一个 unchecked exception 的规则如下：如果期望调用者可以适当的恢复，那么就使用 checked exception。抛出 checked exception 就是强制调用者在 catch 语句中处理或继续向外抛出（propagete），也可以在 catch 语句中忽略异常，但这不是一个好的做法（详见第 77 条）。

unchecked throwable 有两种：runtime exceptions 和 errors。它们的行为完全一样，都是不应该被捕捉到。如果程序抛出了一个 uncheced exception 或者 error，就说明几乎不可能从中恢复，并且继续执行弊大于利。

使用 runtime exceptions 来表明编程错误。大部分 runtime exception 都表示违反前置条件，也就是指违反 API 的约定。例如，数组访问的约定指明了下标必须在 0 和数组长度 - 1 之间，ArrayIndexOutOfBoundsException 表明违反了这个前置条件。

但可恢复的情况和编程错误的界限很模糊。比如，如果资源不够，既可能是编程错误引起的，比如分配了一个不合理的过大的数组；也有可能是短暂的资源短缺，这种情况就是可恢复的。API 的设计者需要判断这样的资源不够是否可以恢复。如果相信可以恢复，那就使用 checked exception；否则就使用 runtime exception。如果判断不了是否可恢复，那么最好抛出一个 unchecked exception，原因详见第 71 条。

按照惯例，errors 通常被 JVM 保留使用，用来表示资源短缺、约束失败（invariant failure）或者其他使程序无法继续运行的情况。所以最好不要去实现任何新的 Error 子类。因此， 所实现的所有 unchecked throwables 都应该是 RuntimeException 的子类。 不仅不应该定义 Error 子类，甚至也不应该抛出 AssertionError 异常。

要想定义一个 throwable，使它不是 Exception、RuntimeException 或 Error 的子类，这也是可能的。JLS 并没有直接规定这样的 throwable，而是隐式地指定了它们的行为等同于普通的 checked exceptions（即 Exception 的子类。那么，什么时候应该使用这样的 throwable 呢？一句话：永远也不会用到。它与普通的 checked exceptions 相比没有任何益处，只会困扰 API 的用户。

API 的设计者往往会忘记，异常也是个完全意义上的对象，可以在它上面定义任意的方法。这些方法的主要用途是为捕获异常的代码而提供额外的信息，包括关于引发这个异常的情况的信息。如果没有这样的方法，程序员必须要懂得如何解析 “该异常的字符串表示法”，以便获得这些额外信息。这是极为不好的做法（详见第 12 条）。类很少会指定它们的字符串表示法中的细节，因此，对于不同的实现及不同的版本，字符串表示法会大相径庭。由此可见，“解析异常的字符串表示法” 的代码可能是不可移植的，也是非常脆弱的。

因为 checked exceptions **往往指明了可恢复的条件**，所以，对于这样的异常，提供一些辅助方法尤其重要，通过这些方法，调用者可以获得一些有助于恢复的信息。例如，假设因为用户资金不足，当他企图购买一张礼品卡时导致失败，于是抛出一个受检的异常。这个异常应该提供一个访问方法，以便允许客户查询所缺的费用金额，使得调用者可以将这个数值传递给用户。关于这个主题的更多详情，请参阅第 75 条 。

总而言之，对于可恢复的情况 ，要抛出 checked exceptions；对于程序错误，要抛出 runtime exceptions。不确定是否可恢复，则抛出 unchecked exceptions。不要定义任何既不是受检异常也不是运行时异常的 throwable。要在 checked exceptions 上提供方法，以便协助恢复。

## 71. 避免滥用 checked exceptions

### checked exceptions 带来的负担

> 负担指的是必须编写的 try-catch 块。

正确使用 checked exceptions 可以改善 API 和程序。它们强迫程序员去处理异常，增加可靠性。但如果过分使用就会使 API 使用起来很不方便。如果方法抛出了 checked excetpions，那么调用这个方法的代码就必须处理他们，要么使用一个或多个 catch 块，要么将它们传播出去。这个负担在 Java 8 之后会加重，因为抛出 checked exception 的方法不能直接在 Stream 中使用（详见 45-48 条）。

如果正确地使用 API 不能防止这种特殊情况的发生，而且使用 API 的程序员在遇到这种异常时可以采取一些有用的措施，那么这种负担可能是合理的。除非这两个条件都满足，否则可以使用 unchecked exception。

如果只是像下面这样处理，那么最好使用 unchecked exception：

} catch (TheCheckedException e) {  
    throw new AssertionError(); // Can't happen!  
}  
  
  
} catch (TheCheckedException e) {  
    e.printStackTrace();        // Oh well, we lose.  
    System.exit(1);  
}

如果这是一个方法抛出的唯一一个被 checked exception，那么程序员所承受的额外负担就会大大增加，必须为这唯一一个异常编写 try-catch 块。如果该方法还有其他的异常，那么这个异常最多只需要添加一个 catch 块即可。如果一个方法只抛出了一个 checked exception，那么这个异常就是必须使用 try-catch 块调用该方法的唯一原因，也是不能直接用于 Stream 中的唯一原因。在这种情况下，我们要问自己是否有办法避免这个 checked exception。

### 消除 check exception

#### 返回 Optional

最简单的方法是返回一个 `Optional`（详见第 55 条）。该方法没有抛出一个 checked exception，而是简单地返回一个 empty optioanl。这种技术的缺点是，该方法不能返回任何额外的信息来详细说明它所不能执行所需的计算。相比之下，异常有描述性的类型，并且可以导出方法来提供额外的信息（详见第 70 条）。

### 重构方法

通过将一个方法拆分成两个方法，从而将 checked exception 转化为 unchecked exception，其中有一个方法返回 boolean 来说明是否该抛出异常。例如，将下面的代码

// Invocation with checked exception  
try {  
    obj.action(args);  
} catch (TheCheckedException e) {  
    ... // Handle exceptional condition  
}

重构为：

// Invocation with state-testing method and unchecked exception  
if (obj.actionPermitted(args)) {  
    obj.action(args);  
} else {  
    ... // Handle exceptional condition  
}

这种重构并不总是合适的，但在合适的情况下，它可以使一个 API 更容易使用。虽然后者的调用序列并不比前者更漂亮，但重构后的 API 更加灵活。如果程序员知道调用会成功，或者满足于让线程在失败时终止，重构也允许这种琐碎的调用序列：

obj.action(args);

如果你认为这种琐碎的调用序列会是标准方式（TODO：这句话没明白，琐碎到底指的是什么），那么 API 重构就可能是合适的。这种方式的 API 本质上是第 69 条中的 state-testing 方法 API，同样的注意事项也适用：

1.  如果一个对象在没有外部同步的情况下被并发访问，或者它受到外部引起的状态转换的影响，这种重构是不合适的，因为对象的状态可能在调用 `actionPermitted` 和 `action` 之间发生变化。
    
2.  如果一个单独的 `actionPermitted` 方法会重复 `action` 方法的工作，那么基于性能原因，这种重构可能会被排除。
    

### 总结

总而言之，当少用 checked exceptions 时可以提高程序的可靠性；当过度使用时，它们会使 API 的使用变得很痛苦。如果调用者无法从失败中恢复，那么就抛出 unchecked exception。如果恢复是可能的，并且你想强迫调用者处理异常情况，首先考虑返回一个 `Optional`。只有当这在失败的情况下提供的信息不足时，你才应该抛出一个检 checked exceptions。

## 72. 优先使用标准异常

### 重用标准异常的好处

专业的程序员和普通程序员一个很大的区别就是前者能完成高水平的代码重用，异常也在这个重用范围内。Java 类库提供了提供了许多异常类，覆盖了绝大部分 API 的抛出异常需求。好处有三个，从大到小：

1.  可以使 API 更容易学习，因为它与程序员已经熟悉的习惯用法一致；
    
2.  可读性更好，因为不会出现程序员不熟悉的异常；
    
3.  异常类越少，意味着更少的内存占用（footpritn）和更少的类加载时间。
    

### 常见的可以被重用的异常

![Screen Shot 2021-06-21 at 23.10.18](https://chp-image-hosting.oss-cn-hangzhou.aliyuncs.com/uPic/Screen%20Shot%202021-06-21%20at%2023.10.18.png)

最常用的异常便是 `IllegalArgumentException`（详见第 49 条）。当调用者传的参数不合适的时候，往往可以抛出这个异常。

另一个常用的异常是 `IllegalStateException`。因为一个对象的状态，导致当前调用的方法是非法的，这种情况下往往抛出这个异常。例如，如果调用者在某个对象未正确初始化之前，试图去使用这个对象，就可能会导致这个异常。

每个发生错误的方法都可以归结会 illegal arugument 或 illegal state，但有些异常专门用于导致 illegal arugument 或 illegal state 原因中的某一种。如果调用者传的参数中有 null，但被调用方法不能接收 null，按照习惯应该抛出 `NullPointerException` 而不是 `IllegalArgumentException`；类似的，数组或 List 越界的时候，习惯抛出 `IndexOutOfBoundsException` 而不是 `IllegalArgumentException`。

另一个可重用的异常是 `ConcurrentModificationException`。如果一个专为单线程（或有外部同步机制）设计的对象被并发修改，那么就可以抛出这个异常。这个异常最多就是个提升，因为不可能可靠地检测到并发修改。

最后一个值得注意的标准异常是 `UnsupportedOperationException`。当某个对象不支持某个操作时，就可以抛出这个异常。这个异常用的很少，因为大部分对象都能支持它们所有的方法。一般在这种情况会用到：一些类实现了一个接口，但是接口中有一个或多个可选方法，这些类无法实现。例如，有一个只支持添加的 List 实现类，在被调用删除元素的方法时，可以抛出这个异常。

> 选择重用哪种异常并非总是那么精确，因为这些异常的使用场合并不是相互排斥的。
> 
> 例如，有一个方法接受一个 handSize 参数来从一副牌中拿去 handSize 张牌。如果 handSize 超过了牌的数量，既可以被解释成 `IllegalArgumentException`（handSize 太大），也可以被解释成 `IllegalStateException` （牌太少）。这种情况下，**throw IllegalStateException if no argument values would have worked, otherwise throw IllegalArgumentException**。

### 特殊情况下也可以重用异常

有些异常一般在特殊情况下重用。例如，在实现如复数或分数等的算术对象时，可以重用 `ArithmeticExceptio` 和 `NumberFormatException`；

如果觉得一个异常符合需要，并且抛出的条件与异常文档描述一致，那么就放心地使用它。如果需要在异常中添加更多信息（详见第 75 条），也可以放心地去继承标准异常，但要记住，异常都是可序列化的（详见第 12 章）。同样，这也正是「没有好的理由就不要编写自己的异常类」的原因。

### 不能直接重用的异常

不要直接重用 `Exception`、`RuntimeException`、`Throwable` 和 `Error`。把这些类当作是抽象的。你不能可靠地测试这些异常，因为它们是一个方法可能抛出的其他异常的超类。（TODO：这段话不明白）

## 73. 抛出适合抽象的异常

如果方法抛出了一个与方法执行的任务完全无关的异常时，会使人很迷惑。当一个方法传播一个由低层抽象抛出的异常时，这种情况经常发生。这不仅令人困惑，而且会使上层的 API 受到实现细节的污染。如果上层的实现在以后的版本中发生变化，它抛出的异常也会发生变化，有可能会破坏现有的客户端程序。

### 异常转译

#### 介绍

为了避免这个问题，高层在捕捉到底层抛出的异常时，应该抛出可以按更高层抽象来解释的异常。这种做法叫做异常转译（exception translation）：

// Exception Translation  
try {  
    ... // Use lower-level abstraction to do our bidding  
} catch (LowerLevelException e) {  
    throw new HigherLevelException(...);  
}

还有一个 `AbstractSequentialList` 的例子，它是 `List` 接口的一个骨架实现（skeletal implementation，详见第 20 条）。在这个例子中，按照 `List<E>` 接口 中 `get` 方法的规范要求，异常转译是必需的：

/**  
* Returns the element at the specified position in this list. * @throws IndexOutOfBoundsException if the index is out of range * ({@code index < 0 || index >= size()}).  
*/  
   
public E get(int index) {  
    ListIterator<E> i = listIterator(index);  
    try {  
        return i.next();  
    } catch (NoSuchElementException e) {  
        throw new IndexOutOfBoundsException("Index: " + index);  
    }  
}

#### 异常链

一种特殊的异常转译形式称为异常链（exception chaining），如果低层的异常对于调试导致高层异常的问题非常有帮助，使用异常链就很合适。低层的异常（cause）被传到高层的异常，高层的异常提供访问方法（Throwable 的 `getCause` 方法）来获得低层的异常：

// Exception Chaining  
try {  
    ... // Use lower-level abstraction to do our bidding  
} catch (LowerLevelException cause) {   
    throw new HigherLevelException(cause);  
}

高层异常的构造器将 cause 传递给能识别异常链（chaining-aware）的超类构造器，所以它最终被传递给 Throwable 的一个能识别异常链的构造器，比如 `Throwable(Throwable)`：

// Exception with chaining-aware constructor  
class HigherLevelException extends Exception {  
    HigherLevelException(Throwable cause) {  
        super(cause);  
    }  
}

绝大多数标准异常都有这种能识别异常链的构造器。如果没有，那么就可以用 `Throwable` 的 `initCause` 方法来设置 casue。异常链不仅可以通过程序（使用 `getCause` 方法）来得到原因，并且还可以将 cause 的 stack trace 集成到高层异常中。

### 不要过度使用异常转译

虽然异常转译比无意识地传播来自下层的异常要好，但也不应该过度使用它。在可能的情况下，**处理来自下层的异常的最好方法是避免它们，确保下层方法成功**。有时可以通过在传递给下层之前检查上层方法的参数的有效性来做到这一点。

如果不可能防止来自下层的异常，那么下一个最好的办法就是**让上层默默地绕过这些异常，使上层方法的调用者与下层问题隔绝**。在这种情况下，使用一些适当的日志设施来记录异常可能是合适的。这使得程序员可以调查问题，同时将客户代码和用户与之隔绝。

### 总结

总之，如果防止或处理来自下层的异常是不可行的，那么就使用异常转换，除非下层方法刚好能保证它的所有异常都适合于上层。异常链提供了两全其美的方法：它允许你抛出一个适当的高层异常，同时为故障分析捕获根本原因（详见第 75 条）。

### 个人理解

异常转译很像迪米特法则：假设有代码分 A、B、C 三层，A 是最高，C 是最底层。异常转译就是，如果 B 捕捉到了 C 抛出的异常，应该以 B 的语言描述成 A 能理解的再抛出，这样 A 捕捉到的就是 B 抛出的，而 A 是 B 的直接高层，A 可以识别 B。如果不经过异常转译，那么 A 就会直接捕捉到 C 抛出的异常，而 A 和 C 中间隔了个 B，但 A 和不应该了解非直接下层的内容。

异常转译有两种：

1.  高层以自己的语言描述，再抛出给更高层；
    
2.  高层抛出新的异常，这个异常携带着捕捉到的低层异常。似乎也就是在第一条的基础上，携带着低层异常。
    

## 74. 记录每个方法抛出的所有异常

始终要单独声明每个 checked exception，并用 @throw 说明异常被抛出的条件。如果一个方法抛出多个异常，不要为了方便而抛出这些一个异常的共同父类。极端的例子就是抛出 Exception，或者更极端的 Throwable。抛出这两个异常，不会给用户提供关于「这个方法能够抛出哪些异常」的信息，而且它还会掩盖该方法在相同条件下抛出的其他异常。例外就是 main 方法，它可以安全地被声明抛出 Exception，因为它只通过虚拟机调用。

虽然 Java 语言层面没有要求声明方法抛出的 unchecked exceptions，但却十分值得做。Unchecked exceptions 代表了编程上的错误（详见第 70 条），所以声明它们可以让程序员了解这些错误，并帮助他们避免。对于方法可能抛出的 unchecked exceptions，如果将这些异常信息很好地组织成列表文档，就可以有效地描述出这个方法被成功执行的 preconditions。每个方法的文档应该描述它的 preconditions（详见第 56 条），这是很重要的，在文档中记录下 unchecked exceptions 是满足前提条件的最佳做法。

在接口文档中记录可能抛出的 unchecked exceptions 尤其重要，这个文档构成了接口通用约定（general contract）的一部分，并使接口的多个实现之间有共同的行为。

使用 @throws 记录方法可能抛出的每个异常，但不要用 @throw 记录 unchecked exception。因为使用者要知道哪些是 checked exceptions，哪些是 unchecked exceptions，因为在这两种情况下，程序员的责任是不一样的。@throws 标签生成的文档，在方法声明中没有相应的 throws 子句，为程序员提供了一个强烈的视觉提示，即异常是未被检查的。

应该注意的是，记录每个方法可以抛出的所有 unchecked exceptions 是一种理想，在现实世界中并不总是可以实现。当一个类进行修改时，如果一个导出的方法被修改成抛出额外的 unchecked exceptions，这并不违反源码或二进制兼容性。假设一个类调用了另一个独立编写的类中的一个方法。前一个类的作者可能会仔细地记录每个方法抛出的所有未检查的异常，但是如果后一个类被修改为抛出额外的 unchecked exceptions，那么前一个类（没有经过修改）很可能会传播新的未检查的异常，尽管它没有记录这些异常。

如果一个类中的许多方法因为同样的原因抛出了一个异常，你可以在该类的文档注释中记录这个异常，而不是为每个方法单独记录它。一个常见的例子是 `NullPointerException`。一个类的文档注释可以：“如果任何参数中传递了一个空的对象引用，这个类中的所有方法都会抛出一个 `NullPointerException`"，或者类似的文字。

总而言之，记录下你所写的每个方法可能抛出的每一个异常。对于 unchecked and checked exceptions 都是如此，对于抽象的和具体的方法也是如此。这个文档应该采用 doc 注释中的 @throws 标签的形式。在方法的 throws 子句中单独声明每个 checked exceptions，但不要声明 unchecked exceptions。如果你没有记录你的方法可以抛出的异常，那么其他人就很难甚至不可能有效地使用你的类和接口。

## 75. 在详细消息中包含失败-捕获信息

当程序由于未捕获的异常而失败时，系统会自动打印出该异常的堆栈轨迹。这个堆栈轨迹包括了这个异常的字符串表示法，即它的 `toString`。它通常包含该异常的类名，后面是详细消息（detail message）。这通常是程序员找错误原因时候的唯一信息。所以，在异常的 `toString` 方法中应该尽可能多的返回有关失败原因的信息。

为了捕获失败，在异常的详细信息中应该包括所有参数和导致异常的域的值。例如，`IndexOutOfBoundsException` 的详细信息中应该包括下界、上界和索引值，这三个值都有可能是出错的原因，如：索引可能越界也可能是个无效值，下界可能大于上界（很严重的错误）。每种情况都说明了一个不同的问题，可以让程序员加快修复问题。

对安全敏感的信息不要放到异常的详细信息中，如密码、密钥等。因为许多人都可以看见堆栈轨迹。

虽然需要在异常等详细信息中尽可能包含所有有用的数据，但包含大量的描述白话文是没意义的。因为堆栈轨迹一般都会和文档或源文件一起分析，它通常包含抛出该异常堆栈上所有方法调用所在的确切文件和行号。

异常的详细消息和提供给用户的错误信息不同，前者是提供给程序员来分析错误的，内容比可读性更重要。

确保异常在其详细信息中包含足够的失败-捕获（failure-capture）信息的一种方法是在其构造器中要求这些信息，而不是用字符串的细节信息。然后细节信息可以自动生成，以包括这些信息。例如，`IndexOutOfBoundsException` 的构造函数可以是这样的，而不是一个只有一个字符串的构造函数：

/**  
* Constructs an IndexOutOfBoundsException.  
*  
* @param lowerBound the lowest legal index value  
* @param upperBound the highest legal index value plus one  
* @param index      the actual index value  
*/  
  
public IndexOutOfBoundsException(int lowerBound, int upperBound, int index) {  
    // Generate a detail message that captures the failure  
    super(String.format(  
        "Lower bound: %d, Upper bound: %d, Index: %d",  
        lowerBound, upperBound, index));  
    // Save failure information for programmatic access  
    this.lowerBound = lowerBound;  
    this.upperBound = upperBound;  
    this.index = index;  
}

但是直到 Java 9，`IndexOutOfBoundsException` 才提供了一个带有一个值为索引的 int 参数的构造方法，但省略了 `lowerBound` 和 `upperBound` 参数。其实，Java 类库中很少采用上面所说的办法，但这很值得使用。这种做法把生成高质量细节信息的代码集中在异常类中，而不是要求类的每个用户都去生成多余的细节信息。

正如在第 70 条中所建议的，异常可以为其错误-捕获的信息提供访问器方法（上面的例子中的 `lowerBound` 、`upperBound` 和 `index`）。在 checked exceptions 上提供这样的访问器方法比在 unchecked exceptions 上提供这样的访问器方法更重要，因为错误-捕获的信息在从错误中恢复时可能很有用，但程序员想要以编程方式访问 unchecked exceptions 细节，这是很罕见的。然而，即使对于 unchecked exceptions，在一般情况下，提供这些访问器似乎也是明智的（详见第 12 项，第 57 页）。

## 76. 努力实现失败的原子性

当一个对象抛出了异常，通常期望这个对象仍然保持在一个良好定义、可用的状态，即使这个失败是发生在执行某个操作的过程中。对于 checked exceptions 来说，这尤其重要，因为调用者期望能够从中恢复。**一般来说，一个失败的方法调用应该让对象处于调用前的状态。**一个具有这种属性的方法被称为具有失败的原子性（failure atomic）。

### 实现失败原子性

#### 可变或不可变的对象

设计一个不可变的对象（详见第 17 条）。如果对象是不可变的，方法就必然有失败的原子性。如果一个操作失败了，但它永远改变不了已有对象的状态。

如果方法在可变对象上操作，最常见的实现失败原子性的方法就是在操作前进行参数校验（详见第 49 条），这可以使得对象状态被修改前就抛出异常：

public Object pop() {  
    if (size == 0)  
        throw new EmptyStackException();  
    Object result = elements[--size];  
    elements[size] = null; // Eliminate obsolete reference  
    return result;  
}

如果不先检查 size，并且 size 刚好为 0 的时候：首先会使得 size 域保持在不一致的状态（负数）中，从而导致该对象的任何方法调用都会失败；其次，这个方法会抛出另一个异常：ArrayIndexOutBoundsException，这个异常对于该抽象来说明显不恰当（详见第 73 条）。

#### 调整计算过程的顺序

使任何可能会失败的计算部分都在对象状态被修改前发生。如果对参数的检查只有在执行了部分计算之后才能进行，那这种办法实际上就是上一种办法的自然扩展。比如，以 `TreeMap` 的情形为例，为了向 TreeMap 中添加元素，该元素的类型就必须是可以利用 TreeMap 的排序准则与其他元素进行比较的。如果企图增加类型不正确的元素，在 tree 以任何方式被修改之前，自然会导致 `ClassCastException` 异常。

#### 临时拷贝

将操作都放在对象的临时拷贝上进行，完成后再用临时拷贝中的内容替换原来的对象。如果将对象的内容拷贝到合适的数据结构中，那么操作过程会更快。例如，有些 List 的排序函数在排序前，会先将内容复制到数组中，来降低在排序过程中访问元素所带来的开销。并且，它还能保证输入列表保持原样。

#### 恢复代码

这种方式很不常用，编写一段恢复代码，由它来拦截操作过程中发生的失败，然后将对象回滚到操作开始之前到状态上。这种方法主要用于永久性的（基于磁盘的）数据结构。

### 失败原子性并非总是可以保持

例如，如果两个线程在没有同步的情况下并发修改一个对象，这个对象就可能留在不一致的状态之中。因此，即使在捕获了 `ConcurrentModificationException` 之后，该对象也是不可用的。

`Errors` 是不可恢复的，所以不需要在抛出 `AssertionError` 后尝试保持失败原子性。

如果有些操作会显著地提高开销或复杂度，这时候可能失败原子性就并不需要保持了。

### 总结

总之，作为一项规则，任何作为方法的一部分而产生的异常 的一部分，应该让对象处于方法调用前的状态。如果违反了这一规则，API文档应该清楚地指出对象将被留在什么状态。不幸的是，很多现有的API文档都没有达到这个理想。

总而言之，任何产生的异常（是 method specification 的一部分）应该让对象保持和调用方法前相同的状态。当违反时，API 文档应该清楚说明对象应该处于什么状态（但目前很多 API 文档都没有做到这一点）。

## 77. 不要忽略异常

不要出现空的 catch 块，这样导致程序在可能遇到异常时继续执行下去，并且在未来发生错误。就算传播异常，也至少会导致程序快速失败，并提供了有帮助的信息。

在有些情况下，忽略一个异常是合适的。例如，在关闭一个 `FileInputStream` 时，没有改变文件的状态，所以没有必要执行任何恢复动作，而且你已经从文件中读取了你需要的信息，所以没有理由中止正在进行的操作。记录这个异常可能是明智的，如果这些异常经常发生，你就可以调查这个问题。如果你选择忽略一个异常，那么catch 块应该包含一个注释，解释为什么这样做是合适的，并且这个变量应该被命名为 `ignored`：

Future<Integer> f = exec.submit(planarMap::chromaticNumber);   
int numColors = 4; // Default; guaranteed sufficient for any map   
try {  
    numColors = f.get(1L, TimeUnit.SECONDS);  
} catch (TimeoutException | ExecutionException ignored) {  
    // Use default: minimal coloring is desirable, not required  
}

这条建议同样适用于 checked and unchecked exception。

# 十. 并发

## 78. 同步访问共享的可变数据

### 为什么要同步

#### 同步的意义

同步：1. 互斥（防止多个线程中对象的状态不一致）；2. 保证进入同步方法或者同步代码块的每个线程，都能看到由同一个锁保护的之前所有的修改效果。

Java 语言规范保证读或写一个变量是原子的，除了 long 和 double 以外。也就是说读一个变量（除了 long 和 double），必定会返回一个储存在某个线程中的变量。但语言规范并没有保证一个线程修改的值对另一个线程是可见的。**为了在线程之间进行可靠的通信，也为了互斥访问，同步是必要的。**

> 这里说的原子写应该指是没有运算的复制，比如 a = 2; b = SomeReference，而不是 a = b + 1；。

#### 没有同步的后果

如果对共享的可变数据的访问不能同步，其后果将非常可怕，即使这个变量的读写都是原子性的。

下面这个程序的意思：一个线程想结束另一个线程的执行。由于 boolean 域的读和写操作都是原子的，程序员在访问这个域的时候不再需要使用同步：

> Java 的类库中提供了 `Thread.stop` 方法，但是在很久以前就不提倡使用该方法了，因为它本质上是不安全的一一使用它会导致数据遭到破坏。要阻止一个线程妨碍另一个线程，建议的做法是让第一个线程轮询（poll）一个 boolean 域，这个域一开 始为 false，但是可以通过第二个线程设置为 true，以表示第一个线程将终止自己。

// Broken! - How long would you expect this program to run?  
public class StopThread {  
    private static boolean stopRequested;  
      
    public static void main(String[] args)  
        throws InterruptedException {  
        Thread backgroundThread = new Thread(() -> {  
            int i = 0;  
            while (!stopRequested)  
                i++;  
        });  
        backgroundThread.start();  
        TimeUnit.SECONDS.sleep(1);  
        stopRequested = true;  
    }  
}

程序运行的结果是，`backgroundThread` 一直在循环中。问题在于，由于没有同步，就不能保证后台线程何时 ”看到“ 主线程对 `stopRequested` 的值所做的改变。没有同步，虚拟机将以下代码：

while (!stopRequested)  
    i++;

转变成这样：

if (!stopRequested)  
    while (true)  
        i++;

这种优化称作是**提升**（hoisting），正是 OpenJDK Server VM 的工作，但结果反而是一个活性失败（liveness failure）。

### 怎么同步

#### synchronized

修正这个问题的一种方式是同步访问 `stop­Requested` 域：

// Properly synchronized cooperative thread termination  
public class StopThread {  
    private static boolean stopRequested;  
    private static synchronized void requestStop() {  
        stopRequested = true;  
    }  
    private static synchronized boolean stopRequested() {  
        return stopRequested;  
    }  
      
    public static void main(String[] args)  
        throws InterruptedException {  
        Thread backgroundThread = new Thread(() -> {  
            int i = 0;  
            while (!stopRequested()) i++;  
        });  
        backgroundThread.start();  
        TimeUnit.SECONDS.sleep(1);  
        requestStop(); }  
}

注意写方法（`requestStop`）和读方法（`stopRequested`）都被同步了。只同步写方法还不够！除非读和写操作都被同步，否则无法保证同步能起作用。

> 有时候，会在某些机器上看到只同步了写（或读）操作的程序看起来也能正常工作，但是在这种情况下，表象具有很大的欺骗性。

`StopThread` 中被同步方法的动作即使没有同步也是原子的。换句话说，这些方法的同步只是为了它的通信效果，而不是为了互斥访问。

> 到这里就能明白这节说的原子是什么意思了：读写是原子的，只能保证会从某个线程中拿到它储存的变量但值。但在多线程情况下，这个提供变量的线程中的变量值可能并不是最新写入的。

#### volatile

如果 stopRequested 被声明为 `volatile`，第二种版本的 `StopThread` 中的锁就可以省略。`volatile` 修饰符不执行互斥访问，但它可以保证任何一个线程在读取该域的时候都将看到最近刚刚被写入的值：

 // Cooperative thread termination with a volatile field  
public class StopThread {  
    private static volatile boolean stopRequested;  
      
    public static void main(String[] args)  
        throws InterruptedException {  
        Thread backgroundThread = new Thread(() -> {  
            int i = 0;  
            while (!stopRequested)  
                i++;  
        });  
        backgroundThread.start();  
        TimeUnit.SECONDS.sleep(1);  
        stopRequested = true;  
    }  
}

在这种情况下使用 volatile 更正确，且更加简洁，性能也可能更好。

> 这里说了 volatile 拿到的是最近被写入的值，解决了上面的问题，但 volatile 并不能保证互斥访问，也就造成了：并发情况下针对同一个变量，A 方法写入了某个值，B 方法正准备写入值，C 正准备读变量值，C 在 B 后执行。如果 C 在 B 写入前先读，那么读到的虽然是最近写入的值，但却不是正确的。正确的应该等 B 写入之后，C 才开始读。下面是例子。

> volatile 适用的场合好像比较少，一般就就是上面的「多任务环境下各任务间共享的标志」。这种只是为了能看到变量的最近写入的值（防止出现本条开头的情况），而不是为了在并发情况下保证互斥。

##### volatile 也会带来问题

以下面的方法为例，假设它要产生序列号：

// Broken - requires synchronization!  
private static volatile int nextSerialNumber = 0;  
  
public static int generateSerialNumber() {  
    return nextSerialNumber++;  
}

问题在于，增量操作符（++）不是原子的。它在 `nextSerialNumber` 域中执行两项操作：首先它读取值，然后写回一个新值，相当于原来的值再加上 1。如果第二个线程在第一个线程读取旧值和写回新值期间读取这个域 第二个线程就会与第一个线程一起看到同一 个值，并返回相同的序列号。 这就是安全性失败（safety failure）：这个程序会计算出错误的结果。

一种解决办法就是将 `generateSerialNumber` 声明为 `synchronized`，并且删除 `nextSerialNumber` 的 `volatile` 修饰符。为了保护这个方法，要用 long 代替 int，或者在 `nextSerialNumber` 要进行包装时抛出异常（TODO：「原文：To bulletproof the method, use long instead of int, or throw an exception if nextSerialNumber is about to wrap.」，没看明白）。

最好还是遵循第 59 条中的建议，使用 `AtomicLong` 类。`volatile` 只提供了同步的通信效果，但这个包还额外提供了原子性：

// Lock-free synchronization with java.util.concurrent.atomic  
private static final AtomicLong nextSerialNum = new AtomicLong();  
  
public static long generateSerialNumber() {  
    return nextSerialNum.getAndIncrement();  
}

### 总结

避免本条目中所讨论到的问题的最佳办法是不共享可变的数据。要么共享不可变的数据（详见第 17 条），要么压根不共享。换句话说，将可变数据限制在单个线程中。如果采用这一策略，就要为它建立文档，以便它可以随着程序的发展得到维护。

深刻地理解正在使用的框架和类库也很重要，因为它们引入了你不知道的线程。

一个线程暂时修改一个数据对象，然后与其他线程共享，只同步共享对象引用的行为，这是可以接受的。之后，其他线程不需要同步也可以读取对象，只要这个对象没有再被修改。 这样的对象被认为是有效的不可变（effectively immutable）。将这样的对象引用从一个线程转移到其他线程被称为安全发布（safe publish）。有许多方法可以安全地发布对象引用：可以把它存储在 static 域中，作为类初始化的一部分；可以把它保存在volitale 域、final 域或者一个通过锁来访问的域；或者你可以把它放到并发集合中（第 81 项）。（TODO：最后一句话没看明白。）

总之，当多个线程共享可变数据时，每个读取或写入数据的线程必须执行同步。在没有同步的情况下，不能保证一个线程的改变对另一个线程是可见的。未能同步共享的可变数据可能造成活性失败和安全性失败。这些故障是最难调试的故障之一。它们可能是间歇性的，且与时间相关，程序的行为在不同的虚拟机上可能根本不同。如果只需要线程之间的交互通信，而不需要互斥， volatile 修饰符就是一种可以接受的同步形式，但要正确地使用它可能需要一些技巧。

## 79. 避免过度同步

### 不要在同步区域调用外来方法

#### 什么是外来方法

在同步区域内，不要调用被设计成继承的方法，或者是客户端以函数对象形式提供的方法（详见第 24 条）。这些方法对于有同步区域的类来说是外来方法（alien method）。这个类对于这些方法一无所知，并且不能控制这些方法。如果在同步区域调用外来方法，可能会导致异常、死锁或数据损坏。

> 外来方法就相当于把在同步区域具体做的部分事情交给客户端来实现。

#### 外来方法可能的危害

下面这个类实现了一个 observable set 包装类，它允许客户端在元素被添加到集合中时订阅通知。为了简洁起见，该类不提供元素从集合中移除时的通知。这个类是在第 18 条中的 ForwardingSet 之上实现的。

// Broken - invokes alien method from synchronized block!  
public class ObservableSet<E> extends ForwardingSet<E> {  
    public ObservableSet(Set<E> set) { super(set); }  
      
    private final List<SetObserver<E>> observers = new ArrayList<>();  
      
    public void addObserver(SetObserver<E> observer) {  
        synchronized(observers) {  
            observers.add(observer);  
        }  
    }  
      
    public boolean removeObserver(SetObserver<E> observer) {  
        synchronized(observers) {  
            return observers.remove(observer);  
        }  
    }  
      
    private void notifyElementAdded(E element) {  
        synchronized(observers) {  
            for (SetObserver<E> observer : observers)  
                observer.added(this, element);  
        }  
    }  
  
    @Override   
    public boolean add(E element) {  
        boolean added = super.add(element);  
        if (added)  
            notifyElementAdded(element);  
        return added;  
  
    }  
  
    @Override   
    public boolean addAll(Collection<? extends E> c) {   
        boolean result = false;  
        for (E element : c)  
            result |= add(element); //CallsnotifyElementAdded return result;  
    }   
    return result;  
}

观察者可以通过 `addObserver` 订阅通知，或者通过 `removeObserver` 取消订阅。这两种方式，这个回调(callback）接口的一个实例都会被传递给方法：

@FunctionalInterface   
public interface SetObserver<E> {  
    // Invoked when an element is added to the observable set  
    void added(ObservableSet<E> set, E element);  
}

> 这个接口的结构和 `BiConsumer<ObservaleSet<E>, E>` 相同，但没用它的原因是，`SetObserver` 和 `added` 的名称都具有更好的可读性，并且这个接口可以发展整合多个回调。也就是说，还可以设置合理的参数来使用 `BiConsumer`（TODO：没看明白）。

如果只是像下面这样简单使用 `ObservableSet`，那么就不会出错。

public static void main(String[] args) {  
    ObservableSet<Integer> set = new ObservableSet<>(new HashSet<>());  
    set.addObserver((s, e) -> System.out.println(e));  
    for (int i = 0; i < 100; i++)  
        set.add(i);  
}

##### 导致异常

但如果复杂点，假设传递一个观察者给 `addObserver`，这个观察者在 23 被添加到集合到时候，会取消订阅：

set.addObserver(new SetObserver<>() {  
    public void added(ObservableSet<Integer> s, Integer e) {  
        System.out.println(e);  
        if (e == 23)  
            s.removeObserver(this);  
    }   
});

> 这个观察者使用匿名类来实现的，因为它需要将自身传递给 `removeObserver` 方法，而在 lambda 表达式中不能获取自身。

这个程序会在集合添加 23 后，抛出 `ConcurrentModificationException`。原因在于，当 `notifyElementAdded` 调用观察者的 `added` 方法时，它正处于对 `observers` 列表的迭代中。而在 `added` 方法中调用了 `ObservableSet` 的 `removeObserver` 方法，后者又调用了 `observers.remove` 方法。在列表的迭代过程中从列表中删除一个元素，这是不合法的。`notifyElementAdded` 方法中的迭代是在一个同步块中进行的，以防止并发修改，但这并不能阻止迭代线程本身回调到可观察集并修改其观察员列表。

> 这个问题是由于在迭代集合的过程中，删除了集合的元素造成的。并不是因为在同步中删除元素，因为 `removeObserver` 方法依然和集合迭代在同一个同步区域中。这个问题主要就是想说明在同步区域中不要调用外部方法，可能导致出现异常、死锁和数据损坏。试想，上面客户端自定义的观察者在内部无限循环，也就是无限占有锁，那就会导致整个 `ObservableSet` 实例都不可用了。

##### 死锁

下面尝试一个奇怪的做法：编写一个观察者，它同样尝试取消自己的订阅，但不通过直接调用 `removeObserver` 方法，而是通过使用 `ExecutorService` 来让另一个线程代替自己完成任务。

// Observer that uses a background thread needlessly  
set.addObserver(new SetObserver<>() {  
    public void added(ObservableSet<Integer> s, Integer e) {  
        System.out.println(e);  
        if (e == 23) {  
            ExecutorService exec = Executors.newSingleThreadExecutor();  
            try {  
                exec.submit(() -> s.removeObserver(this)).get();  
            } catch (ExecutionException | InterruptedException ex) {   
                throw new AssertionError(ex);  
            } finally {  
                exec.shutdown();  
            }   
        }  
    }   
});

> catch 子句中使用了 Java 7 中新增的多重捕获（multi-catch）机制，它能能极大提高代码的清晰度，并且在程序对多种异常做出的行为相同时，能减少代码的篇幅。

程序运行后，不会出现异常，但会进入死锁。原因是，后台线程调用 `s.removeObserver` 会尝试获得 `observers` 的锁，但主线程持有锁且没有释放锁。

这种写法虽然很奇怪，但出现的问题却很常见。在同步区域内调用外来方法在很多真实系统中造成了许多死锁，比如 GUI 工具箱。

#### 数据损坏

当外来方法（`added`）被调用时，同步区域所保护的资源（`observers`）处于一致的状态。假设你从同步区域调用一个外来方法，而这个方法会对被保护的资源进行修改（因为 synchronized 是可重入锁，所以不会抛异常）。那么这个资源上的锁就并没有成功保护这个资源。

可重入锁简化了并发面向对象程序的编程，但它们也可以将活性失败转为安全性失败。

### 将外来方法移出同步区域

#### 对保护数据拍快照

对于 `notifyElementAdded` 方法，可以给 `observers` 拍快照，那么即使没有锁，也可以安全遍历这个列表了：

// Alien method moved outside of synchronized block - open calls  
private void notifyElementAdded(E element) {  
    List<SetObserver<E>> snapshot = null;  
    synchronized(observers) {  
        snapshot = new ArrayList<>(observers);  
    }  
    for (SetObserver<E> observer : snapshot)  
        observer.added(this, element);  
}

这样，前面的问题就不会再发生了。

#### 并发集合

针对这个例子，更好的「将外来方法移出同步区域」方式是使用并发集合中的 `CopyOnWriteArrayList`，它几乎就是为这个需求专门定制的。它所有的写操作都是在底层数组的最新副本上实现的。因为底层数组永远不会被修改，所以迭代不需要加锁，因此速度很快。对于大多数用途来说，`CopyOnWriteArrayList` 的性能是非常糟糕的，但是对于 `observers` 来说，它是完美的，因为它很少被修改，而且经常被遍历。

`add` 和 `addAll` 方法不需要改动，此时没有任何显式的同步：

// Thread-safe observable set with CopyOnWriteArrayList  
private final List<SetObserver<E>> observers = new CopyOnWriteArrayList<>();  
  
public void addObserver(SetObserver<E> observer) {  
    observers.add(observer);  
}  
  
public boolean removeObserver(SetObserver<E> observer) {  
    return observers.remove(observer);  
}  
  
private void notifyElementAdded(E element) {  
    for (SetObserver<E> observer : observers)  
        observer.added(this, element);  
}

### 同步带来的性能问题

在 Java 早期，同步的成本就已经下降了，但仍然不要过度同步。在多核时代，过度同步的真正成本不是 CPU 花在获取锁上的时间；而是 contention：失去并行的机会，以及由于需要确保每个核对内存有一个一致的视图而造成的延迟。过度同步的另一个隐藏成本是，它可以限制虚拟机优化代码执行的能力。

#### 解决办法

如果正在编写一个可变的类，有两个选择：

1.  忽略所有的同步，让客户端在有并发需求的时候自行同步；
    
2.  在类中实现内部同步，使这个类成为线程安全的（详见第 82 条）。
    

只有当你用内部同步实现的并发性明显高于让客户在外部锁定整个类实例时，你才应该选择第二种方案。java.util 中的集合（除了过时的 Vector 和 Hashtable 之外）采用前者，而 java.util.concurrent 中的集合则采用后者（详见第 81 条）。当你不确定的时候，就不要使用内部同步，而应该建立文档，注明它不是线程安全的 。

> 在 Java 早期，许多类违法了这些方针。如 `StringBuffer` 是线程安全的，但它几乎总是被用在单线程种。所以 `StringBuilder` 取代了它，`StringBuilder` 就是一个非同步的 `StringBuffer`。类似的， java.util.Random 中线程安全的伪随机数生成器，被 java.util.concurrent.ThreadLocalRandom 中非同步的实现取代。

有一种情况必须使用内部同步：如果一个方法修改了 static 的域，并且该方法可能被多个线程调用，那么就必须在内部对该域的访问做同步（除非这个类可以容忍不确定的行为）。因为如果在该方法中没有对被修改的 static 域同步，当方法被多线程调用后，即使方法被同步了，也保护不到 static 域（因为它是属于类的，需要对类同步）。

> TODO：这一段的原文在下面，还是不是很明白：
> 
> If a method modifies a static field and there is any possibility that the method will be called from multiple threads, you _must_ synchronize access to the field internally (unless the class can tolerate nondeterministic behavior). It is not possible for a multithreaded client to perform external synchronization on such a method, because unrelated clients can invoke the method without synchronization. The field is essentially a global variable even if it is private because it can be read and modified by unrelated clients. The nextSerialNumber field used by the method generateSerialNumber in Item 78 exemplifies this situation.

### 总结

本节说的过度同步，不是指少用锁，而是指同步区域尽可能小。通常来说，应该在同步区域内做尽可能少的工作：获得锁，检查共享数据，根据需要转换数据，然后释放锁。 如果你必须要执行某个很耗时的动作，则应该设法把这个动作移到同步区域的外面，而不违背第 78 条中的指导方针。并且，同步区域越小，并发性越高。还有，千万不要在同步区域内调用外部方法。

当你在设计一个可变类的时候，要考虑一下它们是否应该自己完成同步操作。在多核时代，这比永远不要过度同步来得更重要。只有当你有足够的理由一定要在类的内部同步的时候，才应该这么做，同时还应该将这个决定清楚地写到文档中（详见第 82 条)。

## 80. executor、task 和 stream 优于 thread

### Executor Framework

java.util.concurrent 中包含了一个 Executor Framework，这是一个灵活的基于接口的任务执行工具：

ExecutorService exec = Executors.newSingleThreadExecutor();

执行一个 runnable：

exec.execute(runnable);

终止（如果不手动终止，VM 可能就不会退出）：

exec.shutdown();

> 使用 executor service 还可以完成很多事，比如，等待指定任务完成（使用 `get` 方法）、等待任务集合中任意或所有的任务完成（使用 `invokeAny` 或 `invokeAll` 方法）、等待 executor service 终止（使用 `awaitTermination` 方法）、在任务完成后逐一遍历结果（使用 `ExecutorCompletionService`）、调度任务在特定时间或周期性执行（使用 `ScheduledThreadPollExecutor`）等等。

如果想让不止一个线程来处理请求，只要调用一个不同的静态工厂，它创建一个不同种类的 executor service，称作线程池。可以创建线程数量固定或可变的线程池。`java.util.concurrent.Executors` 类提供了所需的大多数 executors。如果没有需要的，可以直接使用 `ThreadPoolExecutor` 类，它可以自定义线程池操作的几乎每一方面。

### 如何选择 executor service

如果是一个小程序，或者是轻量负载的服务器，`Executors.newCachedThreadPool` 通常都会是个很好的选择。因为它不需要配置，并且在一般情况下都能正确工作。但是 cached thread pool 并不适合高负载的生产服务器。因为在 cached thread pool 中，提交的任务并没有进入队列，而是直接交给一个线程去执行。如果没有可用的线程，就会创建一个新的。如果一台服务器的负载很高，以至于所有的 CPU 都被完全利用了，而更多的任务到来，更多的线程将被创建，这只会让情况更坏。因此在这种情况下最好使用 `Executors.newFixedThreadPool`，它提供一个有固定数量线程的线程池，或者直接使用`ThreadPoolExecutor` 类，以获得最大的控制。

### 避免直接使用线程

不仅应该避免编写自己的工作队列，而且一般来说，应该避免直接使用线程。当直接使用线程时，线程既是一个工作单位，又是执行机制。在 executor framework 中，工作单位和执行机制是分开的。

工作单位，也就是任务。有两种类型的任务，`Runnable` 和 `Callable`（它比 `Runnable` 多了返回值并可以抛出任意的异常）。

执行任务的一般机制是 executor service。如果你以任务的角度思考，并让 executor service 为你执行任务，在选择适当的执行策略方面就获得了极大的灵活性。从本质上讲，Executor Framework 所做的工作是执行，Collections Framework 所做的工作是聚合 (aggregation)。

在 Java 7 中，Executor Framework 得到了扩展，它可以支持 fork-join 任务了，这些任务是通过一种特殊的executor service —— fork-join pool 执行的 。一个 fork-join 任务用一个 `ForkJoinTask` 实例表示，它可以被分成更小的子任务，包含 `ForkJoinPool` 的线程不仅要处理这些任务，还要从另一个线程中 “偷” 任务，以确保所有的线程保持忙碌，从而提高 CPU 使用率和吞吐量，并降低延迟。fork-join 任务的编写和调优是很有技巧的。并发的 stream（详见第 48 条）是在 fork-join pool 上编写的，可以简单的就能利用到 fork-join pool 的性能优势，但使用的前提是它们正好适用于当前的任务。

> 1.  Executor Framework 的完整处理方法超出了本书的讨论范围，但是有兴趣的读者可以参阅《 Java Concurrency in Practice》 一书。
>     
> 2.  Fork-join pool：[https://www.infoq.cn/article/fork-join-introduction](https://www.infoq.cn/article/fork-join-introduction)
>     

## 81. 并发工具优于 wait 和 notify

java.util.concurrent 提供的高级并发工具分为三类：

-   Executor Framework，在第 80 条中简要介绍了；
    
-   并发集合；
    
-   同步器。
    

### 并发集合

并发集合是标准集合接口，如 List、Queue 和 Map 的高性能并发实现。为了提供高并发，这些实现采用了内部同步。

#### 原子性调用多方法

因为无法排除并发集合中的并发活动，这也意味着无法在并发集合中组成原子性的多方法调用。因此，有些并发集合接口配备了依赖状态的修改操作（state-dependent modify opreations），这些操作将几个原始操作组合成一整个原子操作。这些操作被证明很有用，所以 Java 8 中，在这些并发集合对应的集合接口中也添加了这些操作。例如，Map 的 `putIfAbsent(key, value)` 方法，如果 key 不存在则插入 value 并返回 null，如果 key 存在，则返回 key 映射的 value。

> 也就是说，如果没有 `putIfAbsent` 方法，ConcurrentHashMap 先 get 再 put 的中间可能导致并发问题。而在 get 和 put 调用的外部使用同步，只会使程序更慢。

下面这个方法模拟了 `String.intern` 的行为：

// Concurrent canonicalizing map atop ConcurrentMap - not optimal  
private static final ConcurrentMap<String, String> map =   
    											new ConcurrentHashMap<>();  
  
public static String intern(String s) {  
    String previousValue = map.putIfAbsent(s, s);  
    return previousValue == null ? s : previousValue;  
}

还可以进行优化。`ConcurrentHashMap` 对查找操作进行了优化，如 `get`。因此，更好的做法的是先调用 `get`，然后根据 `get` 的结果决定是否调用 `putIfAbsent`。

// Concurrent canonicalizing map atop ConcurrentMap - faster!  
public static String intern(String s) {  
    String result = map.get(s);  
    if (result == null) {  
        result = map.putIfAbsent(s, s);  
        if (result == null)  
            result = s;  
    }  
    return result;  
}

Concurrent collections 使 synchronized collections 大多数被废弃了。例如，优先使用 `ConcurrentMap` 而不是 `Collections.synchronizedMap`。

> Synchronized collections 和对应 collection 的每个方法都相同，只是前者用 synchronized 将几乎每个方法的内部包起来。

#### 阻塞操作

有些集合接口拓展出了阻塞操作，它们会一直等待（或阻塞）直到可以被成功执行。例如 `BlockingQueue` 扩展了 `Queue` 接口，包括 `take`。它删除并返回队首元素，如果队列为空则阻塞。这就使 `BolckingQueue` 可以用于 work queue（也被称为 producer-consumer queue）。

> 大多数 `ExecutorService` 的实现，包括 `ThreadPoolExecutor`，都使用了 `BlockingQueue`。

### 同步器

同步器可以使线程之间互相等待，使它们能协调它们的动作。最常用的同步器是 `CountDownLatch` 和 `Semaphore`；不太常用的是 `CyclicBarrier` 和 `Exchanger`；最强大的是 `Phaser`。

`CountdownLatch` 是一次性使用的 barrier，它允许一个或多个线程等待一个或多个其他线程做些事情。`CountdownLatch` 的唯一构造方法只有一个 `int` 参数，它代表了在所有等待的线程被允许继续进行之前必须在 latch 上调用 `countDown` 方法的次数。

在这个简单的基本类型上可以简单地构建出很多有用的东西。例如，实现一个简单的框架为并发执行的 action 计时。这个框架只有一个方法，它需要一个 executor 来执行 action，一个代表执行 action 的并发线程数量的 concurrency level，以及一个代表 action 的 `Runnable`。

// Simple framework for timing concurrent execution  
public static long time(Executor executor, int concurrency,  
                        Runnable action) throws InterruptedException {  
    CountDownLatch ready = new CountDownLatch(concurrency);  
    CountDownLatch start = new CountDownLatch(1);  
    CountDownLatch done  = new CountDownLatch(concurrency);  
    for (int i = 0; i < concurrency; i++) {  
        executor.execute(() -> {  
            ready.countDown(); // Tell timer we're ready  
            try {  
                start.await(); // Wait till peers are ready  
                action.run();  
            } catch (InterruptedException e) {  
                Thread.currentThread().interrupt();  
            } finally {  
                done.countDown();  // Tell timer we're done  
            }  
        });   
    }  
    ready.await(); // Wait for all workers to be ready   
    long startNanos = System.nanoTime();   
    start.countDown(); // And they're off!  
    done.await(); // Wait for all workers to finish   
    return System.nanoTime() - startNanos;  
}

-   参数 executor 必须支持创建数量大于等于 concurrency level 的线程，否则这个测试就会进入饥饿死锁；
    
-   如果工作线程捕捉到了 `InterruptedException`，就会使用习惯用法`Thread.currentThread().interrupt()` 重新断言这个中断，并从它的 run 方法中返回。这样就允许 executor 可以在其认为合适的时候处理中断。
    
-   对于区间计时，优先使用 `System.nanoTime` 而不是 `System.currentTimeMillis`。前者比后者更准确也更精确，并且不受系统实时时钟的影响；
    
-   注意本例代码并不能准确及时，除非 action 的工作需要执行至少一秒。
    

> 本条只涉及到同步器的皮毛，事实上上面的三个 `CountDownLatch` 可以只用一个 `SyclicBarrier` 或 `Phaser` 实例代替，得到的代码会更简洁，但也可能更难理解。

### 维护遗留的 wait 和 notify

#### 如何使用 wait

`wait` 方法用来使线程等待某个条件。它必须在同步区域被调用，且调用 `wait` 的对象是同步区域所同步的对象。下面是 `wait` 的标准习惯用法：

// The standard idiom for using the wait method  
synchronized (obj) {  
    while (<condition does not hold>)  
        obj.wait(); // (Releases lock, and reacquires on wakeup)   
    ... // Perform action appropriate to condition  
}

**永远使用 wait-loop 形式来调用 wait 方法，永远不要再循环外面调用它。**这个循环可以在等待前和等待后对条件进行测试：

-   在等待之前测试，如果条件成立就跳过等待，这对确保 liveness 是有必要的。如果把循环换成 if，假设条件已经成立，并且在线程 wait 之前已经调用了`notify`（或 `notifyAll`）方法，就不能保证线程会从等待中醒来；
    
    > TODO；原文如下，看不懂
    > 
    > Testing the condition before waiting and skipping the wait if the condition already holds are necessary to ensure liveness. If the condition already holds and the notify (or notifyAll) method has already been invoked before a thread waits, there is no guarantee that the thread will _ever_ wake from the wait.
    
-   在等待之后测试条件，如果条件不成立的话继续等待，这对于确保 safety 是必要的。如果把循环换成 if，假设条件不成立，线程调用了 wait 进入等待，但在有些情况下线程可能被唤醒从而继续运行，这就可能破坏被锁保护的约束关系（invariant）。这些情况包括：
    
    -   在一个线程调用 `notify` 和该等待的线程醒来之间，可能有另一个线程已经获得了锁并改变了被保护的状态。
        
        > TODO：原文如下，看不懂
        > 
        > Another thread could have obtained the lock and changed the guarded state between the time a thread invoked notify and the waiting thread woke up.
        
    -   条件并不成立，但是另一个线程可能有意或无意调用了 `notify` 方法。在 public 对象的同步区域内调用它的 wait 方法就很容易出现这样的问题。
        
    -   即使只有某些等待线程的条件已经被满足，但是通知线程（notifying thread）可能仍然调用 `notifyAll` 方法。
        
    -   在没有 notify 的情况下，等待线程也可能（但很少）会苏醒过来，这被称为 “伪唤醒”。
        

#### notify 还是 notifyAll

一种常见的说法是，应该始终使用 `notifyAll` 方法。这是合理而保守的建议。它总会产生正确的结果，因为它可以保证将会唤醒所有需要被唤醒的线程。 虽然也可能会唤醒其他一些线程，但是这不会影响程序的正确性。 这些线程醒来之后，会检查它们正在等待的条件，如果发现条件并不满足，就会继续等待。

从优化的角度来看，如果处于等待状态的所有线程都在等待同一个条件，而每次只有一个线程可以从这个条件中被唤醒，那么就应该选择调用 `notify` 方法，而不是 `notifyAll` 方法 。

即使这些前提条件都满足，也许还是有理由使用 `notifyAll` 方法而不是 `notify` 方法。就好像把 wait 方法调用放在一个循环中，以避免在 public 对象上的意外或恶意的 `notify` 一样，使用 `notifyAll` 方法代替 `notify` 方法可以避免唤醒意外或恶意等待中的不相关线程。

### 总结

总而言之，直接使用 wait 方法和 notify 方法就像用 ”Java 并发汇编语言“ 进行编程一样， 而 java.util.concurrent 则提供了更高级的语言。不要在新代码中使用 wait 方法和 notify 方法。如果维护使用 wait 方法和 notify 方法的代码，务必确保始终使用 wait-loop 来调用 `wait` 方法。一般情况下，应该优先使用 `notifyAll` 方法，而不是使用 `notify` 方法；如果使用 `notify` 方法，一定要小心。

## 82. 文档化线程的安全性

“如果方法的文档中出现 synchronized 修饰符，则说明这个方法是线程安全的。” 这种说法是错误的，在正常情况下，Javadoc 在输出中并不包含 synchronized 修饰符，因为方法声明中的 synchronized 修饰符是实现细节，而不是 API 的一部分。它并不一定能表明这个方法是线程安全的。

并且，上面的说法就是认为线程安全是个非黑即白的属性。但事实上，线程安全有好几种等级。为了实现安全的并发使用，类必须清楚记录它所支持的线程安全等级。下面列出了部分线程安全等级，包括了大部分情况：

-   不可变的：这个类的实例是不可变的，所以不需要任何外部同步。例如 `String`、`Long` 和 `BigInteger`（详见第 17 条）；
    
-   无条件的线程安全：这个类的实例是可变的，但是类有足够的内部同步，使得它的实例不需要任何外部同步即可在并发中使用。例如 `AtomicLong` 和 `ConcurrentHashMap`；
    
-   有条件的线程安全：类似无条件的线程安全，但有一些方法会需要外部同步。例如被 `Collections.synchronized` 包装返回的集合，它们的迭代器要求外部同步；
    
-   非线程安全：这个类的实例是可变的，为了并发使用它们，必须使用外部同步来包围每个方法调用（或方法调用序列）。如 `ArrayList` 和 `HashMap`；
    
-   线程对立（Thread-hostile）：在并发中，即使每个方法调用都使用了外部同步，这个类也是不安全的。线程对立通常是由于在没有同步的情况下修改静态数据造成的。没有人故意写一个线程敌对的类，这种类通常是由于没有考虑到并发性而导致的。当一个类或方法被发现对线程有敌意时，它通常会被修复或废弃。如第 78 项中的 `generateSerialNumber` 方法在没有内部同步的情况下将是线程对立的（详见第 322 页）。
    

> 上面的分类（除了线程对立）都大致和《Java Concurrency in Practice》书中的 thread safety annotations 对应，它们分别是 `Immutable`、`ThreadSafe` 和 `NotThreadSafe`。无条件的线程安全和有条件的线程安全都包括在 `ThreadSafe` 注解里。

在写有条件线程安全类的文档时要十分注意，必须指明哪些调用序列需要外部同步，还要指明哪一个锁（少数情况下可能是好几个锁）必须获得，才能执行这些调用序列。通常情况下，这个锁都是实例自身，但也有例外。比如，`Collections.synchronizedMap` 的文档有这样的说明：

It is imperative that the user manually synchronize on the returned map when iterating over any of its collection views:  
Map<K, V> m = Collections.synchronizedMap(new HashMap<>());  
Set<K> s = m.keySet();  // Needn't be in synchronized block  
	...  
synchronized(m) {  // Synchronizing on m, not s!  
    for (K key : s)  
        key.f();  
}

类的线程安全说明通常放在类的文档注释中，但是有特殊线程安全属性的方法应该在自己的文档注释中作出说明这些属性。没有必要说明枚举类型的不可变性。静态工厂必须注明返回对象的线程安全（除非这在返回类型中很明显），例如上面的 `Collections.synchronizedMap`。

当一个类使用一个 public 锁时，它就允许了客户端可以原子性地调用一系列方法（个人理解：因为客户端能拿到这个类使用的锁，也就可以使用这个锁同时来同步这个类的一系列方法，从而做到原子性），但是这种灵活性是要付出代价的。它与高性能的内部并发控制不兼容，例如 `ConcurrentHashMap` 等并发集合所使用的那种。同样，客户端可以有意或无意通过长期占有这个 public lock 来发起（mount）拒绝服务攻击（denial-of- service attack）。

为了防止拒绝服务攻击，可以改用一个 private 锁对象来代替使用 synchronized 修饰的方法（这种方法实际上提供了 public 锁对象，也就是这个类的实例）：

// Private lock object idiom - thwarts denial-of-service attack  
private final Object lock = new Object();  
  
public void foo() {  
    synchronized(lock) {  
        ...   
    }  
}

实际上这里使用了第 15 条的建议，把锁对象封装在它所同步的对象中。这个锁被声明为 `final`，这防止不小心改变了它的内容，从而导致灾难性地非同步访问（详见第 79 条）。这也是在用第 17 条的建议，最小化锁域的可修改性。无论使用普通的监视器锁还是 `java.util.concurrent.locks` 包中的锁，都应该将锁域声明为 `final` 的。

private 锁对象模式只可以用于无条件线程安全的类。有条件线程安全的类不能用，因为它们必须注明客户端在执行某个方法调用序列的时候需要获得哪些锁。

private 锁对象模式尤其适合那些专门为继承设计的类（详见第 19 条）。如果这种对象使用它们的实例作为锁，子类就可能很轻松地干涉父类的操作，反之亦然。这种情况在 `Thread` 类上出现过。

> 父类的同步方法可以被子类重写而避免同步，这是人为因素，是无论如何也解决不了的。private 锁对象模式只是在编写子类的时候，以更好的方式来不干扰父类或不让父类干扰自己。
> 
> [https://wiki.sei.cmu.edu/confluence/display/java/TSM00-J.+Do+not+override+thread-safe+methods+with+methods+that+are+not+thread-safe](https://wiki.sei.cmu.edu/confluence/display/java/TSM00-J.+Do+not+override+thread-safe+methods+with+methods+that+are+not+thread-safe)
> 
> 不过这段话还是不是很能看懂，原文（TODO）：
> 
> The private lock object idiom is particularly well-suited to classes designed for inheritance (Item 19). If such a class were to use its instances for locking, a subclass could easily and unintentionally interfere with the operation of the base class, or vice versa. By using the same lock for different purposes, the subclass and the base class could end up “stepping on each other’s toes.” This is not just a theoretical problem; it happened with the Thread class [Bloch05, Puzzle 77].

总而言之，每个类的文档都应该清楚地注明它的线程安全属性，`synchronized` 修饰符与这个文档没有任何关系。有条件的线程安全类必须注明哪些方法调用序列需要外部同步，以及在执行这些序列的时候要获得哪个锁。在编写无条件的线程安全类的时候，可以考虑 private 锁对象来代替同步方法。这可以保护同步时不受来自客户端和子类的干扰，并使你在以后的版本中更灵活地对并发控制采用更加复杂的方法。

## 83. 慎用懒加载

### 什么是懒加载

懒加载是将域的初始化推迟到需要它的值时才进行。如果永远不需要它的值，这个域就永远不会被初始化。这种方式适用于 static 域和实例域。虽然懒加载主要是一种优化，但它也可以用来打破类和实例初始化中的有害循环（harmful circularities，TODO：什么是有害循环）。

正如第 67 条所说，和大多数优化一样，对懒加载最好的建议就是「除非需要，否则不要做」。懒加载是一把双刃剑，它降低了初始化类或创建实例时的开销，但也增加了访问被懒加载的域的开销。根据这些域中最终需要初始化的部分、初始化它们的成本有多高、以及每个域在初始化后被访问的频率，懒加载（像许多 "优化" 一样）可能会损害性能。尽管如此，懒加载也有其用途。如果一个域只在一个类的一部分实例上被访问，并且初始化该域的成本很高，那么懒加载可能是值得的。唯一能确定的方法是测量有无懒加载的类的性能。

在有多个线程的情况下，懒加载是很棘手的。如果多个线程共享一个懒加载的域，就必须采用某种形式的同步，否则会产生严重的错误（详见第 78 条）。本条中讨论的所有初始化技术都是线程安全的。

### 正常的初始化和懒加载

在大多数情况下，正常的初始化都优于懒加载。下面是正常初始化实例域的典型例子：

// Normal initialization of an instance field  
private final FieldType field = computeFieldValue();

如果使用懒加载来破坏初始化循环（initialization circularity），要使用一个同步的访问方法，因为这是最简单清楚的方法：

// Lazy initialization of instance field - synchronized accessor  
   
private FieldType field;  
private synchronized FieldType getField() {   
    if (field == null)  
        field = computeFieldValue();  
    return field;  
}

这两种方法应用到 static 域时保持不变，除了要在域和访问器声明中加上 static 修饰符。

### 更好的使用懒加载

#### static 域

如果需要在 static 域上使用懒加载，使用 lazy initialization holder class 模式。这种模式保证了类直到被使用的时候才会初始化：

// Lazy initialization holder class idiom for static fields  
private static class FieldHolder {  
	static final FieldType field = computeFieldValue();  
}  
  
private static FieldType getField() {   
    return FieldHolder.field;   
}

当第一次调用 `getField` 方法的时候，它第一次读取 `FieldHolder.field`，导致 `FieldHolder` 类的初始化。这种用法的好处是，`getField` 方法没有被同步，且只执行了一个域的访问，所以懒加载实际上没有增加任何访问的成本。现代的 VM 将在初始 化该类的时候，同步域的访问。一旦这个类被初始化，VM 将修补代码，以便后续对该域的访问不会导致任何测试或者同步 。

#### 实例域

#### double-check

如果需要在实例域上使用懒加载，使用双重检查模式。这种模式避免了域加载之后的访问还需要加锁（详见第 79 条）。因为如果域被初始化之后，就不会再有同步了，所以必须将这个域声明为 `volatile`：

// Double-check idiom for lazy initialization of instance fields   
private volatile FieldType field;  
  
private FieldType getField() {  
    FieldType result = field;  
    if (result == null) {  // First check (no locking)  
        synchronized(this) {  
            if (field == null)  // Second check (with locking)  
                field = result = computeFieldValue();  
        }   
    }  
    return result;  
}

`getField` 方法中使用了 `result` 变量，它的作用是确保在已经初始化的常见情况下，域只被读取一次。虽然不是严格意义上的必要，但这可能会提高性能，而且按照适用于低级并发编程的标准，这样做更优雅。在作者的机器上，上述方法的速度大约是没有局部变量的明显版本的 1.4 倍。（因为在本地方法栈中？）

> 虽然也可以对懒加载的 static 域使用双重检查模式，但没有必要，因为 lazy initialization holder class 模式更好。

#### single-check

有时可能需要懒加载一个可以容忍重复初始化的实例域，可以使用双重检查模式的一个变体，它省去了第二次检查。这就是所谓的单次检查模式。下面是它的样子。注意，域仍然被声明为 `volatile`：

// Single-check idiom - can cause repeated initialization!   
private volatile FieldType field;  
private FieldType getField() {  
    FieldType result = field;  
    if (result == null)  
        field = result = computeFieldValue();  
    return result;  
}

> 本条目中讨论的所有初始化方法都适用于基本类型的域，也适用于对象引用域。当对数值型基本类型域使用双重检查或单次检查模式的时候，就会用 0 来检查这个域的值而不是 null。

#### racy single-check

当使用单次检查模式时，如果并不在意**每个**线程都重新计算域的值，并且域是基本类型（除了 `long` 和 `double`），那么就可以选择从域的声明处删除 `volatile` 修饰符。这种变体称作 racy single-check 模式。它加快了某些架构上的域访问。代价是增加了额外的初始化（每个访问域的线程最多初始化一次）。这显然是一种特殊的方法，不适合日常使用。

> TODO：这两种 single-check 的区别就是第一种重复初始化的次数会少一点？

## 84. 不要依赖线程调度器

当多个线程可以运行时，线程调度器决定了哪个运行，以及运行多久。每个操作系统都会试图让这个决定变得公正，但它们的策略不同。**任何依赖于线程调度器来达到正确性或性能要求的程序，很有可能都是不可移植的。**

### 可运行线程平均数量以及所做的任务

编写健壮、响应快、可移植的程序，最好的办法是确保可运行线程的平均数量不明显大于处理器的数量。这使得线程调度器没有什么选择：它只是运行可运行的线程，直到它们不再可运行。即使在完全不同的线程调度策略下，程序的行为也不会有太大的变化。请注意，可运行线程的数量并不等同于线程的总数，后者可能要高得多，正在等待的线程是不能运行的。

保持可运行线程数量少的主要方法是让每个线程做一些有用的工作，然后等待更多。如果线程不做有用的工作，它们就不应该运行。就 Executor Framwork（详见第 80 条）而言，这意味着要适当调整线程池的大小，并保持任务简短，但不能太短，否则调度开销会损害性能。

> 这里的可运行指的是 runnable，而并不是 running。

### 不要让线程处于忙等

线程不应忙于等待（busy-wait），即反复检查共享对象，等待其状态变化。除了使程序容易受到线程调度器的影响外，忙碌等待还大大增加了处理器的负载，减少了其他线程可以完成的有用的工作量。作为一个不应该做的反面例子，考虑一下`CountDownLatch` 的这个反常的重新实现：

// Awful CountDownLatch implementation - busy-waits incessantly!  
public class SlowCountDownLatch {  
    private int count;  
    public SlowCountDownLatch(int count) {  
        if (count < 0)  
            throw new IllegalArgumentException(count + " < 0");  
        this.count = count;  
    }  
  
    public void await() {  
        while (true) {  
            synchronized(this) {  
                if (count == 0)  
                    return;  
            }   
        }  
    }  
  
    public synchronized void countDown() {  
        if (count != 0)  
            count--;  
    }   
}

在作者的机器上，当 1000 个线程在 latch 上等待时，`SlowCountDownLatch` 比 `CountDownLatch` 慢了 10 倍。 虽然这个例子看起来有点牵强，但在很多系统上，都存在一个或多个线程处于没必要的可运行状态。性能和可移植性都可能受到影响。

### 谨慎使用 Thread.yield

当面对一个因为某些线程相对于其他线程没有获得足够的 CPU 时间而勉强运行的程序时，不要通过调用 `Thread.yield` 来 "修复" 程序。虽然可能会在某种程度上成功地让程序工作，但它将无法被移植。同样的 `yield` 调用，在一个 JVM 实现上可能可以提升性能，但在第二个 JVM 实现上可能会降低性能，也可能在第三个 JVM 实现上它没有任何效果。`Thread.yield` 没有可测试的语义（testable semantic，TODO：什么叫可测试）。一个更好的做法是重构应用程序，以减少可并发运行的线程数量。

### 谨慎调整线程优先级

一个相关的方法是调整线程优先级，但这种方法也有类似的注意事项。线程优先级是 Java 中最不容易移植的特性之一。通过调整一些线程的优先级来调整应用程序的响应速度不是没有道理的，但这很少是必要的，并且是不可移植的。千万不要通过调整线程优先级来解决一个严重的活性问题，除非找到并解决根本原因，否则这个问题很可能会重新出现。

### 总结

总而言之，不要依赖线程调度器来保证你程序的正确性。这样的程序既不健壮，也不容易移植。作为一个推论，不要依赖 `Thread.yield` 或线程优先级。这些设施只是对调度器的提示。线程优先级可以少量使用来提高一个已经工作的程序的服务质量，但它们绝不应该被用来 "修复" 一个几乎不能工作的程序。

# 十一. 序列化

对象序列化是一个 Java 框架，用来将对象编码成字节流（序列化），或者从字节流编码中重新创建对象（反序列化）。对象被序列化后，它的编码可以从一个 VM 发送到另一个 VM，或者存储在磁盘上以便以后反序列化。本章主要讨论序列化的危险性以及如何将其降至最低。

## 85. 其他方法优于 Java 序列化

### 危险的 Java 序列化

简单即可实现分布式对象对程序员来说很有吸引力，但代价是看不见的构造器和 API 与实现之间的模糊界限，以及潜在的正确性、性能、安全性和维护方面的问题。支持者们认为好处多于风险，但历史表明并非如此。

序列化的根本问题在于，它的攻击面（attack surface）过于庞大，无法防护，并且它还在不断扩大：对象图（object graphs）是通过调用 `ObjectInputStream` 上的 `readObject` 方法来反序列化的。这个方法本质上是一个神奇的构造函数，它可以实例化类路径（class path）上的几乎任何类型的对象，只要这个类型实现了 `Serializable` 接口。在反序列化字节流的过程中，这个方法可以执行任何这些类型的代码，所以所有这些类型的代码都是攻击面的一部分。

攻击面还包括 Java 类库、第三方类库以及应用程序自身中的类。即使遵守所有相关的最佳实践，并且写出了无懈可击的可序列化类，这个程序也依然是脆弱的。

> “ Java 反序列化是一个明显存在的风险，它不仅被应用直接广泛使用，也被 Java 子系统如 RMI （远程方法调用）、JMX（Java Management Extension）和 JMS（Java Messaging System）等大量地间接使用。对不被信任的流进行反序列化，可能导致远程代码执行（Remote Code Execution, RCE）、拒绝服务（Denial-of-Service, DoS），以及一系列其他的攻击 。即使应用本身没有做错任何事情，也可能受到这些攻击”。

攻击者和安全研究员都在研究 Java 类库和常用的第三方类库中可序列化的类型，寻找在反序列化过程中调用的、执行潜在危险活动的方法。这些方法被称为 gadget。多个 gadget 可以协同使用，形成一个 gadget 链。当发现一个足够强大的 gadget 链，允许攻击者在底层硬件上执行任意的本地代码，只要有机会提交一个精心制作的字节流进行反序列化，就会造成严重后果。

在不使用任何 gadget 的情况下，可以制作出需要长时间进行反序列化的简短字节流，只要引发反序列化，就可以轻松地展开一次拒绝服务攻击。这种流被称为反序列化炸弹。下面是一个例子，它只使用 `HashSet` 和一个字符串：

// Deserialization bomb - deserializing this stream takes forever  
static byte[] bomb() {  
    Set<Object> root = new HashSet<>();  
    Set<Object> s1 = root;  
    Set<Object> s2 = new HashSet<>();  
    for (int i = 0; i < 100; i++) {  
        Set<Object> t1 = new HashSet<>();  
        Set<Object> t2 = new HashSet<>();  
        t1.add("foo"); // Make t1 unequal to t2  
        s1.add(t1);  s1.add(t2);  
        s2.add(t1);  s2.add(t2);  
        s1 = t1;  
        s2 = t2;  
    }  
    return serialize(root); // Method omitted for brevity  
}

这个对象图包含了 201 个 `HashSet` 实例，每个又包含了最多 3 个对象引用。整个流的长度为 5733 字节，但在反序列化之前，总长度会爆炸式增长。问题就是反序列化一个 `HashSet` 实例需要计算它所有元素的哈希码。根 HashSet 的 2 个元素本身也是 `HashSet`，且每个也都包含 2 个 `HashSet` 元素，以此类推，直到 100 层。因此，反序列化就会造成 `hashCode` 方法调用超过 2^100 次。而且，反序列化花费的时间是无限的，而且它不会提示哪里出了错。它几乎不产生任何对象，栈深度也是有限制的。

### 跨平台的结构化数据表示法

该怎么预防这些问题呢？只要对一个不信任的字节流进行反序列化，就会将自己暴露在攻击之下。**避免序列化漏洞的最好方法是永远不要对任何东西进行反序列化。在写新系统的时候，没有理由再使用 Java 序列化。**应该使用其他机制来完成对象和字节序列之间的转化，作者将这种机制称为**跨平台的结构化数据表示法（cross-platform structured-data representations）**（其他地方可能会简单叫作序列化系统）。

最前沿的跨平台的结构化数据表示法是 JSON 和 Protocl Buffers，也被叫作 protobuf。它们最大的区别就是 JSON 是基于文本、可阅读的，但 protobuf 是二进制的，而且效率高得多；JSON 纯粹是一种数据表示法，而 protobuf 提供模式（类型）来记录和执行适当的用法。尽管 protobuf 比 JSON 更高效，但 JSON 对于基于文本的表示法来说是非常高效的。虽然 protobuf 是一种二进制表示法，但它确实提供了一种替代的文本表示法，用于需要阅读的地方。

### 如果无法避免 Java 序列化

如果无法避免 Java 序列化，也许是因为在一个需要它的传统系统中工作，那么你的最好的下一步就是永远不要反序列化不受信任的数据。特别是不应该接受来自不受信任来源的 RMI 通信。Java 的官方安全编码指南说：“对不可信任的数据进行反序列化，本质上来说很危险，应该避免。" 这句话被设置为大号、粗体、斜体、红色字体，它是整个文档中唯一得到这种待遇的文本。

如果无法绝对保证反序列化的数据的安全性，使用 Java 9 新增的对象反序列化过滤，这一功能也已经被移植到了早期版本（java.io.ObjectInputFilter）。它可以在数据流被反序列化之前，指定一个过滤器。它的操作粒度是类，可以选择接受或拒绝哪些类。默认接受类，但拒绝一些潜在危险的黑名单；默认拒绝类，同时接受假设安全的白名单。**白名单优于黑名单**，因为黑名单只能抵御已知的威胁（一个叫做 Serial Whitelist Application Trainer（SWAT）的工具可以自动为程序准备一份白名单）。过滤设施也将保护免受过度的内存使用，以及过度深入的对象图，但它不会保护你免受像上面所示的序列化炸弹的伤害（TODO：过深的对象图不就是上面的序列化炸弹吗？）。

### 总结

遗憾的是，序列化在 Java 生态系统中很常见。如果要维护一个基于 Java 序列化的系统，请认真考虑迁移到一个跨平台的结构化数据表示法，尽管这可能是一个耗时的努力。现实中，可能仍然会不得不编写或维护一个可序列化的类。要编写一个正确、安全和高效的可序列化类，需要非常谨慎。本章的其余部分提供了关于何时和如何做到这一点的建议。

总而言之，序列化是危险的，应该避免。如果要从头开始设计一个系统，请使用跨平台的结构化数据表示法。不要对不受信任的数据进行反序列化。如果你必须这样做，请使用对象反序列化过滤，但要注意，它不能保证阻挡所有攻击。避免编写可序列化的类，如果必须这样做，要非常谨慎。

## 86. 谨慎地实现 Serializable 接口

要想使一个类可以被序列化，只要让它实现 `Serializable` 接口即可。正是因为太容易了，所以有一个普遍的误解，认为序列化不需要程序员付出什么。事实要复杂得多。虽然使一个类实现可序列化的直接成本可以忽略不计，但长期成本往往是巨大的。

实现 `Serializable` 接口最大代价就是，一旦被发布，就大大降低了改变这个类的实现的灵活性。当一个类实现了 Serializable，它的字节流编码（或者序列化形式）就成了它导出 API 的一部分。

TODO：太难了，看不懂
