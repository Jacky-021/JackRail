# RakeLink

Rail freight booking and tracking website for a fictional company, RakeLink Freight Services, Vadodara.
Made for the ITBT live class exercise by Jaikee Kumar, MBA (Logistics and Supply Chain Management), Gati Shakti Vishwavidyalaya, Vadodara.
The company, prices, contacts and all dashboard data are fictional.

## What is on the site

- Home, About and the core lane map
- Services and prices (six services)
- Operations dashboard with sample data
- Track a consignment (try TRK1018, TRK1025 or TRK1001)
- Generate a bill: fill in the customer and items, then print it or save it as a PDF
- Contact details and an enquiry form

## Files

```
index.html   page structure and text
style.css    all styling (colours are the variables at the top)
script.js    services list, dashboard charts, tracking, enquiry form, bill generator
README.md    this file
images/      logo.svg, hero-train.svg, network-map.svg
```

## Run it on your computer

Double-click `index.html`. There is nothing to install.

## Publish on GitHub Pages

1. Upload every file to the root of your repository and keep the `images` folder.
2. Open Settings, then Pages. Under Source choose "Deploy from a branch", pick the `main` branch and the `/ (root)` folder, then click Save.
3. After a minute or two the site opens at https://jacky-021.github.io/RakeLink/

If the `images` folder is missing, the page shows built-in drawings of the logo, train and map instead, so nothing looks broken.

## Using the bill generator

1. Open Generate bill from the menu.
2. Enter the customer name and, if you like, company, GSTIN, address, consignment ID and route.
3. Choose a service for each item. The rate fills in from the price list and you can change it. Use Add another item for more lines.
4. Choose the GST rate and whether the customer is in Gujarat (CGST + SGST) or outside it (IGST).
5. Press Print or save as PDF. Only the bill is printed.
6. Press Start a new bill to clear the form. The bill number goes up by one.

GST rates here are for practice. Check the rules in force before using them for real billing.

## Changing things

- Services and prices: the `SERVICES` list at the top of `script.js`. It also feeds the bill and enquiry drop-downs.
- Dashboard charts: the `bars(...)` lines in `script.js`. The big numbers are in `index.html`.
- Sample consignments: the `TRK` list in `script.js`.
- Contact details: the Contact section and the bill header in `index.html`. The email address is also in `script.js` for the enquiry form.

## Good to know

- The enquiry form opens the visitor's email app with the details filled in, because a GitHub Pages site has no server to receive messages.
- The bill number counter is saved in the visitor's own browser.
