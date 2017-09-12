
// Budget Controller
var budgetController = (function() {
 
  var Expense = function(id, description, value) {
      
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
  };
    
  Expense.prototype.calcPercentage = function(){
     
      if(data.total.inc > 0){
          
    
    this.percentage = Math.round((this.value / data.total.inc) * 100);   
      }else {
          this.percentage = -1;
      }
      
      
  };
    
Expense.prototype.getPercentage = function() {
    
  return this.percentage;
    
};
    
  var Income = function(id, description, value) {
      
      this.id = id;
      this.description = description;
      this.value = value;
      this.percentage = -1;
  };
    
 var calculateTotal = function(type) {
   
     var sum = 0;
     
     data.allItems[type].forEach(function(curr){
       
     sum += curr.value;
    });
     
     data.total[type] = sum;
 };
    
  var allExpenses = [];
  var allIncomes = [];
  
  var data = {
     allItems: {
         exp: [],
         inc: []
     },
      total: {
          exp: 0,
          inc: 0
      },
      budget: 0,
      percentage: -1
     
    };
    
    return {
        addItem: function(type, desc, val){
        
            var newItem, ID;
            
            // create new id
            if(data.allItems[type].length > 0){
                
            
            ID = data.allItems[type][data.allItems[type].length-1].id + 1;
                
            }else{
                ID = 0;
            }
            // create new item based on inc or exp type
            if(type === 'exp'){
                
            newItem = new Expense(ID, desc, val);
                
            }else if (type === 'inc'){
                
            newItem = new Income(ID, desc, val);
            }
            
            // push it into our data structure
            data.allItems[type].push(newItem);
            
            // return new element
            return newItem;
            
     },
        
        deleteItem: function(type, id) {
          var ids, index;
            // id = ?
        ids = data.allItems[type].map(function(current){
              
                return current.id;
       });
            index = ids.indexOf(id);
            
            if (index !== -1){
                // remove element index and number of elements. 
                data.allItems[type].splice(index, 1);
                
            }
            
        },
        
        calculateBudget: function() {
          
            // calculate total income and expenses
            calculateTotal('exp');
            calculateTotal('inc');
            
            
            // calculate the budget: income - expenses
            data.budget = data.total.inc - data.total.exp;
            
            // calculate the % of income we spend
            if(data.total.inc>0){
                
            data.percentage = Math.round((data.total.exp / data.total.inc) * 100);
                
            }else{
                data.percentage = -1;
            }
            
        },
        
        calculatePercentages: function() {
            
          // a = 20, b=10, c=40: totalIncome =100; a =20/100 = 20%  
         data.allItems.exp.forEach(function(curr) {
             curr.calcPercentage(data.total.inc);
         });
            
        },
        
        getPercentages: function() {
            
           var allPercentages = data.allItems.exp.map(function(curr) {
            
        return curr.getPercentage();
        
        }); 
            return allPercentages;
        },
        
        getBudget: function() {
            
            return {
                budget: data.budget,
                totalInc: data.total.inc,
                totalExp: data.total.exp,
                percentage: data.percentage,
                
            };
            
        },
        
        testing: function() {
            console.log(data);
        }
    };
    
})();



