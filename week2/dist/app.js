"use strict";
let x = 42;
let message = "Hello World!";
console.log(message);
let vehicle = {
    model: "Boring generic vehicle",
    color: "Red",
    year: 1993,
    power: 60
};
console.log(vehicle);
let car = {
    model: "Ford focus",
    color: "Green",
    year: 2016,
    power: 150,
    bodyType: "Hatchback",
    wheelCount: 4
};
let plane = {
    model: "Boeing 777",
    color: "White",
    year: 2020,
    power: 170000,
    wingspan: 65
};
let boat = {
    model: "Bella",
    color: "Black",
    year: 2022,
    power: 100,
    draft: 0.42
};
console.log(car);
console.log(plane);
console.log(boat);
class VehicleService {
    items;
    constructor() {
        this.items = [];
    }
    add(vehicle) {
        this.items.push(vehicle);
    }
    list() {
        console.log(this.items);
    }
}
let cars = new VehicleService();
let boats = new VehicleService();
cars.add(car);
boats.add(boat);
cars.list();
boats.list();
