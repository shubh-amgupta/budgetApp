
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

   var data = {
      allItems: {
         exp: [],
         inc: []
      },
      totals: {
         exp: [],
         inc: []
      }
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
   };

   return {
      getInput: function() {
         return {
            type: document.querySelector(DOMStrings.inputType).value, // inc for income or exp for expenses
            description: document.querySelector(DOMStrings.inputDescription).value,
            value: document.querySelector(DOMStrings.inputValue).value
         };
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
   }

   var ctrlAddItem = function() {

      var input, newItem;

      // 1. Get input data
      input = UICtrl.getInput();

      // 2. Add item to budget controller
      newItem = budgetController.addItem(input.type, input.description, input.value);
      budgetController.testing();

      // 3. Add new item to UI
      // 4. Calculate Budget
      // 5. Display Budget
   }

   return {
      init: function() {
         console.log("Application started");
         setupEventListeners();
      }
   };


})(budgetController, UIController);


appController.init();