// UI Controller
var UIController = (function(){
    
    var DOMstrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        inputBtn: '.add__btn',
        incomeContainer: '.income__list',
        expensesContainer: '.expenses__list',
        budgetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container',
        expensesPercLabel: '.item__percentage',
        datelabel: '.budget__title--month' 
    };
    
    var formatNumber = function(num, type){
            var numSplit, int, dec;
            // + or - before number
            // exactly 2 decimal points
            // comma seperating thousands
            
            // remove sign of number e.g -200 = 200 (absolute number)
            num = Math.abs(num);
            // 2dp
            num = num.toFixed(2);
            // split into dec and int parts
            numSplit = num.split('.');
            
            int = numSplit[0];
            if(int.length > 3){
                // if input is 2310 result wud be 2,310
               int = int.substr(0, int.length - 3) + ',' + int.substr(int.length  -3, 3);
                
            }
            dec = numSplit[1];
            
           //if (type === 'exp') ? sign = '-' : sign = '+';  
            
            return (type === 'exp' ? sign = '-' : sign = '+') + ' ' + int + '.' + dec;
            
        };
    
    var nodeListForEach = function(list, callback){
                
                for(var i =0; i < list.length; i++){
                    
                    callback(list[i], i);
                    
                }
                
            };
    
    return {
      getInput: function() {
          
          return{
          type: document.querySelector(DOMstrings.inputType).value, // inc or exp
          description: document.querySelector(DOMstrings.inputDescription).value,
          value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
          };
      },
        
        addListItem: function(obj, type) {
           var html, newHtml, element;
            // create html string with placeholder text
            
        if (type === 'inc'){
            element = DOMstrings.incomeContainer;
            
             html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
        }else if (type === 'exp'){
            element = DOMstrings.expensesContainer;
            
            html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            
        }
        // replace placeholder text with some actual data
        newHtml = html.replace('%id%', obj.id);
        newHtml = newHtml.replace('%description%', obj.description);
        newHtml = newHtml.replace('%value%', formatNumber(obj.value, type));    
            
        // insert html into the DOM
        document.querySelector(element).insertAdjacentHTML('beforeend', newHtml); 
            
        },
        
        deleteListitem: function(selectorID){
        var element = document.getElementById(selectorID);  
        element.parentNode.removeChild(element);   
            
        },
        
        clearFields: function(){
        var fields, fieldsArr;
            
        fields = document.querySelectorAll(DOMstrings.inputDescription + ',' + DOMstrings.inputValue);
            
        fieldsArr = Array.prototype.slice.call(fields);  
            
        fieldsArr.forEach(function(current, index, array){
            current.value = "";
            
        });
          fieldsArr[0].focus();  
        },
        
        displayBudget: function(obj){
            
            obj.budget > 0 ? type = 'inc' : type = 'exp';
            
            document.querySelector(DOMstrings.budgetLabel).textContent = formatNumber(obj.budget, type);
            document.querySelector(DOMstrings.incomeLabel).textContent = formatNumber(obj.totalInc, type);
            document.querySelector(DOMstrings.expenseLabel).textContent = formatNumber(obj.totalExp, type);
            
            if(obj.percentage > 0 ){
             document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + '%';   
            }else{
               document.querySelector(DOMstrings.percentageLabel).textContent = '---'; 
            }
            
        },
        
        displayPercentages: function(percentages){
            
        var fields = document.querySelectorAll(DOMstrings.expensesPercLabel);
            
            
            
            nodeListForEach(fields, function(curr, index){
               if(percentages[index] > 0){ 
               curr.textContent = percentages[index] + '%'; 
               }else{
                   curr.textContent = '---';
               }
                
                
            });
            
        },
        
       displayMonth: function() {
         var year, now, months, month;  
           
        now = new Date();
        //var christmas = new date(2016, 12 , 25)
           
        month = now.getMonth(); 
           
        months =['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
           
        year = now.getFullYear();
        document.querySelector(DOMstrings.datelabel).textContent = months[month] + ' ' + year;   
        //month = year.
       },
        
        changedType: function() {
            
          var fields = document.querySelectorAll(
          
              DOMstrings.inputType + ',' +
              DOMstrings.inputDescription + ',' +
              DOMstrings.inputValue
          ); 
            
        nodeListForEach(fields, function(curr){
           
            curr.classList.toggle('red-focus');
            
        });
          
            document.querySelector(DOMstrings.inputBtn).classList.toggle('red');
        },
        
        getDOMstrings: function(){
            return DOMstrings;
        }
    };
    
})();

// Global App Controller
var controller = (function(budgetCtrl, UICtrl){
    
    var setUpEventListeners = function(){
        
        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);
        
        document.addEventListener('keypress', function(event) {
       
        if (event.keyCode === 13 || event.which === 13){
            ctrlAddItem();
        }   

        
     });
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change', UICtrl.changedType);
        
        
  };
    
    
   var updateBudget = function() {
          
    // Calculate budget
     budgetController.calculateBudget();
       
       
    // Return the budget
     var  budget = budgetCtrl.getBudget();
       
       
        
    // Display budget
    UICtrl.displayBudget(budget); 
       
   };
    
   var updatePercentages = function(){
       
   // calculate percentages
       budgetCtrl.calculatePercentages();
       
    // read from budget controller
    var percentages = budgetCtrl.getPercentages();
       
       
    // update the UI
    UICtrl.displayPercentages(percentages);
       
   };

    var ctrlAddItem = function() {
       
      var input, newItem;
        
      // 1. Get the field input data
      input = UICtrl.getInput();
        
    if(input.description !== "" && !isNaN(input.value) && input.value > 0){
        
      // 2. Add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);
      
    
      // 3. Add new item to ui
      UICtrl.addListItem(newItem, input.type);
        
      // clear the fields
      UICtrl.clearFields();
      
      // Calculate and update budget
      updateBudget();
        
      // Calculate and update percentages
      updatePercentages();  
        
      };
       
    };
    
    var ctrlDeleteItem = function(event){
        
    var itemID, splitID, type, id;
        
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
        
        if(itemID){
            
            // inc-1
            splitID = itemID.split('-');
            type = splitID[0];
            id = parseInt(splitID[1]);
            
            // delete item from data structure
            budgetCtrl.deleteItem(type, id);
            
            // delete item from UI
            UICtrl.deleteListitem(itemID);
            
            // update and show new budget
            updateBudget();
        }
        
    }
    
    return {
        init: function(){
            console.log('app has started');
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                 budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1,
                
            });
            setUpEventListeners();
        }
    }
    
 })(budgetController, UIController);
    
 
controller.init();










