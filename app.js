var budgetController = (function() {
    var Expense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value: value;

    }
    var Income = function(id, description, value) {
        this.id = id;
        this.description;
        this.value = value;

    }
    var data = {
    allItems: {
        exp: [],
        inc: []
    },
    total: {
        inc: 0,
        exp: 0
    }
}

})()



var UIController = (function() {

    //Some Code
    var DOMStrings = {
        inputType: ".add__type",
        inputDescription: ".add__description",
        inputValue: ".add__value",
        inputBtn: '.add__btn'
    }
    return {
        getInput: function() {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                desc: document.querySelector(DOMStrings.inputDescription).value,
                value: document.querySelector(DOMStrings.inputValue).value
            }
        },
        getDOMStrings: function() {
            return DOMStrings;
        }
    }


})();

var controller = (function(budgetCtrl, UICtrl) {

    var setUpEventListeners = function() {
        var DOM = UICtrl.getDOMStrings();
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem)
        document.addEventListener("keypress", function(event) {
            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        })
    }

    var ctrlAddItem = function() {

        //1.Get the field input data. 
        var input = UICtrl.getInput();
        console.log("Input#####", input)

        //2.Add the item to the budget controller.

        //3.Add the item to the UI.

        //4.Calculate the budget.

        //5.Display the budget on the UI.

    }
    return {
        init: function() {
            console.log("Application has Started");
            setUpEventListeners();
        }
    }


})(budgetController, UIController);

controller.init();