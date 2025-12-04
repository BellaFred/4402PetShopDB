//// DATA GENERATION SCRIPT
// NOTE: data had to have some manual adjustments after being generated & exported to their respective CSV files
// NOTE: data imported into postgresSQL database on Supabase via 'import data from CSV'

// global arrays where generated data for each table is stored
var employeeArray = [];
var customerArray = [];
var paymentArray = [];
var petArray = [];
var orderArray = [];

//// CSV READING & WRITING

// reads data from a csv file
// .csv file source for names: https://www.data.qld.gov.au/dataset/top-100-baby-names/resource/53c648be-8623-4f1b-83c5-9a591a8d6acd?view_id=b64c7ce3-056e-4b50-b1e4-6b26aab768d6
const fs = require('fs');
const csv = require('csv-parser');

// global arrays where names are stored
const girlNamesArray = [];
const boyNamesArray = [];

console.log('start CSV reading');

fs.createReadStream('names.csv')
  .pipe(csv())
  .on('data', (row) => {

    // columns that do not contain name data are skipped entirely
    // push girl names into one array...
    if (row['Girl Names']) {
      girlNamesArray.push(row['Girl Names'].trim());
    }

    // ... and boy names into another
    if (row['Boy Names']) {
      boyNamesArray.push(row['Boy Names'].trim());
    }
  })

  // run main function to generate data after name arrays have been filled
  .on('end', () => {
    console.log(' end CSV reading, start data generation');
    main();
  })
  // run main function to generate data, but name arrays will be empty
  .on('error', (err) => {
    console.error('error reading CSV file:', err);
    console.log('CSV reading unsuccessful, start data generation with empty name arrays');
    main(); 
  });

// writes data to a CSV (export from JSON -> CSV format)
// inputs: array where data is stored, name for CSV file
function jsonToCSV(data, filenamePrefix) {
  // don't create a CSV file if given an empty array
  if (data.length === 0) {
    console.log(`skipping CSV creation for ${filenamePrefix}: array empty`);
    return;
  }

  // turn JSON format into CSV format (stringify information and join with a ',')
  const headers = Object.keys(data[0]);
  const rows = data.map(obj =>
    headers.map(h => {
      const value = obj[h] ?? "";
      if (typeof value === 'object' && value !== null) {
        return JSON.stringify(value);
      }
      return JSON.stringify(String(value));
    }).join(",")
  );

  // write the information to a CSV file with specified name
  const csvContent = [headers.join(","), ...rows].join("\n");
  const filename = `${filenamePrefix}.csv`;
  fs.writeFileSync(filename, csvContent);
  console.log(`CSV file saved: ${filename}`);
}

//// MAIN 

function main() {
  // number of rows of data to generate for each CSV
  var dataAmt = [10, 40, 50, 15];

  // data generation
  console.log(`generating ${dataAmt[0]} employees`);
  employee(dataAmt[0]);
  console.log(`generating ${dataAmt[1]} customers`);
  customer(dataAmt[1]);
  console.log(`generating ${dataAmt[1]} payments`);
  paymentInfo(dataAmt[1]);
  console.log(`generating ${dataAmt[2]} pets`);
  pet(dataAmt[2]);
  console.log(`generating ${dataAmt[3]} orders`);
  orderInfo(dataAmt[3]);

  // export data to CSV
  jsonToCSV(employeeArray, 'employeeArray');
  jsonToCSV(customerArray, 'customerArray');
  jsonToCSV(paymentArray, 'paymentArray');
  jsonToCSV(petArray, 'petArray');
  jsonToCSV(orderArray, 'orderArray');
}

//// DATA GENERATION FUNCTIONS

// generate data for specified number of rows for employee table
function employee(employeeNumb) {
  // generate data objects until specfied number reached
  for (let i = 0; i < employeeNumb; i++) {
    
    // generate element & push element into array
    employeeArray.push({
      employeeID: uniqueNumberGen(8),
      name: (Math.random() < 0.5 ? 
             `${girlNamesArray[Math.floor(Math.random() * girlNamesArray.length)]} ${girlNamesArray[Math.floor(Math.random() * girlNamesArray.length)]}` :
             `${boyNamesArray[Math.floor(Math.random() * boyNamesArray.length)]} ${boyNamesArray[Math.floor(Math.random() * boyNamesArray.length)]}`),
      mobile: uniqueNumberGen(9),
      email: randomEmail(),
      password: randomPassword(Math.floor(Math.random() * 10) + 8),
      address: getRandomAddress(),
      salary: randomSalary(i),
      role: randomRole(i),
      routingNumber: uniqueNumberGen(9),
    });
  }
}

