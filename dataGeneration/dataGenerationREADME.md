# How to run data generation

## Get started

1. Install node

    [node installation](https://nodejs.org/en/download)

2. Install pnpm

    [pnpm installation](https://pnpm.io/installation)

3. Install dependencies: [csv-parser](https://www.npmjs.com/package/csv-parser)

   ```bash
   cd dataGeneration
   pnpm i csv-parser
   ```

## Run the data generation

1. Enter the right directory

   ```bash
   cd dataGeneration
   ```

2. In the dataGen.js file, adjust the numbers in the dataAmt array to change the amount of rows generated for each CSV file 

[# of employee rows, # of customer & paymentinfo rows, # of pet rows, # of orderinfo rows]

3. Run dataGen.js

   ```bash
   node dataGen.js
   ```
