var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentage = -1;

    }
    Expense.prototype.calPercentage = function(totalIncome) {
        if (totalIncome) {
            this.percentage = Math.round((this.value / totalIncome) * 100);
        }
    }
    Expense.prototype.getPercentage = function() {
        return this.percentage;
    }
    var Income = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;

    }
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            inc: 0,
            exp: 0
        },
        budget: 0,
        percentage: -1

    }
    var calculateTotal = function(type) {
        var sum = 0;
        data.allItems[type].forEach(function(one) {
            sum += one.value;
        });
        data.totals[type] = sum;

    }
    return {
        addItem: function(type, desc, val) {
            var newItem, Id;
            if (data.allItems[type].length > 0) {
                Id = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                Id = 0;
            }
            if (type === "exp") {
                newItem = new Expense(Id, desc, val);
            } else if (type === "inc") {
                newItem = new Income(Id, desc, val);
            }
            data.allItems[type].push(newItem);
            return newItem;


        },
        calculateBudget: function() {
            calculateTotal('exp');
            calculateTotal('inc');
            data.budget = data.totals.inc - data.totals.exp;
            data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);


        },
        calculatePercentage: function() {
            data.allItems.exp.forEach(function(one) {
                one.calPercentage(data.totals.inc);
            })

        },
        getPercentages: function() {
            var allPercentages=data.allItems.exp.map(function(one){
                     return one.getPercentage();
            })
            return allPercentages;
        },
        deleteItem: function(type, id) {
            var ids, index;
            ids = data.allItems[type].map(function(current) {
                return current.id;
            });
            index = ids.indexOf(id);
            console.log("index", index)
            if (index !== -1) {
                data.allItems[type].splice(index, 1);
            }

        },
        getBudget: function() {
            return {
                budget: data.budget,
                percentage: data.percentage,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp
            }
        },
        test: function() {
            console.log(data);
        }
    }


})()



var UIController = (function() {

    //Some Code
    var DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: '.add__btn',
        expContainer: '.expenses__list',
        incContainer: '.income__list',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        budgetLabel: '.budget__value',
        container: '.container',
        expensePercentageLabel:".item__percentage",
        dateLabel:".budget__title--month"
    }
    var formatNumbers=function(num,type){
            var numSplit,int,dec;
            num=Math.abs(num);
            num=num.toFixed(2);
            numSplit=num.split(".");
            int=numSplit[0];
            if(int>3){
                int=int.substr(0,int.length-3)+","+int.substr(int.length-3,3);
            }
            dec=numSplit[1];
            return (type=="exp"?'-':'+')+" "+int+"."+dec;
           
        }
        var nodeListForEach=function(list,callback){
                for(let i=0;i<list.length;i++){
                    callback(list[i],i);
                }
            }
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                desc: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            }
        },
        addListItem: function(obj, type) {
            var html, newHtml, element;
            if (type == "inc") {
                element = DOMStrings.incContainer;
                html = '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            } else if (type == "exp") {
                element = DOMStrings.expContainer;
                html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'

            }
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', formatNumbers(obj.value,type));

            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);




        },
        deleteListItem: function(elementId) {
            var el = document.getElementById(elementId);
            (el).parentNode.removeChild(el);

        },
        displayBudget: function(obj) {
            var type=obj.budget>0?"inc":"exp";
            document.querySelector(DOMStrings.budgetLabel).textContent = formatNumbers(obj.budget,type);
            document.querySelector(DOMStrings.incomeLabel).textContent = formatNumbers(obj.totalInc,"inc");
            document.querySelector(DOMStrings.expenseLabel).textContent = formatNumbers(obj.totalExp,"exp");
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + "%";
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = "---";
            }


        },
        displayMonth:function(){
           var currentDate,year,month,months;
           currentDate=new Date();
           months=["Janauary","February","March","April","May","June","July","August","September","October","November","December"];
           year=currentDate.getFullYear();
           month=currentDate.getMonth();
           month=months[month];
           document.querySelector(DOMStrings.dateLabel).textContent=month+" "+year;

        },
        changeType:function(){
        var fields=document.querySelectorAll(DOMStrings.inputType+","+DOMStrings.inputValue+","+DOMStrings.inputDescription);
        nodeListForEach(fields,function(current,i){
              current.classList.toggle('red-focus');
        })
        document.querySelector(DOMStrings.inputBtn).classList.toggle('red');


        },

        displayPercentage:function(percentages){
            var fields=document.querySelectorAll(DOMStrings.expensePercentageLabel);
            
            nodeListForEach(fields,function(current,index){
                if(percentages[index]){
                    current.textContent=percentages[index]+"%";
                }else{
                    current.textContent="__";
                }
            })

        },

        getDOMStrings: function() {
            return DOMStrings;
        },
        clearFields: function() {
            var fields, fieldsArr;
            fields = document.querySelectorAll(DOMStrings.inputDescription + ',' + DOMStrings.inputValue)
            fieldsArr = Array.prototype.slice.call(fields);
            fieldsArr.forEach(function(current, index, array) {
                current.value = "";

            })
            fieldsArr[0].focus();
        }
    }


})();

var controller = (function(budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
        document.querySelector(DOM.inputType).addEventListener('change',UICtrl.changeType);
        document.addEventListener("keypress", function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })
    }
    var updateBudget = function() {
        //1.Calculate the budget.
        budgetCtrl.calculateBudget();

        //2.Return the budget.
        var budget = budgetCtrl.getBudget();

        //3.Display the budget.
        UICtrl.displayBudget(budget);
    }
    var updatePercentages = function() {
        //1.Calculate the percentages.
        budgetCtrl.calculatePercentage();

        //2.Get the percentages from the Budget controller.
        var percentages=budgetCtrl.getPercentages();

        //3.Update the UI with new percentages. 
        UICtrl.displayPercentage(percentages);
    }
    var ctrlDeleteItem = function(event) {
        var Id, type, itemId, splitId;
        itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;
        if (itemId) {
            splitId = itemId.split('-');
            Id = parseInt(splitId[1]);
            type = splitId[0];

            //1.delete the item from the data structure.
            budgetCtrl.deleteItem(type, Id);

            //2.delete item from the UI.

            UICtrl.deleteListItem(itemId);

            //3.update and show the new budget.
            updateBudget();

             //4.Calculate and update percentages.
            updatePercentages();

        }

    }
    var ctrlAddItem = function() {
        var input, newItem;
        //1.Get the field input data. 
        input = UICtrl.getInput();

        if (input.desc !== "" && !isNaN(input.value) && input.value > 0) {
            //2.Add the item to the budget controller.
            newItem = budgetCtrl.addItem(input.type, input.desc, input.value)


            //3.Add the item to the UI.
            UICtrl.addListItem(newItem, input.type);

            //4.Clear the fields.
            UICtrl.clearFields();

            //5.Calculate and update the budget.
            updateBudget();

            //6.Calculate and update percentages.
            updatePercentages();



        }


    }
    return {
        init: function() {
            console.log("Application has Started");
            UICtrl.displayMonth();
            UICtrl.displayBudget({
                budget: 0,
                percentage: 0,
                totalInc: 0,
                totalExp: 0
            })
            setUpEventListeners();
        }
    }


})(budgetController, UIController);

controller.init();