// generate data for specified number of rows for customer table
function customer(customerNumb) {
  // generate data objects until specfied number reached
  for (let i = 0; i < customerNumb; i++) {

    // generate element & push element into array
    customerArray.push({
      customerID: uniqueNumberGen(8),
      name: (Math.random() < 0.5 ? 
             `${girlNamesArray[Math.floor(Math.random() * girlNamesArray.length)]} ${girlNamesArray[Math.floor(Math.random() * girlNamesArray.length)]}` :
             `${boyNamesArray[Math.floor(Math.random() * boyNamesArray.length)]} ${boyNamesArray[Math.floor(Math.random() * boyNamesArray.length)]}`),
      mobile: uniqueNumberGen(9),
      email: randomEmail(),
      password: randomPassword(Math.floor(Math.random() * 10) + 8),
      address: getRandomAddress(),
    });
  }
}

// generate data for specified number of rows for paymentinfo table
function paymentInfo(paymentNumb) {
  // CHECK - make sure prerequisite arrays have been generated
  if (customerArray.length === 0) {
    console.error("customer array is empty, data can't be generated");
    return;
  }
  
  // generate data objects until specfied number reached
  for (let i = 0; i < paymentNumb; i++) {
    // retrieve customer data corresponding to specified index
    // modulo used if paymentNumb > customerArray.length
    const customerIndex = i % customerArray.length;
    const customer = customerArray[customerIndex];

    // generate element & push element into array
    paymentArray.push({
      paymentID: uniqueNumberGen(8),
      customerID: customer.customerID, 
      cardNumber: uniqueNumberGen(16),
      cardExpiration: randomDate(),
      cvv: uniqueNumberGen(3),
      cardholder: customer.name,
      billingAddress: customer.address,
    });
  }
}

// generate data for specified number of rows for pet table
function pet(petNumb) {
  // arrays to randomly choose elements from in data generation
  var species = ['dog', 'cat', 'bird', 'fish'];
  var breedDog = ['border collie', 'golden retriever', 'poodle', 'dachshund', 'dalmation'];
  var breedCat = ['american shorthair', 'siamese', 'scottish fold', 'ragdoll', 'munchkin'];
  var breedBird = ['parakeet', 'parrot', 'cockatiel', 'cockatoo', 'lovebird'];
  var breedFish = ['betta', 'goldfish', 'guppy', 'angelfish', 'swordtail'];
  var generalDescription = ['sleeping', 'eating', 'playing', 'being noisy', 'staring', 'acting cute'];

  // generate data objects until specfied number reached
  for (let i = 0; i < petNumb; i++) {
    // find selected species...
    const selectedSpecies = species[Math.floor(Math.random() * species.length)];
    // ...declare selectedBreed and isFixedValue...
    let selectedBreed;
    let isFixedValue = 'n/a';
    
    // ...use selectedSpecies to determine the breed and fixed status
    switch (selectedSpecies) {
      case 'dog':
        selectedBreed = breedDog[Math.floor(Math.random() * breedDog.length)];
        isFixedValue = (Math.random() < 0.5 ? 'yes' : 'no');
        break;
      case 'cat':
        selectedBreed = breedCat[Math.floor(Math.random() * breedCat.length)];
        isFixedValue = (Math.random() < 0.5 ? 'yes' : 'no');
        break;
      case 'bird':
        selectedBreed = breedBird[Math.floor(Math.random() * breedBird.length)];
        break;
      case 'fish':
        selectedBreed = breedFish[Math.floor(Math.random() * breedFish.length)];
        break;
    }

    // generate element & push element into array
    petArray.push({
      petID: uniqueNumberGen(8), 
      species: selectedSpecies,
      breed: selectedBreed,
      name: (Math.random() < 0.5 ? 
                     girlNamesArray[Math.floor(Math.random() * girlNamesArray.length)] : 
                     boyNamesArray[Math.floor(Math.random() * boyNamesArray.length)]),
      age: (Math.floor(Math.random() * 11)),
      generalDescription: `${petName} enjoys ${generalDescription[Math.floor(Math.random() * generalDescription.length)]}`,
      adoptionStatus: (Math.random() < 0.5 ? 'adopted' : 'unadopted'),
      gender: (Math.random() < 0.5 ? 'male' : 'female'),
      isFixed: isFixedValue,
      healthInfo: (Math.random() < 0.8 ? 'healthy' : 'unhealthy'),
      adoptionFee: Math.floor(Math.random() * 91) + 10,
    });
  }
}

