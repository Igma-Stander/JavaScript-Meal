// initialize session storage if it's empty
if (!sessionStorage.getItem("orders")) {
  sessionStorage.setItem("orders", JSON.stringify([]));
}

//creating function to get random meal, before prompting the user
function randomMeal(ingredient) {
  return fetch(
    "https://www.themealdb.com/api/json/v1/1/filter.php?i=" + ingredient
  )
    .then((res) => res.json())
    .then((result) => {
      let meals = result.meals;
      if (!meals) return null;
      let randomIndex = Math.floor(Math.random() * meals.length);
      return meals[randomIndex];
    });
}

//wanted to use split for 2 word ingredients, but the API works without it
function promptUser() {
  let mainIngredient = prompt(
    "Please choose the main ingredient for your meal."
  ).toLowerCase();
  //using toLowerCase to accept all inputs
  let orders = JSON.parse(sessionStorage.getItem("orders"));

  //calling first function with the prompt value
  randomMeal(mainIngredient)
    .then((meal) => {
      if (!meal) {
        alert("Sorry, we couldn't find any meals with that ingredient.");
        //recursion
        promptUser();
      }

      //generate a unique order number in numerical order
      let orderNumber =
        orders.length > 0 ? orders[orders.length - 1].orderNumber + 1 : 1;

      //store the order details in session storage
      orders.push({ orderNumber, mainIngredient, meal: meal.strMeal });
      sessionStorage.setItem("orders", JSON.stringify(orders));

      //template literals
      alert(
        `Your order (number: ${orderNumber}) with ${mainIngredient} is: ${meal.strMeal}`
      );
    })
    .catch((err) => {
      console.error("Error occurred:", err);
    });
}

promptUser();

//displaying all the incomplete orders
function displayOrders() {
  let orders = JSON.parse(sessionStorage.getItem("orders"));
  //used filter to loop through all elements and create new array
  let incompleteOrders = orders.filter((order) => !order.completed);

  if (incompleteOrders.length === 0) {
    alert("No incomplete orders.");
    return;
  }

  //using map to format new layout of the elements in array
  let orderDescriptions = incompleteOrders
    .map((order) => `Order number ${order.orderNumber}: ${order.meal}`)
    .join("\n");
  alert("Incomplete Orders:\n\n" + orderDescriptions);
}

//function to prompt user to mark order as complete
function markOrders() {
  let orderNumber = prompt(
    "Enter the order number you want to mark as complete. \n(Enter 0 to cancel):"
  );
  let orders = JSON.parse(sessionStorage.getItem("orders"));

  if (orderNumber === "0") {
    return;
    //stop statement from running
  }

  //prompt gives a string output so using find to parse a number
  let orderComplete = orders.find(
    (order) => order.orderNumber === parseInt(orderNumber)
  );

  if (!orderComplete) {
    alert("That order number doesn't exist.");
    return;
  }

  orderComplete.completed = true;
  sessionStorage.setItem("orders", JSON.stringify(orders));
  alert(`Order number ${orderNumber} marked as complete.`);
  //tried using splice to remove completed orders, but isn't working
}

//calling functions
displayOrders();
markOrders();
