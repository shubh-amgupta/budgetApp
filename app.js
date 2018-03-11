
//Budget Controller
var budgetController = (function() {

   var Expense = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
   };

   var Income = function(id, description, value) {
      this.id = id;
      this.description = description;
      this.value = value;
   };

   var calculateTotal = function(type) {
      var sum = 0;

      data.allItems[type].forEach(function(cur){
         sum += cur.value;
      })

      data.totals[type] = sum;
   };

   var data = {
      allItems: {
         exp: [],
         inc: []
      },
      totals: {
         exp: [],
         inc: []
      },
      budget: 0,
      percentage: -1
   };

   return {
      addItem: function(type, des, val) {
         var newItem, id;

         // Create new ID
         if(data.allItems[type].length > 0) {
            id = data.allItems[type][data.allItems[type].length - 1].id + 1;
         }else {
            id = 0;
         }

         // Create new item based on inc or exp
         if(type === 'exp') {
            newItem = new Expense(id, des, val);
         }else if(type === 'inc') {
            newItem = new Income(id, des, val);
         }

         // Push new item into data structure
         data.allItems[type].push(newItem);

         // return the new item
         return newItem;

      },

      deleteItem: function(type, id) {

         var ids, index;

         ids = data.allItems[type].map(function(current){
            return current.id;
         });

         index = ids.indexOf(id);

         if(index !== -1) {
            data.allItems[type].splice(index, 1);
         }

      },

      calculateBudget: function() {

         // calculate total income and expenses
         calculateTotal("exp");
         calculateTotal("inc");

         // calculate budget: income - expenses
         data.budget = data.totals.inc - data.totals.exp;

         // calculate the percentage of income that we spent
         if(data.totals.inc > 0) {
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
         }else {
            data.percentage = -1;
         }

      },

      getBudget: function() {

         return {
            budget: data.budget,
            totalIncome: data.totals.inc,
            totalExpenses: data.totals.exp,
            percentage: data.percentage
         }

      },

      testing: function() {
         console.log(data);
      }
   }

})();


// UI Controller
var UIController = (function() {

   var DOMStrings = {
      inputType: ".add__type",
      inputDescription: ".add__description",
      inputValue: ".add__value",
      inputBtn: ".add__btn",
      incomeContainer: ".income__list",
      expenseContainer: ".expenses__list",
      budgetLabel: '.budget__value',
      incomeLabel: '.budget__income--value',
      expenseLabel: '.budget__expenses--value',
      percentageLabel: '.budget__expenses--percentage',
      container: '.container'
   };

   return {
      getInput: function() {
         return {
            type: document.querySelector(DOMStrings.inputType).value, // inc for income or exp for expenses
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
         };
      },

      addListItem: function(obj, type) {
         var html, newHtml, element;

         // Create HTML string with placeholder text
         if(type === 'inc') {
            element = DOMStrings.incomeContainer;
            html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
         }else if(type === 'exp') {
            element = DOMStrings.expenseContainer;
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
         }

         // Replace the placeholder text with data
         newHtml = html.replace('%id%', obj.id);
         newHtml = newHtml.replace('%description%', obj.description);
         newHtml = newHtml.replace('%value%', obj.value);

         // Insert the html into the DOM
         document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

      },

      deleteListItem: function(id) {

         var element = document.getElementById(id);

         element.parentNode.removeChild(element);
      },

      clearFields: function() {
         var fields, fieldsArr;
         fields = document.querySelectorAll(DOMStrings.inputDescription + "," + DOMStrings.inputValue);

         var fieldsArr = Array.prototype.slice.call(fields);

         fieldsArr.forEach(function(current, index, array){
            current.value = "";
         });

         fieldsArr[0].focus();
      },

      displayBudget: function(obj) {

         document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
         document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalIncome;
         document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExpenses;

         if(obj.percentage > 0) {
            document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
         } else {
            document.querySelector(DOMStrings.percentageLabel).textContent = '---';
         }

      },

      getDOMStrings: function() {
         return DOMStrings;
      }
   };

})();


// Global App controller
var appController = (function(budgetCtrl, UICtrl) {

   var setupEventListeners = function() {

      var DOM = UIController.getDOMStrings();

      document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

      document.addEventListener('keypress', function(event) {
         if(event.keyCode === 13 || event.which === 13) {
            ctrlAddItem();
         }
      });

      document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
   }

   var updateBudget = function() {
      // 1. Calculate Budget
      budgetController.calculateBudget();

      // 2. Return budget
      var budget = budgetController.getBudget();

      // 3. Display Budget
      UIController.displayBudget(budget);
   };

   var updatePercentages = function() {

      // 1. Calculate Percentages


      // 2. Read percentages from the budget controller


      // 3. update UI with new percentages
   };

   var ctrlAddItem = function() {

      var input, newItem;

      // 1. Get input data
      input = UICtrl.getInput();

      if(input.description !== "" && !isNaN(input.value) && input.value > 0) {

         // 2. Add item to budget controller
         newItem = budgetController.addItem(input.type, input.description, input.value);
         //budgetController.testing();

         // 3. Add new item to UI
         UIController.addListItem(newItem, input.type);

         // 4. Clear the fields
         UIController.clearFields();

         // 5. Calculate and Update budget
         updateBudget();

         // 6. Calculate and update percentages
         updatePercentages();

      }

   };


   var ctrlDeleteItem = function(event) {
      var itemID, splitID, type, id;

      itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
      console.log(itemID);

      if(itemID) {

         // inc-0, inc-1
         splitID = itemID.split('-');
         type = splitID[0];
         id = parseInt(splitID[1]);

         // 1. Delete item from Data structure
         budgetController.deleteItem(type, id);

         // 2. Delete item from UI
         UIController.deleteListItem(itemID);

         // 3. Update the budget
         updateBudget();

         // 4. Calculate and update percentages
         updatePercentages();

      }
   };


   return {
      init: function() {
         console.log("Application started");
         setupEventListeners();
         UIController.displayBudget({
            budget: 0,
            totalIncome: 0,
            totalExpenses: 0,
            percentage: 0
         });
      }
   };


})(budgetController, UIController);


appController.init();