// generate data for specified number of rows for orderinfo table
function orderInfo(orderNumb) {
  // simulated tax applied to adoption fee for pet
  const orderTax = 10;

  // CHECK - make sure prerequisite arrays have been generated
  if (customerArray.length === 0 || employeeArray.length === 0 || paymentArray.length === 0 || petArray.length === 0) {
    console.error("one or more required arrays are empty, data can't be generated");
    return;
  }

  // generate data objects until specfied number reached
  for (let i = 0; i < orderNumb; i++) {
    // select random indices for foreign key lookups
    const customerRandIndex = Math.floor(Math.random() * customerArray.length);
    const employeeRandIndex = Math.floor(Math.random() * employeeArray.length);
    const paymentRandIndex = Math.floor(Math.random() * paymentArray.length);
    const petRandIndex = Math.floor(Math.random() * petArray.length);

    // get data from specfied indices 
    const customerData = customerArray[customerRandIndex];
    const employeeData = employeeArray[employeeRandIndex];
    const paymentData = paymentArray[paymentRandIndex];
    const petData = petArray[petRandIndex];

    // generate element & push element into array
    orderArray.push({
      orderID: uniqueNumberGen(8),
      customerID: customerData.customerID,
      employeeID: employeeData.employeeID,
      paymentID: paymentData.paymentID, 
      petID: petData.petID, 
      orderDate: randomDateWithDay(),
      totalAmount: petData.adoptionFee + orderTax, 
    });
  }
}

//// HELPER FUNCTIONS

// generate a random number of specified length (for multiple attributes across several tables)
// hold sets of numbers already generated so they won't be regenerated (keeps numbers unique)
const usedNumbersByLength = new Map();

function uniqueNumberGen(length) {
  // CHECK - length must be positive and nonzero
  if (length < 1) throw new Error("Length must be at least 1");

  // calculate the min and max of the range (lowest number possibly generated to the highest number possibly generated)
  const min = Math.pow(10, length - 1);
  const max = Math.pow(10, length) - 1;
  const rangeSize = max - min + 1;

  // CHECK - find / create set, see numbers already generated
  if (!usedNumbersByLength.has(length)) {
    usedNumbersByLength.set(length, new Set());
  }
  const used = usedNumbersByLength.get(length);

  // if all numbers have been generated, display error
  if (used.size >= rangeSize) {
    throw new Error(`No more unique ${length}-digit numbers available`);
  }

  // otherwise, generate a random number
  let num;
  do {
    num = Math.floor(Math.random() * (max - min + 1)) + min;
  } while (used.has(num));

  // add generated number to its respective set, then return the generated number
  used.add(num);
  return num;
}

// generates a string of specified length to use as a password for account to access database information (for employee.password, customer.password)
function randomPassword(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let password = "";

  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  return password;
}

// generates an email with format [random string]@example.com (for employee.email, customer.email)
function randomEmail() {
  const random = Math.random().toString(36).substring(2, 10);
  return `${random}@example.com`;
}

// generates a random address in the New Orleans area (for employee.address, customer.address; used in payment.billingaddress)
function getRandomAddress() {
  const streets = ["Maple St", "Oak Ave", "Pine Dr", "Cedar Rd", "Elm St", "Birch Blvd"];
  const cities = ["Harahan, LA 70123", "Metarie, LA 70001", "Kenner, LA 70062", "New Orleans, LA 70032", "St. Rose, LA 70087", "Destrehan, LA 70047", "Laplace, LA 70068"];

  const streetNumber = Math.floor(Math.random() * 9999) + 1;
  const street = streets[Math.floor(Math.random() * streets.length)];
  const city = cities[Math.floor(Math.random() * cities.length)];

  return `${streetNumber} ${street}, ${city}`;
}

// generates role for employee based on their array position (for employee.role)
// first element of array -> owner
// rest of elements in array -> employee
function randomRole(arrayPosition) {
  if (arrayPosition === 0) {
    return "owner";
  } 
  
  else {
    return "employee";
  }
}

// generates salary for employee based on their array position (for employee.salary)
// owner (first element of array) -> $80,000 / yr
// employee (rest of elements in array) -> $20,000 / yr
function randomSalary(arrayPosition) {
  if (arrayPosition === 0) {
    return 80000;
  } 
  
  else {
    return 20000;
  }
}

// generates random date in MM/YY format (for paymentinfo.cardexpiration)
function randomDate() {
  var month = (Math.floor(Math.random() * 12)) + 1;
  if (month < 10) {
    month = "0" + month;
  }

  var year = (31 - (Math.floor(Math.random() * 5))); 
  return `${month}/${year}`;
}

// generates random 2025 date in YYYY-MM-DD format (for order.orderdate)
function randomDateWithDay() {
  var day = (Math.floor(Math.random() * 30)) + 1;
  if (day < 10) {
    day = "0" + day;
  }

  var month = (Math.floor(Math.random() * 12)) + 1; 
  if (month < 10) {
    month = "0" + month;
  }

  const year = 2025;
  return `${year}-${month}-${day}`;
}