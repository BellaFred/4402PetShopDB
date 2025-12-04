# Pet Shop

Pet Shop is an application that allows users to browse and adopt pets.  
It includes both a user mobile app and an admin command-line interface for managing pets, sales, and employee records.

---

## Requirements

### Programming Languages / Frameworks
- **Node.js 18+**
- **React Native + Expo**
- **Supabase** (Database & Auth)

### Hardware
- Mobile device with **Expo Go** installed (Android or iOS)

---

## Installation

### 1. Clone or download the project  
Open a terminal in the root directory:

```
4402PetShop/
```

---

## Application User Interface 

### Install Mobile Dependencies

```
npm install 
```

### Run the App

```
cd PetShop
npx expo start
```

Scan the QR code using **Expo Go** on your phone.

### Features
- **Home:** Browse cats, dogs, birds, and fish; view prices; add pets to your cart  
- **Profile:** Change password, sign out, delete account  
- **Cart:** Review selected pets, enter payment info, confirm adoption  

---

## StaffCLI — Employee Interface

### Install Dependencies
From the project root:

```
npm install dotenv
```

### Log In terminal
Temporary Example:
```
node --import dotenv ./StaffCLI/index.js login pgpwidu4@example.com S5VKLlQmO
```

### Available Commands
```
logout           - End the current session
help             - Show all commands
update-pet       - Edit pet attributes
sell-pet         - Record a sale/adoption and update status
add-employee     - Adds a new employee into the database and prints out their employeeID afterwards
update-employee  - Edit employee fields (name, email, salary, etc.)
remove-employee  - Removes employee using their employeeID
```

### Important Notes
When inputing an employee's name or address, replace spaces with underscores:
```
update-employee 71599737 name Johnny_Brooks
add-employee testing@testing.com William_Gates BillLovesApples! employee 123456789
```

---

## Contributors
Helena Schuler  
Nora Pray  
Myles Guidry  
Gerald Hebert  
Bella Frederick  
Jessica Chan

### Test Queries 

Test Query 1 – List all dogs and their adoption fees
```
SELECT petid, name, breed, adoptionfee
FROM pet
WHERE species = 'dog';
```

Test Query 2 – Orders with customer, employee, and pet details
```
SELECT 
    o.orderid,
    c.name AS customer_name,
    e.name AS employee_name,
    p.name AS pet_name,
    o.orderdate,
    o.totalamount
FROM orderinfo o
JOIN customer c ON o.customerid = c.customerid
JOIN employee e ON o.employeeid = e.employeeid
JOIN pet p ON o.petid = p.petid;
```

Test Query 3 – Count number of pets by species
```
SELECT species, COUNT(*) AS total_pets
FROM pet
GROUP BY species;
```

Test Query 4 – Total revenue from all orders
```
SELECT SUM(totalamount) AS total_revenue
FROM orderinfo;
```

Test Query 5 – Highest adoption fee
```
SELECT name, species, breed, adoptionfee
FROM pet
ORDER BY adoptionfee DESC
LIMIT 1;
```
