// This "customersApp" variable glues the module below
// to the '<html ng-app="customersApp">' directive above
var myApp = angular.module("myApp", ["ngRoute"]);

// Get the routes for the partials
myApp.config(function($routeProvider) {
    $routeProvider
        .when("/", {
            templateUrl: "partials/orders.html"
        })
        .when("/customers", {
            templateUrl: "partials/customers.html"
        })
        .otherwise({
           redirectTo: "/"
        });
});

// Add a factory to the module and this factory
// gets data that is passed to the controller
myApp.factory("customerFactory", function() {
    // An array with objects as elements to be passed to the controller
    var customers = [
        {name: "Jed", date: "2015-07-19"},
        {name: "Linda", date: "2015-07-20"},
        {name: "Fred", date: "2015-07-21"},
        {name: "Maria", date: "2015-07-18"},
        {name: "Keiko", date: "2015-07-22"}
    ];

    var factory = {};

    // Add a "getcustomers" method to the object we defined
    factory.getCustomers = function(callback) {
        // Pass the customers to a callback to be used by whoever calls the method
        callback(customers);
    };

    // Return the object so it can be used by the rest of the Angular code
    return factory;
});

// Orders factory
myApp.factory("ordersFactory", function() {
    var newOrder = "";

    // Products array
    var products = [
        {name: "Nike Shoes"},
        {name: "Black Belts"},
        {name: "Ice Cream"},
        {name: "Candy"}
    ];

    var factory = {};

    var orders = [];

    factory.getProducts = function(callback) {
        callback(products);
    };

    factory.addOrder = function(order, callback) {
        orders.date = new Date;

        orders.push(order);
        callback();
    };

    factory.getOrders = function(callback) {
        callback(orders);
    };


    return factory;
});


// build the controller and inject the "customerFactory" into it
myApp.controller("customersController", function($scope, customerFactory, ordersFactory) {


    // Orders stuff
    $scope.products = [];

    $scope.newOrder = {};

    // Initalize an empty array so $scope.customers maintains a consistent data type

    // Reset arrays to empty
    $scope.customers = [];


    // Reset error to empty string
    $scope.error = "";

    // Reset new customer to an empty string
    $scope.newCustomer = "";

    // Run the "getCustomers" method and set "$scope" "data" in the callback
    customerFactory.getCustomers(function(data) {
        $scope.customers = data;
    });

    $scope.addOrder = function(order) {
        ordersFactory.addOrder(order, function() {
            ordersFactory.getOrders(function(data) {
                $scope.orders = data;

                console.log("Orders", $scope.orders);
            });

        });

        $scope.newOrder = {};

        $scope.newOrder.quantity = "1";
        $scope.newOrder.product = $scope.products[0].name;
        $scope.newOrder.customer = $scope.customers[0].name;

    };

    ordersFactory.getOrders(function(data) {
        $scope.orders = data;

        console.log(data);
    });



    // This "$scope.addCustomer()" method executes when the
    // input element, that is inside the 'ng-controller="customersController"' directive,
    // with the 'ng-click="addCustomer()"' directive gets clicked
    $scope.addCustomer = function() {


        if($scope.newCustomer.length === 0) {
            $scope.error = "Name cannot be blank.";
        }

        var duplicate_found = false;

        for(var i in $scope.customers) {
            if($scope.newCustomer.name == $scope.customers[i].name) {
                duplicate_found = true;

                $scope.error = "There is already a customer with that name.";
            }
        }

        // get date
        var date = new Date;

        // get year
        var year = date.getFullYear();

        // get month
        var month = date.getMonth() + 1;

        // If current month is less than "10"
        // add zero to as the first digit
        if(month < 10) {
            month = "0" + month;
        }

        // get day of month
        var dayOfMonth = date.getDate();

        // If current day of month is less than "10"
        // add zero as the first digit
        if(dayOfMonth < 10) {
            dayOfMonth = "0" + dayOfMonth;
        }

        // Push the "newCustomer" form values into the
        // "customers" array as an object of "name" and "date"
        // property name and value pairs as the first element using
        // "unshift" and increment every other array element up by one

        if(!duplicate_found && $scope.newCustomer.length != 0) {

            // Add new date to the an added customer
            $scope.newCustomer.date = year + "-" + month + "-" + dayOfMonth;

            $scope.customers.unshift($scope.newCustomer);


        }


        // Clears all items from the "newCustomer" object
        // to add more later
        $scope.newCustomer = {};
    };

    $scope.removeCustomer = function(customer) {
        $scope.customers.splice($scope.customers.indexOf(customer), 1);
    };

    ordersFactory.getProducts(function (data1) {
        $scope.products = data1;

        $scope.newOrder.product = $scope.products[0].name;

    });


    $scope.newOrder.customer = $scope.customers[0].name;

    $scope.newOrder.quantity = "1";


});