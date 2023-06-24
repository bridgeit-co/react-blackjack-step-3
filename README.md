## Specifications

Start by importing the required files for this step: 

```bash
bash update_step_3.sh
```
You should have 4 new files in their respective directories.

### Player and Dealer States

We will need to initialize states to track changes in the hands and scores of the `player` and `dealer`, which will be the names of the two targets. 

|  Info to track  | State name | Initial Value |
| ------------ | ------------ | ------------ |
| Cards  | targetCards | [] |
| Total score  | targetScore | 0 |
| Number of cards  | targetCardCount | 0 |

In `App.js`, create the required state variables for the both the `player` and the `dealer`. 

You'll need to use `useState` for this. Remember to set the initial values as per the table!

### Hand

The Hand component will be used to hold all the cards the player or dealer has after betting. Import the component by adding this line after the last import statement:

```javascript
import Hand from './components/Hand';
```

And add in the component in the return statement. We would need 2, for the dealer and the player respectively:

```javascript
...

  return (
    <div className="App">
      <Hand />
      <div className='grid-container'>
        <div className='message-container'>{message && <h1>{message}</h1>}</div>
      </div>
	<Hand />
     <Wallet gameStatus={gameStatus} />
    </div>
  );
}
```

You might realise that you need to pass some information to the Hand components in order so it knows what to render. Well, this is where [Props](https://react.dev/learn/passing-props-to-a-component) come into play.

#### Props

React components use props to communicate with each other. Every parent component can pass some information to its child components by giving them props. Props might remind you of HTML attributes, but you can pass any JavaScript value through them, including objects, arrays, and functions.

Unlike state, which can change over the lifecycle of the component, props are immutable—a term from computer science meaning "unchangeable". When a component needs to change its props (for example, in response to a user interaction or new data), it will have to “ask” its parent component to pass it different props—a new object.

Here is where where React really shines: By passing state as props, when the state of the parent component updates, the child component is re-rendered automatically!  You change the state at one place, and like a ripple in a pond, the effects are felt throughout your application.

Read this [article](https://react.dev/learn/reacting-to-input-with-state) to learn more about reacting to input with state!

#### Passing down props

Each hand would need the following props: 

- `cards`, to know what cards the targets has
- `score`, to know what score to display to the player
- `target`, to know whose hand this belongs to. In our game, the "player" holds the bottom hand, and the "dealer" holds the top.

Add in the props with the prop names into the hand components!

#### Destructure the props

Destructuring in JavaScript is a handy feature that allows you to unpack values from arrays or properties from objects into distinct variables.

For instance, in the previous step the Card component had a props.card object like so:

```javascript
  const { suit, value, hidden } = props.card;
```
which is equivalent to:

```javascript
const suit = props.card.suit;

const value = props.card.value;

const hidden = props.card.hidden;
```

React component functions accept a single argument, a props object, which works well with destructuring assignments! 

Destructure the props in `Hand.js`. 

> Pro challenge: There's a even better way than the example above!

#### Render the cards

Next, inside the `<div className= "cards-container>"`,  map over the `cards` array and render a Card component for each card. Each Card component will need props as well, so remember to pass it down! 

Remember, the `map` method in JavaScript creates a new array with the results of calling a function for every array element. It's great for transforming data!

------------

> **Note:**
When you're running `npm start` in the later steps, you might notice an error in the console:
>
> `"Warning: Each child in a list should have a unique “key” prop."`
>
> This is because you need to give each array item a key — a string or a number that uniquely identifies it among other items in that array. React will use item’s index in the array as its key if you don’t specify one. We won't be covering keys in this quest, but check out [this link](https://react.dev/learn/rendering-lists) to learn more about when and why to use React keys.

### Drawing cards

#### Spread syntax and Rest params

The [spread operator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Spread_syntax), denoted by three dots `...`, is a useful feature in JavaScript that was introduced with ES6 (ES2015). It allows an iterable such as an array or string to be expanded in places where zero or more arguments (for function calls) or elements (for array literals) are expected, or an object expression to be expanded in places where zero or more key-value pairs (for object literals) are expected.

Here's a brief look at the three main ways you might see the spread operator used:

- In function calls: The spread operator can be used to pass an array to functions that normally require a list of arguments.

```javascript
const numbers = [1, 2, 3];
console.log(...numbers); // Equivalent to: console.log(1, 2, 3);
```

- In array literals: The spread operator can be used for creating a new array that includes elements from another array.

```javascript
const arr1 = ['A', 'B', 'C'];
const arr2 = [...arr1, 'D', 'E']; // arr2 is now ['A', 'B', 'C', 'D', 'E']
```

- In object literals: The spread operator can be used for creating a new object that includes properties from another object.

```javascript
const obj1 = {a: 1, b: 2};
const obj2 = {...obj1, c: 3}; // obj2 is now {a: 1, b: 2, c: 3}

```

------------


[Rest parameters](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/rest_parameters) uses the same `...` syntax. It allows us to represent an indefinite number of arguments as an array. This can be really helpful when you want to collect all remaining arguments of a function into a single parameter.

```javascript
function sum(...args) {
  let result = 0;

  for(let arg of args) {
    result += arg;
  }

  return result;
}

console.log(sum(1, 2, 3, 4)); // prints 10
```
Although they use the same syntax, in a way, they do the opposite things. When used in a function call, `...` spreads an array out into separate arguments. When used in a function definition, `...` collects all remaining arguments into an array.

One key thing to note is that the rest parameters must be at the end of the parameters list in a function definition. This makes sense because it is collecting all "remaining" arguments. Here is an example:

```javascript
function orderIceCream(flavor, ...toppings) {
  console.log(`You ordered a ${flavor} ice cream with the following toppings:`);

  for(let topping of toppings) {
    console.log(`- ${topping}`);
  }
}

orderIceCream('chocolate', 'sprinkles', 'marshmallows', 'nuts');

// Output:
// You ordered a chocolate ice cream with the following toppings:
// - sprinkles
// - marshmallows
// - nuts
```

#### drawCard
In `App.js`, create a function named `drawCard` that accepts a target as a parameter. In this function, we'll first need to draw a card from the `deck`, and update the `deck` state.

Remember the `hidden` property in the Card component? This is where we'll need to implement that as well. In Blackjack, the dealer will only reveal his first card at the start of the game, and keep one hidden. 

Depending on the target (`player`, `dealer`, `dealer-hidden`) we want to do the following:

1. Add the hidden property into the card, and give it a `true/false` value depending on the target.
2.  Add the modified card into one of the 2 targetCards state.
3. Update the corresponding targetCardCount. If the card is hidden, we don't want to count the card just yet.

You will find it easier if you used the spread operator and rest params here!

### calculateScore

In Blackjack, all cards are at face value, except for the King, Queen and Jack which count as 10. An Ace will have a value of 11 unless that would give a player or the dealer a score in excess of 21; in which case, it has a value of 1.

In `calculateScore.js`, modify the `calculateScore` function so that it returns the correct score for a hand of cards. Feel free to start running `npm test` here: we've provided many possible scenarios to ensure your solution works as intended.

Remember to import the `calculateScore` functioninto `App.js` once you're done!

### After placing a bet

#### Game phases and messages

In `App.js`, you will find this 2 lines:

```javascript
  const [gameStatus, setGameStatus] = useState(events.bet);
  const [message, setMessage] = useState(messages.init);
```

The `gameStatus` state will manage the phases that happen during a game of Blackjack, and the `message` state will display the welcome message, as well as the outcome of the game to the player. The different values are assigned at the top of the function.

| Phase | gameStatus  | message |
| ------------ | ------------ | ------------ |
| Loading the game for the first time | bet  | init
| Placing a bet   | bet  | - |
| Player wins by Blackjack | playerBlackjack  | playerBlackjack |
| Player deciding to hit or stand | playerTurn  | - |
| Dealer reveals his hole card, and drawing if necessary | dealerTurn  | - |
| Determining the winner   | resolve  | - |
| Player wins   | playerWon  | playerWon |
| Dealer wins   | dealerWon  | dealerWon |
| Tie   | draw  | draw |
| Game ends | gameOver  | - |

The gameStatus state will be passed down to child components to perform tasks based on the event. 

#### Responding to events

[Event handling](https://react.dev/learn/responding-to-events) in React is the way we manage user interactions like clicks, form submissions, key presses, etc., within our components. It is similar to handling events on DOM elements in plain JavaScript, but with a few key differences.

To add an event handler, you will first define a function and then pass it as a prop to the appropriate JSX tag. By convention, event handler props should start with `on`, followed by a capital letter. If you recall in `Wallet.js`, we've provided you with one:

```javascript
  const { gameStatus, onBetChange } = props;
```

By convention, it is common to name event handlers as handle followed by the event name. You’ll often see `onClick={handleClick}`, `onMouseEnter={handleMouseEnter}`, and so on. In `App.js`, define the event handler function `handlePlaceBet`. When a valid bet is placed, we want the following to happen:

1. Clear the welcome message, if any, but setting the message to bet.
2. Player draws a card
3. Dealer draws a card
4. Player draws a second card
5. Dealer draws a hole card
6. Game moves on to the playerTurn phase

Once you've implemented this functions, pass it down as the `onBetChange` prop to the Wallet component! 

### Using useEffect to calculate scores

Finally, we need to calculate the score of the individual hands and update the states with `useEffect`. This time however, we do need to provide a [dependency](https://react.dev/reference/react/useEffect#useeffect), to let React know to do this every time the dependency changes. Take a moment to consider what these dependencies are.


------------


Congratulations on reaching the end of Step 3! If you're new to React, this would be a huge step, but you've learned a bulk of the features that React has to offer. Time to run `npm test`! Don't worry if you fail some of the tests; go through the instructions again, and read the documentation links if you get stuck.

Submit your solution once you pass all the tests!
