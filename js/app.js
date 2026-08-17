/* =========================================================
   FIRSTOPTION SALES HUB
   SALES DASHBOARD APPLICATION
   =========================================================

   PART 1
   - Global state
   - Initialization
   - CSV loading
   - Data normalization
   - Navigation
   - Filters
   - Search
   - Reset
   - Utility functions
========================================================= */


/* =========================================================
   1. GLOBAL STATE
========================================================= */

let allData = [];
let filteredData = [];

let currentPage = 1;

const rowsPerPage = 15;


/* =========================================================
   2. APPLICATION INITIALIZATION
========================================================= */

document.addEventListener("DOMContentLoaded", () => {

    console.log(
        "Firstoption Solar Sales Dashboard ready."
    );

    initializeDashboard();

});


async function initializeDashboard() {

    setupNavigation();

    setupFilters();

    setupFileImport();

    setupResetButton();

    setupSearch();

    setupExport();

    setupPagination();

    loadInitialCSV();

}


/* =========================================================
   3. LOAD INITIAL CSV
========================================================= */

function loadInitialCSV() {

    /*
       Change this path only if your CSV is stored elsewhere.

       Recommended project structure:

       project/
       ├── index.html
       ├── data/
       │   └── sales.csv
       ├── css/
       │   └── style.css
       ├── js/
       │   └── app.js
       └── assets/
    */

    const csvPath = "data/sales.csv";

    Papa.parse(csvPath, {

        download: true,

        header: true,

        skipEmptyLines: true,

        dynamicTyping: false,

        complete: function(results) {

            console.log(
                "CSV loaded successfully."
            );

            console.log(
                "Rows:",
                results.data.length
            );

            console.log(
                "CSV columns:",
                results.meta.fields
            );

            processCSVData(
                results.data
            );

        },

        error: function(error) {

            console.error(
                "CSV loading error:",
                error
            );

            showDataError(
                "Unable to load the sales CSV. Please check the file path."
            );

        }

    });

}


/* =========================================================
   4. FILE IMPORT
========================================================= */

function setupFileImport() {

    const input =
        document.getElementById(
            "fileInput"
        );

    if (!input) {
        return;
    }

    input.addEventListener(
        "change",
        function(event) {

            const file =
                event.target.files[0];

            if (!file) {
                return;
            }

            Papa.parse(file, {

                header: true,

                skipEmptyLines: true,

                dynamicTyping: false,

                complete: function(results) {

                    console.log(
                        "Imported CSV loaded successfully."
                    );

                    console.log(
                        "Rows:",
                        results.data.length
                    );

                    console.log(
                        "CSV columns:",
                        results.meta.fields
                    );

                    processCSVData(
                        results.data
                    );

                },

                error: function(error) {

                    console.error(
                        "Import error:",
                        error
                    );

                    showDataError(
                        "The selected CSV could not be read."
                    );

                }

            });

        }
    );

}





















const ROWS_PER_PAGE = 14;
const PAGE_SIZE = ROWS_PER_PAGE;




/* =========================================================
   5. PROCESS CSV DATA
========================================================= */

function processCSVData(rows) {

    if (!Array.isArray(rows)) {

        console.error(
            "CSV data is not an array."
        );

        return;

    }


    allData =
        rows

            .map(normalizeRow)

            .filter(row => {

                /*
                   Keep valid sales records.

                   A record is considered valid when it has
                   at least a customer, item, invoice or amount.
                */

                return (

                    row.customer ||
                    row.item ||
                    row.invoiceNumber ||
                    row.total !== 0

                );

            });


    filteredData =
        [...allData];


    console.log(
        "Cleaned rows:",
        allData.length
    );


    if (!allData.length) {

        showDataError(
            "No valid sales records were found in the CSV."
        );

        return;

    }


    populateFilters();

    currentPage = 1;

    updateDashboard();

    console.log(
        "Dashboard updated successfully."
    );

}


/* =========================================================
   6. NORMALIZE CSV ROW
========================================================= */

function normalizeRow(row) {

    /*
       Your CSV structure:

       date
       Customer
       sales order id (if applicable)
       Contact
       Staus(New or Returning)
       Customer Category(Installers, End Users, Corporate, Online )
       Invoice_Number
       Item
       Part Number
       Quantity
       Rate
       Total
       REMARK
    */


    const normalized = {

        date:
            normalizeDateValue(
                getCSVValue(
                    row,
                    [
                        "date",
                        "Date"
                    ]
                )
            ),


        customer:
            cleanText(
                getCSVValue(
                    row,
                    [
                        "Customer",
                        "customer"
                    ]
                )
            ),


        salesOrderId:
            cleanText(
                getCSVValue(
                    row,
                    [
                        "sales order id (if applicable)",
                        "Sales Order ID",
                        "salesOrderId"
                    ]
                )
            ),


        contact:
            cleanText(
                getCSVValue(
                    row,
                    [
                        "Contact",
                        "contact"
                    ]
                )
            ),


        status:
            cleanText(
                getCSVValue(
                    row,
                    [
                        "Staus(New or Returning)",
                        "Status(New or Returning)",
                        "Status",
                        "status"
                    ]
                )
            ),


        customerCategory:
            cleanText(
                getCSVValue(
                    row,
                    [
                        "Customer Category(Installers, End User, Corporate, Online )",
                        "Customer Category",
                        "customerCategory",
                        "Category"
                    ]
                )
            ),


        invoiceNumber:
            cleanText(
                getCSVValue(
                    row,
                    [
                        "Invoice_Number",
                        "Invoice Number",
                        "Invoice",
                        "invoiceNumber"
                    ]
                )
            ),


        item:
            cleanText(
                getCSVValue(
                    row,
                    [
                        "Item",
                        "item",
                        "Product"
                    ]
                )
            ),


        partNumber:
            cleanText(
                getCSVValue(
                    row,
                    [
                        "Part Number",
                        "PartNumber",
                        "**PartNumber"
                    ]
                )
            ),


        quantity:
            parseNumber(
                getCSVValue(
                    row,
                    [
                        "Quantity",
                        "quantity"
                    ]
                )
            ),


        rate:
            parseNumber(
                getCSVValue(
                    row,
                    [
                        "Rate",
                        "rate"
                    ]
                )
            ),


        total:
            parseNumber(
                getCSVValue(
                    row,
                    [
                        "Total",
                        "total"
                    ]
                )
            ),


        remark:
            cleanText(
                getCSVValue(
                    row,
                    [
                        "REMARK",
                        "Remark",
                        "remark"
                    ]
                )
            )

    };


    /*
       If Total is empty/zero but Quantity and Rate exist,
       calculate the transaction value.
    */

    if (
        normalized.total === 0 &&
        normalized.quantity !== 0 &&
        normalized.rate !== 0
    ) {

        normalized.total =
            normalized.quantity *
            normalized.rate;

    }


    return normalized;

}


/* =========================================================
   7. GET CSV VALUE
========================================================= */

function getCSVValue(row, possibleNames) {

    for (
        const name of possibleNames
    ) {

        if (
            Object.prototype.hasOwnProperty.call(
                row,
                name
            )
        ) {

            const value =
                row[name];

            if (
                value !== null &&
                value !== undefined
            ) {

                return value;

            }

        }

    }

    return "";

}


/* =========================================================
   8. CLEAN TEXT
========================================================= */

function cleanText(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }

    return String(value)
        .replace(/\s+/g, " ")
        .trim();

}


/* =========================================================
   9. PARSE NUMBER
========================================================= */

function parseNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }


    if (
        typeof value === "number"
    ) {

        return Number.isFinite(value)
            ? value
            : 0;

    }


    let text =
        String(value)
            .trim();


    /*
       Remove:

       ₦
       commas
       spaces
    */

    text =
        text
            .replace(/₦/g, "")
            .replace(/,/g, "")
            .replace(/\s/g, "");


    const number =
        Number(text);


    return Number.isFinite(number)
        ? number
        : 0;

}


/* =========================================================
   10. DATE NORMALIZATION
========================================================= */

function normalizeDateValue(value) {

    if (!value) {
        return "";
    }


    if (
        value instanceof Date
    ) {

        return isNaN(value)
            ? ""
            : value.toISOString()
                .split("T")[0];

    }


    const text =
        String(value).trim();


    /*
       Handle Excel-style / US-style dates:

       8/3/2021
       08/03/2021

       The existing Firstoption data uses this style.
    */

    const slashMatch =
        text.match(
            /^(\d{1,2})\/(\d{1,2})\/(\d{4})/
        );


    if (slashMatch) {

        const month =
            String(
                Number(slashMatch[1])
            ).padStart(2, "0");


        const day =
            String(
                Number(slashMatch[2])
            ).padStart(2, "0");


        const year =
            slashMatch[3];


        return `${year}-${month}-${day}`;

    }


    /*
       Handle YYYY-MM-DD
    */

    const isoMatch =
        text.match(
            /^(\d{4})-(\d{1,2})-(\d{1,2})/
        );


    if (isoMatch) {

        return (

            isoMatch[1] +
            "-" +
            String(
                Number(isoMatch[2])
            ).padStart(2, "0") +
            "-" +
            String(
                Number(isoMatch[3])
            ).padStart(2, "0")

        );

    }


    /*
       Final fallback
    */

    const parsed =
        new Date(text);


    if (
        !isNaN(parsed)
    ) {

        return (

            parsed.getFullYear() +
            "-" +
            String(
                parsed.getMonth() + 1
            ).padStart(2, "0") +
            "-" +
            String(
                parsed.getDate()
            ).padStart(2, "0")

        );

    }


    return "";

}


/* =========================================================
   11. NAVIGATION
========================================================= */
/* =========================================================
   NAVIGATION
   ========================================================= */

function setupNavigation() {

    const links =
        document.querySelectorAll(
            ".main-navigation .nav-item"
        );

    if (!links.length) {

        console.warn(
            "Navigation links not found."
        );

        return;
    }


    links.forEach(link => {

        link.addEventListener(
            "click",
            function(event) {

                event.preventDefault();


                const view =
                    this.dataset.view;


                if (!view) {
                    return;
                }


                /* -----------------------------------------
                   Update active navigation item
                ----------------------------------------- */

                links.forEach(item => {

                    item.classList.remove(
                        "active"
                    );

                });


                this.classList.add(
                    "active"
                );


                /* -----------------------------------------
                   Show selected view
                ----------------------------------------- */

                showView(view);


                /* -----------------------------------------
                   Update URL
                ----------------------------------------- */

                history.replaceState(
                    null,
                    "",
                    "#" + view
                );

            }
        );

    });


    /* ---------------------------------------------
       Handle browser back / forward
    --------------------------------------------- */

    window.addEventListener(
        "hashchange",
        function() {

            const hash =
                window.location.hash
                    .replace("#", "")
                    .trim();


            if (
                [
                    "dashboard",
                    "transactions",
                    "products",
                    "customers"
                ].includes(hash)
            ) {

                showView(hash);


                links.forEach(item => {

                    item.classList.toggle(
                        "active",
                        item.dataset.view === hash
                    );

                });

            }

        }
    );


    /* ---------------------------------------------
       Load correct view on initial page load
    --------------------------------------------- */

    const initialHash =
        window.location.hash
            .replace("#", "")
            .trim();


    const initialView =
        [
            "dashboard",
            "transactions",
            "products",
            "customers"
        ].includes(initialHash)

            ? initialHash

            : "dashboard";


    showView(initialView);


    links.forEach(item => {

        item.classList.toggle(
            "active",
            item.dataset.view === initialView
        );

    });


    console.log(
        "Navigation initialized successfully."
    );

}


/* =========================================================
   SHOW VIEW
========================================================= */

function showView(view) {

    const dashboardView =
        document.getElementById(
            "dashboardView"
        );


    const transactionsView =
        document.getElementById(
            "transactionsView"
        );


    const productsView =
        document.getElementById(
            "productsView"
        );


    const customersView =
        document.getElementById(
            "customersView"
        );


    /* ---------------------------------------------
       Dashboard-only elements
       --------------------------------------------- */

    const dashboardElements =
        document.querySelectorAll(
            ".view-dashboard"
        );


    /* ---------------------------------------------
       Hide all main views
       --------------------------------------------- */

    if (dashboardView) {

        dashboardView.style.display =
            "none";

    }


    if (transactionsView) {

        transactionsView.style.display =
            "none";

    }


    if (productsView) {

        productsView.style.display =
            "none";

    }


    if (customersView) {

        customersView.style.display =
            "none";

    }


    /* ---------------------------------------------
       Hide dashboard filters
       --------------------------------------------- */

    dashboardElements.forEach(
        element => {

            element.style.display =
                "none";

        }
    );


    /* ---------------------------------------------
       SHOW DASHBOARD
       --------------------------------------------- */

    if (view === "dashboard") {

        if (dashboardView) {

            dashboardView.style.display =
                "";

        }


        dashboardElements.forEach(
            element => {

                element.style.display =
                    "";

            }
        );


        /* Re-render charts after becoming visible */

        setTimeout(
            function() {

                if (
                    typeof Plotly !==
                    "undefined"
                ) {

                    renderCharts();

                    Plotly.Plots.resize(
                        document.getElementById(
                            "salesTrend"
                        )
                    );

                    Plotly.Plots.resize(
                        document.getElementById(
                            "categoryTransactionChart"
                        )
                    );

                }

            },
            50
        );

    }


    /* ---------------------------------------------
       SHOW TRANSACTIONS
       --------------------------------------------- */

    else if (
        view === "transactions"
    ) {

        if (transactionsView) {

            transactionsView.style.display =
                "";

        }


        if (
            typeof renderTransactionsTable ===
            "function"
        ) {

            renderTransactionsTable();

        }

    }


    /* ---------------------------------------------
       SHOW PRODUCTS
       --------------------------------------------- */

    else if (
        view === "products"
    ) {

        if (productsView) {

            productsView.style.display =
                "";

        }


        if (
            typeof renderProductsTable ===
            "function"
        ) {

            renderProductsTable();

        }

    }


    /* ---------------------------------------------
       SHOW CUSTOMERS
       --------------------------------------------- */

    else if (
        view === "customers"
    ) {

        if (customersView) {

            customersView.style.display =
                "";

        }


        if (
            typeof renderCustomersTable ===
            "function"
        ) {

            renderCustomersTable();

        }

    }


    console.log(
        "Active view:",
        view
    );

    /*
       Support direct URLs such as:

       index.html#products
       index.html#customers
    */

    window.addEventListener(
        "hashchange",
        handleHashNavigation
    );


    handleHashNavigation();

}


/* =========================================================
   12. HASH NAVIGATION
========================================================= */

function handleHashNavigation() {

    const hash =
        window.location.hash
            .replace("#", "")
            .trim();


    const validViews = [

        "dashboard",
        "transactions",
        "products",
        "customers"

    ];


    const view =
        validViews.includes(hash)
            ? hash
            : "dashboard";


    showView(
        view,
        false
    );

}


/* =========================================================
   13. SHOW VIEW
========================================================= */

function showView(
    view,
    updateHash = true
) {

    const views = {

        dashboard:
            document.getElementById(
                "dashboardView"
            ),

        transactions:
            document.getElementById(
                "transactionsView"
            ),

        products:
            document.getElementById(
                "productsView"
            ),

        customers:
            document.getElementById(
                "customersView"
            )

    };


    Object.values(views)
        .forEach(element => {

            if (element) {

                element.style.display =
                    "none";

            }

        });


    if (views[view]) {

        views[view].style.display =
            "";

    }


    const links =
        document.querySelectorAll(
            ".main-navigation .nav-item"
        );


    links.forEach(link => {

        link.classList.toggle(
            "active",
            link.dataset.view === view
        );

    });


    if (
        updateHash &&
        window.location.hash !==
        "#" + view
    ) {

        history.replaceState(
            null,
            "",
            "#" + view
        );

    }


    /*
       Render the appropriate data view.
    */

    if (view === "transactions") {

        renderTransactionsTable();

    }


    if (view === "products") {

        renderProductsTable();

    }


    if (view === "customers") {

        renderCustomersTable();

    }

}


/* =========================================================
   14. FILTER SETUP
========================================================= */

function setupFilters() {

    const filterIds = [

        "dateFrom",
        "dateTo",
        "categoryFilter",
        "customerFilter",
        "itemFilter"

    ];


    filterIds.forEach(id => {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        element.addEventListener(
            "change",
            applyFilters
        );

    });

}


/* =========================================================
   15. SEARCH SETUP
========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "searchFilter"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function() {

            applyFilters();

        }
    );

}


/* =========================================================
   16. APPLY FILTERS
========================================================= */

function applyFilters() {

    const dateFrom =
        getElementValue(
            "dateFrom"
        );


    const dateTo =
        getElementValue(
            "dateTo"
        );


    const category =
        getElementValue(
            "categoryFilter"
        );


    const customer =
        getElementValue(
            "customerFilter"
        );


    const item =
        getElementValue(
            "itemFilter"
        );


    const search =
        getElementValue(
            "searchFilter"
        )
        .toLowerCase()
        .trim();


    filteredData =
        allData.filter(row => {

            /*
               DATE
            */

            let dateMatch = true;


            if (dateFrom) {

                dateMatch =
                    row.date >= dateFrom;

            }


            if (
                dateMatch &&
                dateTo
            ) {

                dateMatch =
                    row.date <= dateTo;

            }


            /*
               CATEGORY
            */

            const categoryMatch =

                !category ||

                row.customerCategory ===
                category;


            /*
               CUSTOMER
            */

            const customerMatch =

                !customer ||

                row.customer ===
                customer;


            /*
               ITEM
            */

            const itemMatch =

                !item ||

                row.item ===
                item;


            /*
               SEARCH
            */

            let searchMatch = true;


            if (search) {

                const searchable = [

                    row.customer,
                    row.invoiceNumber,
                    row.item,
                    row.partNumber,
                    row.customerCategory,
                    row.status,
                    row.contact,
                    row.remark,
                    row.salesOrderId

                ]
                    .filter(Boolean)
                    .join(" ")
                    .toLowerCase();


                searchMatch =
                    searchable.includes(
                        search
                    );

            }


            return (

                dateMatch &&
                categoryMatch &&
                customerMatch &&
                itemMatch &&
                searchMatch

            );

        });


    currentPage = 1;


    updateDashboard();

}


/* =========================================================
   17. GET ELEMENT VALUE
========================================================= */

function getElementValue(id) {

    const element =
        document.getElementById(id);


    if (!element) {
        return "";
    }


    return element.value || "";

}


/* =========================================================
   18. POPULATE FILTERS
========================================================= */

function populateFilters() {

    populateSelect(
        "categoryFilter",
        uniqueValues(
            allData,
            "customerCategory"
        ),
        "All categories"
    );


    populateSelect(
        "customerFilter",
        uniqueValues(
            allData,
            "customer"
        ),
        "All customers"
    );


    populateSelect(
        "itemFilter",
        uniqueValues(
            allData,
            "item"
        ),
        "All items"
    );

}


/* =========================================================
   19. UNIQUE VALUES
========================================================= */

function uniqueValues(
    data,
    field
) {

    return [

        ...new Set(

            data

                .map(row =>
                    row[field]
                )

                .filter(value =>
                    value !== null &&
                    value !== undefined &&
                    String(value).trim() !== ""
                )

        )

    ].sort(
        (a, b) =>
            String(a).localeCompare(
                String(b)
            )
    );

}


/* =========================================================
   20. POPULATE SELECT
========================================================= */

function populateSelect(
    elementId,
    values,
    defaultText
) {

    const select =
        document.getElementById(
            elementId
        );


    if (!select) {
        return;
    }


    select.innerHTML = "";


    const defaultOption =
        document.createElement(
            "option"
        );


    defaultOption.value = "";

    defaultOption.textContent =
        defaultText;


    select.appendChild(
        defaultOption
    );


    values.forEach(value => {

        const option =
            document.createElement(
                "option"
            );


        option.value =
            value;


        option.textContent =
            value;


        select.appendChild(
            option
        );

    });

}


/* =========================================================
   21. RESET BUTTON
========================================================= */

function setupResetButton() {

    const button =
        document.getElementById(
            "resetBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        resetDashboard
    );

}


function resetDashboard() {

    const filterIds = [

        "dateFrom",
        "dateTo",
        "categoryFilter",
        "customerFilter",
        "itemFilter",
        "searchFilter"

    ];


    filterIds.forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.value = "";

        }

    });


    filteredData =
        [...allData];


    currentPage = 1;


    updateDashboard();


    showView(
        "dashboard"
    );


    console.log(
        "Dashboard filters reset."
    );

}


/* =========================================================
   22. EXPORT SETUP
========================================================= */

function setupExport() {

    const button =
        document.getElementById(
            "exportBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        exportFilteredCSV
    );

}


/* =========================================================
   23. EXPORT FILTERED CSV
========================================================= */

function exportFilteredCSV() {

    if (!filteredData.length) {

        alert(
            "There is no filtered sales data to export."
        );

        return;

    }


    const exportData =
        filteredData.map(row => ({

            Date:
                row.date,

            Customer:
                row.customer,

            "Sales Order ID":
                row.salesOrderId,

            Contact:
                row.contact,

            Status:
                row.status,

            "Customer Category":
                row.customerCategory,

            Invoice:
                row.invoiceNumber,

            Item:
                row.item,

            "Part Number":
                row.partNumber,

            Quantity:
                row.quantity,

            Rate:
                row.rate,

            Total:
                row.total,

            Remark:
                row.remark

        }));


    const csv =
        Papa.unparse(
            exportData
        );


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement(
            "a"
        );


    link.href =
        url;


    link.download =
        "firstoption_filtered_sales.csv";


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   24. PAGINATION SETUP
========================================================= */

function setupPagination() {

    const previous =
        document.getElementById(
            "prevBtn"
        );


    const next =
        document.getElementById(
            "nextBtn"
        );


    if (previous) {

        previous.addEventListener(
            "click",
            function() {

                if (
                    currentPage > 1
                ) {

                    currentPage--;

                    renderTransactionsTable();

                }

            }
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            function() {

                const totalPages =
                    Math.ceil(
                        filteredData.length /
                        rowsPerPage
                    );


                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    renderTransactionsTable();

                }

            }
        );

    }

}


/* =========================================================
   25. DATA ERROR MESSAGE
========================================================= */

function showDataError(message) {

    console.error(
        message
    );


    const elements = [

        "salesTrend",
        "categoryTransactionChart",
        "categoryChart",
        "productChart",
        "topCustomersFrequencyChart",
        "statusChart",
        "salesActivityChart",
        "topCustomersSalesChart"

    ];


    elements.forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.innerHTML = `

                <div
                    style="
                        padding:40px;
                        text-align:center;
                        color:#64748b;
                    "
                >

                    ${escapeHTML(message)}

                </div>

            `;

        }

    });

}


/* =========================================================
   END OF PART 1
========================================================= */
/* =========================================================
   FIRSTOPTION SOLAR SALES DASHBOARD
   APP.JS — PART 2 OF 3

   FILTERS
   KPIs
   PERIOD COMPARISONS
   PLOTLY CHARTS
   ========================================================= */


/* =========================================================
   11. PLOTLY LOADER
========================================================= */

function ensurePlotly() {

    return new Promise((resolve) => {

        if (typeof Plotly !== "undefined") {
            resolve();
            return;
        }

        const existingScript =
            document.querySelector(
                'script[data-firstoption-plotly="true"]'
            );

        if (existingScript) {

            existingScript.addEventListener(
                "load",
                resolve
            );

            return;
        }

        const script =
            document.createElement("script");

        script.src =
            "https://cdn.plot.ly/plotly-2.35.2.min.js";

        script.async = true;

        script.dataset.firstoptionPlotly = "true";

        script.onload = () => {

            console.log(
                "Plotly loaded successfully."
            );

            resolve();

        };

        script.onerror = () => {

            console.error(
                "Unable to load Plotly."
            );

            resolve();

        };

        document.head.appendChild(script);

    });

}


/* =========================================================
   12. APPLY ALL FILTERS
========================================================= */

function applyFilters() {

    if (!Array.isArray(allData)) {
        return;
    }


    const dateFrom =
        document.getElementById("dateFrom")?.value || "";

    const dateTo =
        document.getElementById("dateTo")?.value || "";

    const category =
        document.getElementById("categoryFilter")?.value || "";

    const customer =
        document.getElementById("customerFilter")?.value || "";

    const item =
        document.getElementById("itemFilter")?.value || "";

    const search =
        (
            document.getElementById("searchFilter")?.value ||
            ""
        )
            .toLowerCase()
            .trim();


    filteredData =
        allData.filter(row => {


            /* -----------------------------------------
               DATE FILTER
            ----------------------------------------- */

            let dateMatch = true;

            const rowDate =
                parseSalesDate(row.date);


            if (dateFrom && rowDate) {

                const fromDate =
                    parseInputDate(dateFrom);

                if (
                    fromDate &&
                    rowDate < fromDate
                ) {

                    dateMatch = false;

                }

            }


            if (dateTo && rowDate) {

                const toDate =
                    parseInputDate(dateTo);

                if (toDate) {

                    /*
                     * Include the entire "Date To" day.
                     */

                    toDate.setHours(
                        23,
                        59,
                        59,
                        999
                    );

                    if (
                        rowDate > toDate
                    ) {

                        dateMatch = false;

                    }

                }

            }


            /* -----------------------------------------
               CATEGORY
            ----------------------------------------- */

            const categoryMatch =
                !category ||
                row.customerCategory === category;


            /* -----------------------------------------
               CUSTOMER
            ----------------------------------------- */

            const customerMatch =
                !customer ||
                row.customer === customer;


            /* -----------------------------------------
               ITEM
            ----------------------------------------- */

            const itemMatch =
                !item ||
                row.item === item;


            /* -----------------------------------------
               SEARCH
            ----------------------------------------- */

            let searchMatch = true;


            if (search) {

                const searchable = [

                    row.customer,

                    row.invoiceNumber,

                    row.item,

                    row.partNumber,

                    row.customerCategory,

                    row.status,

                    row.contact,

                    row.salesOrderId,

                    row.remark

                ]
                    .filter(value =>
                        value !== null &&
                        value !== undefined
                    )
                    .join(" ")
                    .toLowerCase();


                searchMatch =
                    searchable.includes(search);

            }


            return (

                dateMatch &&
                categoryMatch &&
                customerMatch &&
                itemMatch &&
                searchMatch

            );

        });


    /*
     * Reset transaction pagination
     * whenever the filter changes.
     */

    currentPage = 1;


    updateDashboard();

}


/* =========================================================
   13. PARSE INPUT DATE
========================================================= */

function parseInputDate(value) {

    if (!value) {
        return null;
    }


    const parts =
        value.split("-");


    if (parts.length !== 3) {
        return null;
    }


    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]);

    const day =
        Number(parts[2]);


    if (
        !year ||
        !month ||
        !day
    ) {

        return null;

    }


    return new Date(
        year,
        month - 1,
        day
    );

}


/* =========================================================
   14. PARSE SALES DATE
========================================================= */

function parseSalesDate(value) {

    if (!value) {
        return null;
    }


    if (value instanceof Date) {

        return isNaN(value.getTime())
            ? null
            : value;

    }


    const text =
        String(value).trim();


    if (!text) {
        return null;
    }


    /*
     * Excel/CSV format:
     *
     * 8/3/2021 0:00
     * 08/03/2021
     */

    const match =
        text.match(
            /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{2,4})(?:\s+(\d{1,2}):(\d{2}))?/
        );


    if (match) {

        let month =
            Number(match[1]);

        let day =
            Number(match[2]);

        let year =
            Number(match[3]);


        if (year < 100) {
            year += 2000;
        }


        const hour =
            Number(match[4] || 0);

        const minute =
            Number(match[5] || 0);


        const date =
            new Date(
                year,
                month - 1,
                day,
                hour,
                minute
            );


        if (!isNaN(date.getTime())) {
            return date;
        }

    }


    /*
     * Fallback to JavaScript Date parser.
     */

    const parsed =
        new Date(text);


    return isNaN(parsed.getTime())
        ? null
        : parsed;

}


/* =========================================================
   15. KPI CALCULATIONS
========================================================= */


/* =========================================================
   MONTHLY KPI COMPARISON
========================================================= */

/**
 * Convert a date value into a valid Date object.
 */
function parseSalesDate(value) {

    if (!value) {
        return null;
    }

    if (value instanceof Date) {
        return isNaN(value.getTime())
            ? null
            : value;
    }

    const text =
        String(value).trim();

    if (!text) {
        return null;
    }

    let date =
        new Date(text);

    if (!isNaN(date.getTime())) {
        return date;
    }

    /*
       Fallback for dates such as:
       8/3/2021 0:00
    */

    const match =
        text.match(
            /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})/
        );

    if (match) {

        const day =
            Number(match[1]);

        const month =
            Number(match[2]) - 1;

        const year =
            Number(match[3]);

        date =
            new Date(
                year,
                month,
                day
            );

        if (!isNaN(date.getTime())) {
            return date;
        }

    }

    return null;
}


/**
 * Return YYYY-MM for a date.
 */
function getMonthKey(value) {

    const date =
        parseSalesDate(value);

    if (!date) {
        return null;
    }

    return (
        date.getFullYear() +
        "-" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0")
    );

}


/**
 * Get the previous calendar month.
 */
function getPreviousMonthKey(monthKey) {

    if (!monthKey) {
        return null;
    }

    const parts =
        monthKey.split("-");

    const year =
        Number(parts[0]);

    const month =
        Number(parts[1]);

    const date =
        new Date(
            year,
            month - 2,
            1
        );

    return (
        date.getFullYear() +
        "-" +
        String(
            date.getMonth() + 1
        ).padStart(2, "0")
    );

}


/**
 * Determine the latest month available
 * in the current filtered dataset.
 */
function getLatestMonth(data) {

    const months =
        data
            .map(row =>
                getMonthKey(row.date)
            )
            .filter(Boolean);


    if (!months.length) {
        return null;
    }


    return months.sort().pop();

}


/**
 * Calculate percentage change.
 */
function calculatePercentageChange(
    current,
    previous
) {

    current =
        Number(current || 0);

    previous =
        Number(previous || 0);


    /*
       No previous value.
    */

    if (previous === 0) {

        if (current === 0) {
            return null;
        }

        return Infinity;

    }


    return (
        (current - previous) /
        Math.abs(previous)
    ) * 100;

}


/**
 * Format KPI percentage.
 */
function formatKPIChange(
    percentage
) {

    if (
        percentage === null ||
        percentage === undefined
    ) {

        return "";

    }


    if (
        percentage === Infinity
    ) {

        return `
            <span class="kpi-positive">
                ↑ New
            </span>
        `;

    }


    if (
        percentage === -Infinity
    ) {

        return `
            <span class="kpi-negative">
                ↓ 100.0%
            </span>
        `;

    }


    const value =
        Math.abs(percentage)
            .toFixed(1);


    if (percentage > 0) {

        return `
            <span class="kpi-positive">
                ↑ ${value}%
            </span>
        `;

    }


    if (percentage < 0) {

        return `
            <span class="kpi-negative">
                ↓ ${value}%
            </span>
        `;

    }


    return `
        <span class="kpi-neutral">
            → 0.0%
        </span>
    `;

}


/**
 * Set a KPI change indicator.
 */
function setKPIChange(
    elementId,
    percentage
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    element.innerHTML =
        formatKPIChange(
            percentage
        );

}


/**
 * Calculate all monthly KPI comparisons.
 */
function calculateMonthlyKPIs(
    data
) {

    if (!data || !data.length) {

        return {

            sales: {
                current: 0,
                previous: 0,
                change: null
            },

            invoices: {
                current: 0,
                previous: 0,
                change: null
            },

            units: {
                current: 0,
                previous: 0,
                change: null
            },

            customers: {
                current: 0,
                previous: 0,
                change: null
            },

            average: {
                current: 0,
                previous: 0,
                change: null
            }

        };

    }


    const latestMonth =
        getLatestMonth(data);


    if (!latestMonth) {

        return {

            sales: {
                current: 0,
                previous: 0,
                change: null
            },

            invoices: {
                current: 0,
                previous: 0,
                change: null
            },

            units: {
                current: 0,
                previous: 0,
                change: null
            },

            customers: {
                current: 0,
                previous: 0,
                change: null
            },

            average: {
                current: 0,
                previous: 0,
                change: null
            }

        };

    }


    const previousMonth =
        getPreviousMonthKey(
            latestMonth
        );


    const currentData =
        data.filter(
            row =>
                getMonthKey(row.date) ===
                latestMonth
        );


    const previousData =
        data.filter(
            row =>
                getMonthKey(row.date) ===
                previousMonth
        );


    /* -----------------------------------------------------
       SALES
    ----------------------------------------------------- */

    const currentSales =
        currentData.reduce(
            (sum, row) =>
                sum +
                Number(row.total || 0),
            0
        );


    const previousSales =
        previousData.reduce(
            (sum, row) =>
                sum +
                Number(row.total || 0),
            0
        );


    /* -----------------------------------------------------
       INVOICES
    ----------------------------------------------------- */

    const currentInvoices =
        new Set(
            currentData
                .map(row =>
                    row.invoiceNumber
                )
                .filter(Boolean)
        ).size;


    const previousInvoices =
        new Set(
            previousData
                .map(row =>
                    row.invoiceNumber
                )
                .filter(Boolean)
        ).size;


    /* -----------------------------------------------------
       UNITS
    ----------------------------------------------------- */

    const currentUnits =
        currentData.reduce(
            (sum, row) =>
                sum +
                Number(row.quantity || 0),
            0
        );


    const previousUnits =
        previousData.reduce(
            (sum, row) =>
                sum +
                Number(row.quantity || 0),
            0
        );


    /* -----------------------------------------------------
       CUSTOMERS
    ----------------------------------------------------- */

    const currentCustomers =
        new Set(
            currentData
                .map(row =>
                    String(
                        row.customer || ""
                    ).trim()
                )
                .filter(Boolean)
        ).size;


    const previousCustomers =
        new Set(
            previousData
                .map(row =>
                    String(
                        row.customer || ""
                    ).trim()
                )
                .filter(Boolean)
        ).size;


    /* -----------------------------------------------------
       AVERAGE TRANSACTION
    ----------------------------------------------------- */

    const currentAverage =
        currentData.length
            ? currentSales /
              currentData.length
            : 0;


    const previousAverage =
        previousData.length
            ? previousSales /
              previousData.length
            : 0;


    return {

        latestMonth,

        previousMonth,

        sales: {

            current:
                currentSales,

            previous:
                previousSales,

            change:
                calculatePercentageChange(
                    currentSales,
                    previousSales
                )

        },


        invoices: {

            current:
                currentInvoices,

            previous:
                previousInvoices,

            change:
                calculatePercentageChange(
                    currentInvoices,
                    previousInvoices
                )

        },


        units: {

            current:
                currentUnits,

            previous:
                previousUnits,

            change:
                calculatePercentageChange(
                    currentUnits,
                    previousUnits
                )

        },


        customers: {

            current:
                currentCustomers,

            previous:
                previousCustomers,

            change:
                calculatePercentageChange(
                    currentCustomers,
                    previousCustomers
                )

        },


        average: {

            current:
                currentAverage,

            previous:
                previousAverage,

            change:
                calculatePercentageChange(
                    currentAverage,
                    previousAverage
                )

        }

    };

}





























/* =========================================================
   UPDATE KPI CARDS
========================================================= */

function updateKPIs() {

    const records =
        Array.isArray(filteredData)
            ? filteredData
            : [];


    /* -----------------------------------------------------
       CURRENT KPI VALUES
    ----------------------------------------------------- */

    const totalSales =
        records.reduce(
            (sum, row) =>
                sum +
                Number(row.total || 0),
            0
        );


    const totalUnits =
        records.reduce(
            (sum, row) =>
                sum +
                Number(row.quantity || 0),
            0
        );


    const uniqueCustomers =
        new Set(

            records

                .map(row =>
                    String(
                        row.customer || ""
                    ).trim()
                )

                .filter(Boolean)

        ).size;


    const uniqueInvoices =
        new Set(

            records

                .map(row =>
                    String(
                        row.invoiceNumber || ""
                    ).trim()
                )

                .filter(Boolean)

        ).size;


    const averageTransaction =
        records.length
            ? totalSales /
              records.length
            : 0;


    /* -----------------------------------------------------
       DISPLAY MAIN KPIs
    ----------------------------------------------------- */

    setText(
        "kpiSales",
        formatNaira(
            totalSales
        )
    );


    setText(
        "kpiSalesMeta",
        `${records.length.toLocaleString()} transactions`
    );


    setText(
        "kpiInvoices",
        formatNumber(
            uniqueInvoices
        )
    );


    setText(
        "kpiUnits",
        formatNumber(
            totalUnits
        )
    );


    setText(
        "kpiCustomers",
        formatNumber(
            uniqueCustomers
        )
    );


    setText(
        "kpiAverage",
        formatNaira(
            averageTransaction
        )
    );


    /* -----------------------------------------------------
       MONTHLY COMPARISON
    ----------------------------------------------------- */

    const monthly =
        calculateMonthlyKPIs(
            records
        );


    /* -----------------------------------------------------
       PERCENTAGE CHANGE
    ----------------------------------------------------- */

    setKPIChange(
        "kpiSalesChange",
        monthly.sales.change
    );


    setKPIChange(
        "kpiInvoicesChange",
        monthly.invoices.change
    );


    setKPIChange(
        "kpiUnitsChange",
        monthly.units.change
    );


    setKPIChange(
        "kpiCustomersChange",
        monthly.customers.change
    );


    setKPIChange(
        "kpiAverageChange",
        monthly.average.change
    );


    /* -----------------------------------------------------
       DEBUG
    ----------------------------------------------------- */

    console.log(
        "KPI Monthly Comparison:",
        monthly
    );

}

/* =========================================================
   16. KPI PERIOD COMPARISON
========================================================= */

function updateKPIChanges() {

    const data =
        Array.isArray(filteredData)
            ? filteredData
            : [];


    /*
     * If there is no usable date information,
     * comparison indicators are removed.
     */

    const dated =
        data.filter(row =>
            parseSalesDate(row.date)
        );


    if (!dated.length) {

        clearKPIChanges();

        return;

    }


    /*
     * Find latest date in current filtered data.
     */

    const dates =
        dated.map(row =>
            parseSalesDate(row.date)
        );


    const latest =
        new Date(
            Math.max(
                ...dates.map(date =>
                    date.getTime()
                )
            )
        );


    /*
     * Current month.
     */

    const currentStart =
        new Date(
            latest.getFullYear(),
            latest.getMonth(),
            1
        );


    const currentEnd =
        new Date(
            latest.getFullYear(),
            latest.getMonth() + 1,
            0,
            23,
            59,
            59,
            999
        );


    /*
     * Previous month.
     */

    const previousStart =
        new Date(
            latest.getFullYear(),
            latest.getMonth() - 1,
            1
        );


    const previousEnd =
        new Date(
            latest.getFullYear(),
            latest.getMonth(),
            0,
            23,
            59,
            59,
            999
        );


    const currentData =
        allData.filter(row => {

            const date =
                parseSalesDate(row.date);

            return (
                date &&
                date >= currentStart &&
                date <= currentEnd
            );

        });


    const previousData =
        allData.filter(row => {

            const date =
                parseSalesDate(row.date);

            return (
                date &&
                date >= previousStart &&
                date <= previousEnd
            );

        });


    /* -----------------------------------------
       CURRENT VALUES
    ----------------------------------------- */

    const currentSales =
        sumField(
            currentData,
            "total"
        );


    const previousSales =
        sumField(
            previousData,
            "total"
        );


    const currentInvoices =
        uniqueFieldCount(
            currentData,
            "invoiceNumber"
        );


    const previousInvoices =
        uniqueFieldCount(
            previousData,
            "invoiceNumber"
        );


    const currentUnits =
        sumField(
            currentData,
            "quantity"
        );


    const previousUnits =
        sumField(
            previousData,
            "quantity"
        );


    const currentCustomers =
        uniqueFieldCount(
            currentData,
            "customer"
        );


    const previousCustomers =
        uniqueFieldCount(
            previousData,
            "customer"
        );


    const currentAverage =
        currentData.length
            ? currentSales /
              currentData.length
            : 0;


    const previousAverage =
        previousData.length
            ? previousSales /
              previousData.length
            : 0;


    setKPIChange(
        "kpiSalesChange",
        currentSales,
        previousSales
    );


    setKPIChange(
        "kpiInvoicesChange",
        currentInvoices,
        previousInvoices
    );


    setKPIChange(
        "kpiUnitsChange",
        currentUnits,
        previousUnits
    );


    setKPIChange(
        "kpiCustomersChange",
        currentCustomers,
        previousCustomers
    );


    setKPIChange(
        "kpiAverageChange",
        currentAverage,
        previousAverage
    );

}


/* =========================================================
   17. KPI CHANGE DISPLAY
========================================================= */

function setKPIChange(
    elementId,
    current,
    previous
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    if (
        previous === 0 &&
        current === 0
    ) {

        element.textContent = "";

        element.className =
            "kpi-change";

        return;

    }


    if (previous === 0) {

        element.textContent =
            "New";

        element.className =
            "kpi-change positive";

        return;

    }


    const change =
        (
            (current - previous) /
            Math.abs(previous)
        ) * 100;


    const rounded =
        Math.round(
            change * 10
        ) / 10;


    element.textContent =
        `${rounded >= 0 ? "+" : ""}${rounded}%`;


    element.className =
        "kpi-change " +
        (
            rounded >= 0
                ? "positive"
                : "negative"
        );

}


/* =========================================================
   18. CLEAR KPI CHANGES
========================================================= */

function clearKPIChanges() {

    const ids = [

        "kpiSalesChange",

        "kpiInvoicesChange",

        "kpiUnitsChange",

        "kpiCustomersChange",

        "kpiAverageChange"

    ];


    ids.forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent = "";

            element.className =
                "kpi-change";

        }

    });

}


/* =========================================================
   19. GENERIC DATA HELPERS
========================================================= */

function safeNumber(value) {

    if (
        value === null ||
        value === undefined ||
        value === ""
    ) {

        return 0;

    }


    if (typeof value === "number") {

        return isFinite(value)
            ? value
            : 0;

    }


    const cleaned =
        String(value)
            .replace(/₦/g, "")
            .replace(/,/g, "")
            .trim();


    const number =
        Number(cleaned);


    return isFinite(number)
        ? number
        : 0;

}


function cleanText(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .trim();

}


function sumField(
    data,
    field
) {

    return data.reduce(
        (sum, row) =>
            sum + safeNumber(row[field]),
        0
    );

}


function uniqueFieldCount(
    data,
    field
) {

    return new Set(

        data

            .map(row =>
                cleanText(
                    row[field]
                )
            )

            .filter(Boolean)

    ).size;

}


/* =========================================================
   20. RENDER ALL CHARTS
========================================================= */

async function renderCharts() {

    await ensurePlotly();


    if (
        typeof Plotly ===
        "undefined"
    ) {

        console.warn(
            "Charts skipped because Plotly is unavailable."
        );

        return;

    }


    renderSalesTrendChart();

    renderCategoryTransactionChart();

    renderCategorySalesChart();

    renderProductChart();

    renderTopCustomersFrequencyChart();

    renderStatusChart();

    renderSalesActivityChart();

    renderTopCustomersSalesChart();

}


/* =========================================================
   21. CHART EMPTY STATE
========================================================= */

function renderChartEmpty(
    elementId,
    message = "No data available"
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    if (
        typeof Plotly !==
        "undefined"
    ) {

        Plotly.purge(element);

    }


    element.innerHTML = `

        <div class="chart-empty">

            <span>
                ${escapeHTML(message)}
            </span>

        </div>

    `;

}


/* =========================================================
   22. COMMON CHART LAYOUT
========================================================= */

function chartLayout(
    extra = {}
) {

    return {

        paper_bgcolor:
            "rgba(0,0,0,0)",

        plot_bgcolor:
            "rgba(0,0,0,0)",

        font: {

            family:
                "Inter, Arial, sans-serif",

            size: 12,

            color:
                "#071b3a"

        },

        margin: {

            l: 55,

            r: 25,

            t: 15,

            b: 55

        },

        hovermode:
            "closest",

        showlegend: false,

        xaxis: {

            showgrid: false,

            zeroline: false,

            automargin: true

        },

        yaxis: {

            showgrid: true,

            gridcolor:
                "rgba(7,27,58,0.08)",

            zeroline: false,

            automargin: true

        },

        ...extra

    };

}


/* =========================================================
   23. CHART CONFIG
========================================================= */

function chartConfig() {

    return {

        responsive: true,

        displayModeBar: false,

        scrollZoom: false,

        doubleClick: "reset"

    };

}


/* =========================================================
   24. SALES TREND
========================================================= */

function renderSalesTrendChart() {

    const element =
        document.getElementById(
            "salesTrend"
        );


    if (!element) {
        return;
    }


    const monthly = {};


    filteredData.forEach(row => {

        const date =
            parseSalesDate(row.date);


        if (!date) {
            return;
        }


        const key =
            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;


        if (!monthly[key]) {

            monthly[key] = {

                sales: 0,

                transactions: 0

            };

        }


        monthly[key].sales +=
            safeNumber(row.total);


        monthly[key].transactions++;

    });


    const keys =
        Object.keys(monthly)
            .sort();


    if (!keys.length) {

        renderChartEmpty(
            "salesTrend"
        );

        return;

    }


    const labels =
        keys.map(key => {

            const [year, month] =
                key.split("-");

            return new Date(
                Number(year),
                Number(month) - 1,
                1
            ).toLocaleDateString(
                "en-US",
                {
                    month: "short",
                    year: "numeric"
                }
            );

        });


    const values =
        keys.map(key =>
            monthly[key].sales
        );


    const trace = {

        x: labels,

        y: values,

        type: "scatter",

        mode: "lines+markers",

        line: {

            width: 3

        },

        marker: {

            size: 7

        },

        hovertemplate:
            "%{x}<br>" +
            "Sales: ₦%{y:,.0f}" +
            "<extra></extra>"

    };


    Plotly.react(

        element,

        [trace],

        chartLayout({

            yaxis: {

                tickprefix: "₦",

                separatethousands: true,

                showgrid: true,

                gridcolor:
                    "rgba(7,27,58,0.08)",

                zeroline: false

            }

        }),

        chartConfig()

    );

}


/* =========================================================
   25. TRANSACTIONS BY CUSTOMER CATEGORY
========================================================= */

function renderCategoryTransactionChart() {

    const element =
        document.getElementById(
            "categoryTransactionChart"
        );


    if (!element) {
        return;
    }


    const groups = {};


    filteredData.forEach(row => {

        const category =
            cleanText(
                row.customerCategory
            ) ||
            "Uncategorized";


        groups[category] =
            (groups[category] || 0) + 1;

    });


    const labels =
        Object.keys(groups);


    const values =
        Object.values(groups);


    if (!labels.length) {

        renderChartEmpty(
            "categoryTransactionChart"
        );

        return;

    }


    const trace = {

        labels,

        values,

        type: "pie",

        hole: 0.58,

        textinfo: "percent",

        hovertemplate:
            "%{label}<br>" +
            "Transactions: %{value:,}" +
            "<extra></extra>"

    };


    Plotly.react(

        element,

        [trace],

        chartLayout({

            showlegend: true,

            legend: {

                orientation: "h",

                y: -0.05

            }

        }),

        chartConfig()

    );

}


/* =========================================================
   26. SALES BY CUSTOMER CATEGORY
========================================================= */

function renderCategorySalesChart() {

    const element =
        document.getElementById(
            "categoryChart"
        );


    if (!element) {
        return;
    }


    const groups = {};


    filteredData.forEach(row => {

        const category =
            cleanText(
                row.customerCategory
            ) ||
            "Uncategorized";


        groups[category] =
            (groups[category] || 0) +
            safeNumber(row.total);

    });


    const sorted =
        Object.entries(groups)
            .sort(
                (a, b) =>
                    b[1] - a[1]
            );


    if (!sorted.length) {

        renderChartEmpty(
            "categoryChart"
        );

        return;

    }


    const labels =
        sorted.map(item =>
            item[0]
        );


    const values =
        sorted.map(item =>
            item[1]
        );


    const trace = {

        x: labels,

        y: values,

        type: "bar",

        hovertemplate:
            "%{x}<br>" +
            "Sales: ₦%{y:,.0f}" +
            "<extra></extra>"

    };


    Plotly.react(

        element,

        [trace],

        chartLayout({

            yaxis: {

                tickprefix: "₦",

                separatethousands: true,

                showgrid: true,

                gridcolor:
                    "rgba(7,27,58,0.08)",

                zeroline: false

            }

        }),

        chartConfig()

    );

}


/* =========================================================
   27. TOP PRODUCTS
========================================================= */

function renderProductChart() {

    const element =
        document.getElementById(
            "productChart"
        );


    if (!element) {
        return;
    }


    const products = {};


    filteredData.forEach(row => {

        const item =
            cleanText(row.item) ||
            "Unknown Product";


        if (!products[item]) {

            products[item] = {

                sales: 0,

                quantity: 0

            };

        }


        products[item].sales +=
            safeNumber(row.total);


        products[item].quantity +=
            safeNumber(row.quantity);

    });


    const sorted =
        Object.entries(products)

            .map(
                ([item, value]) => ({

                    item,

                    sales:
                        value.sales,

                    quantity:
                        value.quantity

                })
            )

            .sort(
                (a, b) =>
                    b.sales -
                    a.sales
            )

            .slice(0, 10);


    if (!sorted.length) {

        renderChartEmpty(
            "productChart"
        );

        return;

    }


    const labels =
        sorted.map(item =>
            shortenText(
                item.item,
                28
            )
        );


    const values =
        sorted.map(item =>
            item.sales
        );


    const trace = {

        x: labels,

        y: values,

        type: "bar",

        hovertemplate:
            "%{x}<br>" +
            "Sales: ₦%{y:,.0f}" +
            "<extra></extra>"

    };


    Plotly.react(

        element,

        [trace],

        chartLayout({

            margin: {

                l: 55,

                r: 20,

                t: 15,

                b: 100

            },

            xaxis: {

                tickangle: -35,

                automargin: true,

                showgrid: false

            },

            yaxis: {

                tickprefix: "₦",

                separatethousands: true,

                showgrid: true,

                gridcolor:
                    "rgba(7,27,58,0.08)",

                zeroline: false

            }

        }),

        chartConfig()

    );

}


/* =========================================================
   28. TOP CUSTOMERS BY FREQUENCY
========================================================= */

function renderTopCustomersFrequencyChart() {

    const element =
        document.getElementById(
            "topCustomersFrequencyChart"
        );


    if (!element) {
        return;
    }


    const customers = {};


    filteredData.forEach(row => {

        const customer =
            cleanText(
                row.customer
            );


        if (!customer) {
            return;
        }


        customers[customer] =
            (customers[customer] || 0) + 1;

    });


    const sorted =
        Object.entries(customers)

            .sort(
                (a, b) =>
                    b[1] -
                    a[1]
            )

            .slice(0, 10);


    if (!sorted.length) {

        renderChartEmpty(
            "topCustomersFrequencyChart"
        );

        return;

    }


    /*
     * Reverse so highest value appears
     * at the top in horizontal bar.
     */

    const labels =
        sorted
            .map(item =>
                shortenText(
                    item[0],
                    28
                )
            )
            .reverse();


    const values =
        sorted
            .map(item =>
                item[1]
            )
            .reverse();


    const trace = {

        x: values,

        y: labels,

        type: "bar",

        orientation: "h",

        hovertemplate:
            "%{y}<br>" +
            "Transactions: %{x:,}" +
            "<extra></extra>"

    };


    Plotly.react(

        element,

        [trace],

        chartLayout({

            margin: {

                l: 130,

                r: 20,

                t: 15,

                b: 45

            },

            xaxis: {

                dtick: 1,

                showgrid: true,

                gridcolor:
                    "rgba(7,27,58,0.08)",

                zeroline: false

            },

            yaxis: {

                automargin: true

            }

        }),

        chartConfig()

    );

}


/* =========================================================
   29. CUSTOMER STATUS
========================================================= */

function renderStatusChart() {

    const element =
        document.getElementById(
            "statusChart"
        );


    if (!element) {
        return;
    }


    const groups = {};


    filteredData.forEach(row => {

        const status =
            cleanText(
                row.status
            ) ||
            "Unknown";


        groups[status] =
            (groups[status] || 0) + 1;

    });


    const labels =
        Object.keys(groups);


    const values =
        Object.values(groups);


    if (!labels.length) {

        renderChartEmpty(
            "statusChart"
        );

        return;

    }


    const trace = {

        labels,

        values,

        type: "pie",

        hole: 0.58,

        textinfo: "percent",

        hovertemplate:
            "%{label}<br>" +
            "Customers/Transactions: %{value:,}" +
            "<extra></extra>"

    };


    Plotly.react(

        element,

        [trace],

        chartLayout({

            showlegend: true,

            legend: {

                orientation: "h",

                y: -0.05

            }

        }),

        chartConfig()

    );

}


/* =========================================================
   30. MONTHLY SALES ACTIVITY
========================================================= */

















/* =========================================================
   31. TOP CUSTOMERS BY SALES
========================================================= */

function renderTopCustomersSalesChart() {

    const element =
        document.getElementById(
            "topCustomersSalesChart"
        );


    if (!element) {
        return;
    }


    const customers = {};


    filteredData.forEach(row => {

        const customer =
            cleanText(
                row.customer
            );


        if (!customer) {
            return;
        }


        customers[customer] =
            (
                customers[customer] || 0
            ) +
            safeNumber(row.total);

    });


    const sorted =
        Object.entries(customers)

            .sort(
                (a, b) =>
                    b[1] -
                    a[1]
            )

            .slice(0, 10);


    if (!sorted.length) {

        renderChartEmpty(
            "topCustomersSalesChart"
        );

        return;

    }


    const labels =
        sorted
            .map(item =>
                shortenText(
                    item[0],
                    28
                )
            )
            .reverse();


    const values =
        sorted
            .map(item =>
                item[1]
            )
            .reverse();


    const trace = {

        x: values,

        y: labels,

        type: "bar",

        orientation: "h",

        hovertemplate:
            "%{y}<br>" +
            "Sales: ₦%{x:,.0f}" +
            "<extra></extra>"

    };


    Plotly.react(

        element,

        [trace],

        chartLayout({

            margin: {

                l: 130,

                r: 20,

                t: 15,

                b: 45

            },

            xaxis: {

                tickprefix: "₦",

                separatethousands: true,

                showgrid: true,

                gridcolor:
                    "rgba(7,27,58,0.08)",

                zeroline: false

            },

            yaxis: {

                automargin: true

            }

        }),

        chartConfig()

    );

}


/* =========================================================
   32. UPDATE DASHBOARD
========================================================= */

async function updateDashboard() {

    /*
     * KPI cards
     */

    updateKPIs();


    /*
     * Dashboard charts
     */

    await renderCharts();


    /*
     * Transaction table
     */

    if (
        typeof renderTransactionsTable ===
        "function"
    ) {

        renderTransactionsTable();

    }


    /*
     * Product table
     */

    if (
        typeof renderProductsTable ===
        "function"
    ) {

        renderProductsTable();

    }


    /*
     * Customer table
     */

    if (
        typeof renderCustomersTable ===
        "function"
    ) {

        renderCustomersTable();

    }


    /*
     * Record count
     */

    const rowCount =
        document.getElementById(
            "rowCount"
        );


    if (rowCount) {

        rowCount.textContent =
            `${formatNumber(
                filteredData.length
            )} records`;

    }

}


/* =========================================================
   33. RESIZE CHARTS
========================================================= */

function resizeCharts() {

    if (
        typeof Plotly ===
        "undefined"
    ) {

        return;

    }


    const chartIds = [

        "salesTrend",

        "categoryTransactionChart",

        "categoryChart",

        "productChart",

        "topCustomersFrequencyChart",

        "statusChart",
      

        "salesActivityChart",

        "topCustomersSalesChart"

    ];


    chartIds.forEach(id => {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        try {

            Plotly.Plots.resize(
                element
            );

        } catch (error) {

            console.warn(
                `Unable to resize chart: ${id}`,
                error
            );

        }

    });

}


/* =========================================================
   34. WINDOW RESIZE
========================================================= */

window.addEventListener(
    "resize",
    debounce(
        resizeCharts,
        200
    )
);


/* =========================================================
   35. DEBOUNCE
========================================================= */

function debounce(
    callback,
    delay = 250
) {

    let timer;


    return function (...args) {

        clearTimeout(timer);


        timer =
            setTimeout(
                () => {

                    callback.apply(
                        this,
                        args
                    );

                },
                delay
            );

    };

}


/* =========================================================
   END OF APP.JS — PART 2
========================================================= */

/* =========================================================
   FIRSTOPTION SOLAR SALES DASHBOARD
   APP.JS — PART 3 OF 3

   Covers:
   - Dashboard charts
   - Product table
   - Customer table
   - Transactions table
   - Pagination
   - CSV export
   - Reset
   - Navigation
   - Formatting helpers
   - Debug access
========================================================= */


/* =========================================================
   21. CHART CONFIGURATION
========================================================= */

function chartConfig() {

    return {
        responsive: true,
        displayModeBar: false,
        scrollZoom: false,
        doubleClick: "reset"
    };

}


/* =========================================================
   22. BASE CHART LAYOUT
========================================================= */

function baseChartLayout() {

    return {

        paper_bgcolor: "rgba(0,0,0,0)",

        plot_bgcolor: "rgba(0,0,0,0)",

        font: {
            family: "Inter, Arial, sans-serif",
            size: 12
        },

        margin: {
            l: 55,
            r: 20,
            t: 20,
            b: 60
        },

        hovermode: "closest",

        showlegend: false,

        xaxis: {
            gridcolor: "rgba(0,0,0,0.05)",
            zeroline: false
        },

        yaxis: {
            gridcolor: "rgba(0,0,0,0.08)",
            zeroline: false
        }

    };

}


/* =========================================================
   23. SALES TREND
========================================================= */

function renderSalesTrend() {

    const element =
        document.getElementById("salesTrend");

    if (!element || typeof Plotly === "undefined") {
        return;
    }


    const monthly = {};


    filteredData.forEach(row => {

        if (!row.date) {
            return;
        }


        const date = parseDateValue(row.date);

        if (!date) {
            return;
        }


        const key =
            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;


        if (!monthly[key]) {
            monthly[key] = 0;
        }


        monthly[key] += Number(row.total) || 0;

    });


    const entries =
        Object.entries(monthly)
            .sort((a, b) =>
                a[0].localeCompare(b[0])
            );


    const labels =
        entries.map(([key]) => {

            const [year, month] =
                key.split("-");

            return new Date(
                Number(year),
                Number(month) - 1,
                1
            ).toLocaleDateString(
                "en-NG",
                {
                    month: "short",
                    year: "numeric"
                }
            );

        });


    const values =
        entries.map(([, value]) => value);


    const trace = {

        x: labels,

        y: values,

        type: "scatter",

        mode: "lines+markers",

        line: {
            width: 3
        },

        marker: {
            size: 7
        },

        hovertemplate:
            "%{x}<br>" +
            "Sales: ₦%{y:,.0f}" +
            "<extra></extra>"

    };


    const layout =
        baseChartLayout();


    layout.yaxis = {
        tickprefix: "₦",
        separatethousands: true
    };


    Plotly.newPlot(
        element,
        [trace],
        layout,
        chartConfig()
    );

}


/* =========================================================
   24. TRANSACTIONS BY CUSTOMER CATEGORY
========================================================= */

function renderCategoryTransactionChart() {

    const element =
        document.getElementById(
            "categoryTransactionChart"
        );

    if (!element || typeof Plotly === "undefined") {
        return;
    }


    const groups = {};


    filteredData.forEach(row => {

        const category =
            cleanText(
                row.customerCategory
            ) || "Uncategorized";


        groups[category] =
            (groups[category] || 0) + 1;

    });


    const labels =
        Object.keys(groups);


    const values =
        Object.values(groups);


    const trace = {

        labels: labels,

        values: values,

        type: "pie",

        hole: 0.58,

        textinfo: "label+percent",

        hovertemplate:
            "%{label}<br>" +
            "Transactions: %{value:,}" +
            "<extra></extra>"

    };


    Plotly.newPlot(

        element,

        [trace],

        {

            ...baseChartLayout(),

            margin: {
                l: 20,
                r: 20,
                t: 20,
                b: 20
            },

            showlegend: true,

            legend: {
                orientation: "h",
                y: -0.05
            }

        },

        chartConfig()

    );

}


/* =========================================================
   25. SALES BY CATEGORY
========================================================= */

function renderCategoryChart() {

    const element =
        document.getElementById(
            "categoryChart"
        );

    if (!element || typeof Plotly === "undefined") {
        return;
    }


    const groups = {};


    filteredData.forEach(row => {

        const category =
            cleanText(
                row.customerCategory
            ) || "Uncategorized";


        groups[category] =
            (groups[category] || 0) +
            (Number(row.total) || 0);

    });


    const sorted =
        Object.entries(groups)
            .sort((a, b) => b[1] - a[1]);


    const labels =
        sorted.map(item => item[0]);


    const values =
        sorted.map(item => item[1]);


    const trace = {

        x: labels,

        y: values,

        type: "bar",

        hovertemplate:
            "%{x}<br>" +
            "Sales: ₦%{y:,.0f}" +
            "<extra></extra>"

    };


    const layout =
        baseChartLayout();


    layout.yaxis = {
        tickprefix: "₦",
        separatethousands: true
    };


    layout.xaxis = {
        automargin: true
    };


    Plotly.newPlot(
        element,
        [trace],
        layout,
        chartConfig()
    );

}


/* =========================================================
   26. TOP PRODUCTS
========================================================= */

function renderProductChart() {

    const element =
        document.getElementById(
            "productChart"
        );

    if (!element || typeof Plotly === "undefined") {
        return;
    }


    const products = {};


    filteredData.forEach(row => {

        const product =
            cleanText(row.item) ||
            "Unknown Product";


        products[product] =
            (products[product] || 0) +
            (Number(row.total) || 0);

    });


    const sorted =
        Object.entries(products)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);


    /*
       Reverse the order so the largest
       appears at the top of the horizontal chart.
    */

    sorted.reverse();


    const labels =
        sorted.map(item =>
            shortenText(item[0], 30)
        );


    const values =
        sorted.map(item => item[1]);


    const trace = {

        x: values,

        y: labels,

        type: "bar",

        orientation: "h",

        hovertemplate:
            "%{y}<br>" +
            "Sales: ₦%{x:,.0f}" +
            "<extra></extra>"

    };


    const layout =
        baseChartLayout();


    layout.xaxis = {
        tickprefix: "₦",
        separatethousands: true
    };


    layout.yaxis = {
        automargin: true
    };


    layout.margin = {
        l: 130,
        r: 20,
        t: 20,
        b: 50
    };


    Plotly.newPlot(
        element,
        [trace],
        layout,
        chartConfig()
    );

}


/* =========================================================
   27. TOP CUSTOMERS BY FREQUENCY
========================================================= */

function renderTopCustomersFrequencyChart() {

    const element =
        document.getElementById(
            "topCustomersFrequencyChart"
        );

    if (!element || typeof Plotly === "undefined") {
        return;
    }


    const customers = {};


    filteredData.forEach(row => {

        const customer =
            cleanText(row.customer) ||
            "Unknown Customer";


        customers[customer] =
            (customers[customer] || 0) + 1;

    });


    const sorted =
        Object.entries(customers)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);


    sorted.reverse();


    const labels =
        sorted.map(item =>
            shortenText(item[0], 28)
        );


    const values =
        sorted.map(item => item[1]);


    const trace = {

        x: values,

        y: labels,

        type: "bar",

        orientation: "h",

        hovertemplate:
            "%{y}<br>" +
            "Transactions: %{x:,}" +
            "<extra></extra>"

    };


    const layout =
        baseChartLayout();


    layout.xaxis = {
        dtick: 1,
        separatethousands: true
    };


    layout.margin = {
        l: 130,
        r: 20,
        t: 20,
        b: 50
    };


    Plotly.newPlot(
        element,
        [trace],
        layout,
        chartConfig()
    );

}


/* =========================================================
   28. CUSTOMER STATUS
========================================================= */

function renderStatusChart() {

    const element =
        document.getElementById(
            "statusChart"
        );

    if (!element || typeof Plotly === "undefined") {
        return;
    }


    const groups = {};


    filteredData.forEach(row => {

        const status =
            cleanText(row.status) ||
            "Unknown";


        groups[status] =
            (groups[status] || 0) + 1;

    });


    const labels =
        Object.keys(groups);


    const values =
        Object.values(groups);


    const trace = {

        labels,

        values,

        type: "pie",

        hole: 0.58,

        textinfo: "label+percent",

        hovertemplate:
            "%{label}<br>" +
            "Transactions: %{value:,}" +
            "<extra></extra>"

    };


    Plotly.newPlot(

        element,

        [trace],

        {

            ...baseChartLayout(),

            margin: {
                l: 20,
                r: 20,
                t: 20,
                b: 20
            },

            showlegend: true,

            legend: {
                orientation: "h",
                y: -0.05
            }

        },

        chartConfig()

    );

}



































/* =========================================================
   29. SALES ACTIVITY
========================================================= */

function renderSalesActivityChart() {

    const element =
        document.getElementById(
            "salesActivityChart"
        );

    if (!element || typeof Plotly === "undefined") {
        return;
    }


    const monthly = {};


    filteredData.forEach(row => {

        if (!row.date) {
            return;
        }


        const date =
            parseDateValue(row.date);


        if (!date) {
            return;
        }


        const key =
            `${date.getFullYear()}-${String(
                date.getMonth() + 1
            ).padStart(2, "0")}`;


        monthly[key] =
            (monthly[key] || 0) + 1;

    });


    const entries =
        Object.entries(monthly)
            .sort((a, b) =>
                a[0].localeCompare(b[0])
            );


    if (!entries.length) {

        renderChartEmpty(
            "salesActivityChart"
        );

        return;

    }


    const labels =
        entries.map(([key]) => {

            const [year, month] =
                key.split("-");


            return new Date(
                Number(year),
                Number(month) - 1,
                1
            ).toLocaleDateString(
                "en-NG",
                {
                    month: "short",
                    year: "numeric"
                }
            );

        });


    const values =
        entries.map(item =>
            item[1]
        );


    /* =====================================================
       DYNAMIC Y-AXIS SCALE
    ===================================================== */

    const maxValue =
        Math.max(...values);


    let tickSize;


    if (maxValue <= 5) {

        tickSize = 1;

    } else if (maxValue <= 10) {

        tickSize = 2;

    } else if (maxValue <= 20) {

        tickSize = 5;

    } else if (maxValue <= 50) {

        tickSize = 10;

    } else if (maxValue <= 100) {

        tickSize = 20;

    } else if (maxValue <= 200) {

        tickSize = 50;

    } else {

        tickSize = 100;

    }


    const yMax =
        Math.ceil(
            maxValue / tickSize
        ) * tickSize;


    /* =====================================================
       CHART TRACE
    ===================================================== */

    const trace = {

        x: labels,

        y: values,

        type: "bar",

        hovertemplate:
            "<b>%{x}</b><br>" +
            "Transactions: %{y:,}" +
            "<extra></extra>"

    };


    /* =====================================================
       CHART LAYOUT
    ===================================================== */

    const layout =
        baseChartLayout();


    layout.yaxis = {

        title: {

            text: "Transactions",

            font: {
                size: 10
            }

        },

        range: [
            0,
            yMax
        ],

        tickmode: "linear",

        dtick: tickSize,

        separatethousands: true,

        showgrid: true,

        gridcolor:
            "rgba(7,27,58,0.08)",

        zeroline: false,

        rangemode: "tozero",

        automargin: true

    };


    /* =====================================================
       RENDER
    ===================================================== */

    Plotly.newPlot(

        element,

        [trace],

        layout,

        chartConfig()

    );

}






/* =========================================================
   30. TOP CUSTOMERS BY SALES
========================================================= */

function renderTopCustomersSalesChart() {

    const element =
        document.getElementById(
            "topCustomersSalesChart"
        );

    if (!element || typeof Plotly === "undefined") {
        return;
    }


    const customers = {};


    filteredData.forEach(row => {

        const customer =
            cleanText(row.customer) ||
            "Unknown Customer";


        customers[customer] =
            (customers[customer] || 0) +
            (Number(row.total) || 0);

    });


    const sorted =
        Object.entries(customers)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);


    sorted.reverse();


    const labels =
        sorted.map(item =>
            shortenText(item[0], 28)
        );


    const values =
        sorted.map(item => item[1]);


    const trace = {

        x: values,

        y: labels,

        type: "bar",

        orientation: "h",

        hovertemplate:
            "%{y}<br>" +
            "Sales: ₦%{x:,.0f}" +
            "<extra></extra>"

    };


    const layout =
        baseChartLayout();


    layout.xaxis = {
        tickprefix: "₦",
        separatethousands: true
    };


    layout.margin = {
        l: 130,
        r: 20,
        t: 20,
        b: 50
    };


    Plotly.newPlot(
        element,
        [trace],
        layout,
        chartConfig()
    );

}


/* =========================================================
   31. RENDER ALL CHARTS
========================================================= */

function renderCharts() {

    renderSalesTrend();

    renderCategoryTransactionChart();

    renderCategoryChart();

    renderProductChart();

    renderTopCustomersFrequencyChart();

    renderStatusChart();

    renderSalesActivityChart();

    renderTopCustomersSalesChart();

}


/* =========================================================
   32. TRANSACTION TABLE
========================================================= */

function renderTransactionsTable() {

    const tbody =
        document.getElementById(
            "salesTable"
        );

    if (!tbody) {
        return;
    }


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredData.length /
                PAGE_SIZE
            )
        );


    if (
        currentPage >
        totalPages
    ) {

        currentPage =
            totalPages;

    }


    const start =
        (currentPage - 1) *
        PAGE_SIZE;


    const rows =
        filteredData
            .slice()
            .sort(
                (a, b) =>
                    dateTimestamp(b.date) -
                    dateTimestamp(a.date)
            )
            .slice(
                start,
                start + PAGE_SIZE
            );


    if (!rows.length) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="8"
                    style="text-align:center"
                >
                    No sales records found.
                </td>
            </tr>
        `;

    }

    else {

        tbody.innerHTML =
            rows.map(row => {

                return `
                    <tr>

                        <td>
                            ${formatDate(row.date)}
                        </td>

                        <td>
                            <strong>
                                ${escapeHTML(
                                    row.customer ||
                                    "—"
                                )}
                            </strong>
                        </td>

                        <td>
                            ${escapeHTML(
                                row.customerCategory ||
                                "—"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                row.invoiceNumber ||
                                "—"
                            )}
                        </td>

                        <td>
                            ${escapeHTML(
                                row.item ||
                                "—"
                            )}
                        </td>

                        <td>
                            ${formatNumber(
                                row.quantity
                            )}
                        </td>

                        <td>
                            ${formatNaira(
                                row.rate
                            )}
                        </td>

                        <td>
                            <strong>
                                ${formatNaira(
                                    row.total
                                )}
                            </strong>
                        </td>

                    </tr>
                `;

            }).join("");

    }


    const rowCount =
        document.getElementById(
            "rowCount"
        );


    if (rowCount) {

        rowCount.textContent =
            `${filteredData.length.toLocaleString(
                "en-NG"
            )} records`;

    }


    updatePagination();

}


/* =========================================================
   33. PAGINATION
========================================================= */

function updatePagination() {

    const totalPages =
        Math.max(
            1,
            Math.ceil(
                filteredData.length /
                PAGE_SIZE
            )
        );


    const pageInfo =
        document.getElementById(
            "pageInfo"
        );


    if (pageInfo) {

        pageInfo.textContent =
            `Page ${currentPage} of ${totalPages}`;

    }


    const previous =
        document.getElementById(
            "prevBtn"
        );


    const next =
        document.getElementById(
            "nextBtn"
        );


    if (previous) {

        previous.disabled =
            currentPage <= 1;

    }


    if (next) {

        next.disabled =
            currentPage >= totalPages;

    }

}


/* =========================================================
   34. PAGINATION EVENTS
========================================================= */

function setupPagination() {

    const previous =
        document.getElementById(
            "prevBtn"
        );


    const next =
        document.getElementById(
            "nextBtn"
        );


    if (previous) {

        previous.addEventListener(
            "click",
            function () {

                if (currentPage > 1) {

                    currentPage--;

                    renderTransactionsTable();

                }

            }
        );

    }


    if (next) {

        next.addEventListener(
            "click",
            function () {

                const totalPages =
                    Math.max(
                        1,
                        Math.ceil(
                            filteredData.length /
                            PAGE_SIZE
                        )
                    );


                if (
                    currentPage <
                    totalPages
                ) {

                    currentPage++;

                    renderTransactionsTable();

                }

            }
        );

    }

}


/* =========================================================
   35. PRODUCTS TABLE
========================================================= */

function renderProductsTable() {

    const tbody =
        document.getElementById(
            "productsTable"
        );


    if (!tbody) {
        return;
    }


    const products = {};


    filteredData.forEach(row => {

        const product =
            cleanText(row.item) ||
            "Unknown Product";


        if (!products[product]) {

            products[product] = {

                transactions: 0,

                quantity: 0,

                sales: 0,

                rateTotal: 0,

                rateCount: 0

            };

        }


        products[product].transactions++;

        products[product].quantity +=
            Number(row.quantity) || 0;

        products[product].sales +=
            Number(row.total) || 0;


        const rate =
            Number(row.rate);


        if (
            Number.isFinite(rate)
        ) {

            products[product].rateTotal +=
                rate;

            products[product].rateCount++;

        }

    });


    const rows =
        Object.entries(products)
            .sort(
                (a, b) =>
                    b[1].sales -
                    a[1].sales
            );


    if (!rows.length) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="5"
                    style="text-align:center"
                >
                    No products found.
                </td>
            </tr>
        `;

    }

    else {

        tbody.innerHTML =
            rows.map(
                ([product, data]) => {

                    const averageRate =
                        data.rateCount
                            ? data.rateTotal /
                              data.rateCount
                            : 0;


                    return `
                        <tr>

                            <td>
                                <strong>
                                    ${escapeHTML(
                                        product
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${formatNumber(
                                    data.transactions
                                )}
                            </td>

                            <td>
                                ${formatNumber(
                                    data.quantity
                                )}
                            </td>

                            <td>
                                <strong>
                                    ${formatNaira(
                                        data.sales
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${formatNaira(
                                    averageRate
                                )}
                            </td>

                        </tr>
                    `;

                }
            ).join("");

    }


    const count =
        document.getElementById(
            "productCount"
        );


    if (count) {

        count.textContent =
            `${rows.length.toLocaleString(
                "en-NG"
            )} products`;

    }

}


/* =========================================================
   36. CUSTOMERS TABLE
========================================================= */

function renderCustomersTable() {

    const tbody =
        document.getElementById(
            "customersTable"
        );


    if (!tbody) {
        return;
    }


    const customers = {};


    filteredData.forEach(row => {

        const customer =
            cleanText(row.customer) ||
            "Unknown Customer";


        if (!customers[customer]) {

            customers[customer] = {

                contact:
                    row.contact || "",

                status:
                    row.status || "",

                category:
                    row.customerCategory || "",

                transactions: 0,

                sales: 0

            };

        }


        customers[customer].transactions++;

        customers[customer].sales +=
            Number(row.total) || 0;


        if (
            !customers[customer].contact &&
            row.contact
        ) {

            customers[customer].contact =
                row.contact;

        }

    });


    const rows =
        Object.entries(customers)
            .sort(
                (a, b) =>
                    b[1].sales -
                    a[1].sales
            );


    if (!rows.length) {

        tbody.innerHTML = `
            <tr>
                <td
                    colspan="6"
                    style="text-align:center"
                >
                    No customers found.
                </td>
            </tr>
        `;

    }

    else {

        tbody.innerHTML =
            rows.map(
                ([customer, data]) => {

                    return `
                        <tr>

                            <td>
                                <strong>
                                    ${escapeHTML(
                                        customer
                                    )}
                                </strong>
                            </td>

                            <td>
                                ${escapeHTML(
                                    data.contact ||
                                    "—"
                                )}
                            </td>

                            <td>
                                ${statusBadge(
                                    data.status
                                )}
                            </td>

                            <td>
                                ${escapeHTML(
                                    data.category ||
                                    "—"
                                )}
                            </td>

                            <td>
                                ${formatNumber(
                                    data.transactions
                                )}
                            </td>

                            <td>
                                <strong>
                                    ${formatNaira(
                                        data.sales
                                    )}
                                </strong>
                            </td>

                        </tr>
                    `;

                }
            ).join("");

    }


    const count =
        document.getElementById(
            "customerCount"
        );


    if (count) {

        count.textContent =
            `${rows.length.toLocaleString(
                "en-NG"
            )} customers`;

    }

}


/* =========================================================
   37. STATUS BADGE
========================================================= */

function statusBadge(status) {

    if (!status) {
        return "—";
    }


    const value =
        cleanText(status);


    let className =
        "badge badge-neutral";


    const lower =
        value.toLowerCase();


    if (
        lower.includes("return")
    ) {

        className =
            "badge badge-success";

    }

    else if (
        lower.includes("new")
    ) {

        className =
            "badge badge-primary";

    }


    return `
        <span class="${className}">
            ${escapeHTML(value)}
        </span>
    `;

}


/* =========================================================
   38. EXPORT FILTERED CSV
========================================================= */

function exportFilteredCSV() {

    if (
        typeof Papa === "undefined"
    ) {

        alert(
            "Papa Parse is not available."
        );

        return;

    }


    if (!filteredData.length) {

        alert(
            "There are no filtered records to export."
        );

        return;

    }


    const exportData =
        filteredData.map(row => ({

            Date:
                row.date || "",

            Customer:
                row.customer || "",

            "Sales Order ID":
                row.salesOrderId || "",

            Contact:
                row.contact || "",

            Status:
                row.status || "",

            "Customer Category":
                row.customerCategory || "",

            Invoice_Number:
                row.invoiceNumber || "",

            Item:
                row.item || "",

            "Part Number":
                row.partNumber || "",

            Quantity:
                row.quantity || 0,

            Rate:
                row.rate || 0,

            Total:
                row.total || 0,

            Remark:
                row.remark || ""

        }));


    const csv =
        Papa.unparse(
            exportData
        );


    const blob =
        new Blob(
            [csv],
            {
                type:
                    "text/csv;charset=utf-8;"
            }
        );


    const url =
        URL.createObjectURL(
            blob
        );


    const link =
        document.createElement("a");


    link.href = url;


    link.download =
        `firstoption_sales_filtered_${getFileDate()}.csv`;


    document.body.appendChild(
        link
    );


    link.click();


    document.body.removeChild(
        link
    );


    URL.revokeObjectURL(
        url
    );

}


/* =========================================================
   39. EXPORT BUTTON SETUP
========================================================= */

function setupExport() {

    const button =
        document.getElementById(
            "exportBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        exportFilteredCSV
    );

}

    

/* =========================================================
   41. SHOW VIEW
========================================================= */

    /*

    
    







       Filters are dashboard-specific.
    */

    const filters =
        document.querySelector(
            ".filters"
        );


    if (filters) {

        filters.style.display =
            view === "dashboard"
                ? ""
                : "none";

    }


    /*
       Update active navigation.
    */

    document
        .querySelectorAll(
            ".nav-item"
        )
        .forEach(link => {

            link.classList.toggle(
                "active",
                link.dataset.view === view
            );

        });


    /*
       Plotly needs a resize after a
       hidden container becomes visible.
    */

    if (
        view === "dashboard" &&
        typeof Plotly !== "undefined"
    ) {

        setTimeout(
            () => {

                document
                    .querySelectorAll(".chart")
                    .forEach(chart => {

                        try {

                            Plotly.Plots.resize(
                                chart
                            );

                        }

                        catch (error) {

                            console.warn(
                                "Chart resize failed:",
                                error
                            );

                        }

                    });

            },
            100
        );

    }




/* =========================================================
   42. RESET DASHBOARD
========================================================= */

function resetDashboard() {

    const dateFrom =
        document.getElementById(
            "dateFrom"
        );


    const dateTo =
        document.getElementById(
            "dateTo"
        );


    const category =
        document.getElementById(
            "categoryFilter"
        );


    const customer =
        document.getElementById(
            "customerFilter"
        );


    const item =
        document.getElementById(
            "itemFilter"
        );


    const search =
        document.getElementById(
            "searchFilter"
        );


    if (dateFrom) {
        dateFrom.value = "";
    }


    if (dateTo) {
        dateTo.value = "";
    }


    if (category) {
        category.value = "";
    }


    if (customer) {
        customer.value = "";
    }


    if (item) {
        item.value = "";
    }


    if (search) {
        search.value = "";
    }


    filteredData =
        [...allData];


    currentPage = 1;


    updateDashboard();

}


/* =========================================================
   43. RESET BUTTON SETUP
========================================================= */

function setupReset() {

    const button =
        document.getElementById(
            "resetBtn"
        );


    if (!button) {
        return;
    }


    button.addEventListener(
        "click",
        resetDashboard
    );

}


/* =========================================================
   44. SEARCH SETUP
========================================================= */

function setupSearch() {

    const input =
        document.getElementById(
            "searchFilter"
        );


    if (!input) {
        return;
    }


    input.addEventListener(
        "input",
        function () {

            applyFilters();

        }
    );

}


/* =========================================================
   45. FILTER SETUP
========================================================= */

function setupFilters() {

    const ids = [

        "dateFrom",

        "dateTo",

        "categoryFilter",

        "customerFilter",

        "itemFilter"

    ];


    ids.forEach(id => {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        element.addEventListener(
            "change",
            function () {

                applyFilters();

            }
        );

    });

}


/* =========================================================
   46. APPLY FILTERS
========================================================= */

function applyFilters() {

    const dateFrom =
        document.getElementById(
            "dateFrom"
        )?.value || "";


    const dateTo =
        document.getElementById(
            "dateTo"
        )?.value || "";


    const category =
        document.getElementById(
            "categoryFilter"
        )?.value || "";


    const customer =
        document.getElementById(
            "customerFilter"
        )?.value || "";


    const item =
        document.getElementById(
            "itemFilter"
        )?.value || "";


    const search =
        document.getElementById(
            "searchFilter"
        )?.value
            ?.trim()
            .toLowerCase() || "";


    filteredData =
        allData.filter(row => {

            /*
               DATE
            */

            const rowDate =
                parseDateValue(
                    row.date
                );


            let dateMatch = true;


            if (
                dateFrom &&
                rowDate
            ) {

                dateMatch =
                    dateMatch &&
                    dateToInputTimestamp(
                        dateFrom
                    ) <=
                    dateTimestamp(
                        rowDate
                    );

            }


            if (
                dateTo &&
                rowDate
            ) {

                dateMatch =
                    dateMatch &&
                    dateTimestamp(
                        rowDate
                    ) <=
                    dateToInputTimestamp(
                        dateTo
                    );

            }


            /*
               CATEGORY
            */

            const categoryMatch =
                !category ||
                row.customerCategory ===
                    category;


            /*
               CUSTOMER
            */

            const customerMatch =
                !customer ||
                row.customer ===
                    customer;


            /*
               ITEM
            */

            const itemMatch =
                !item ||
                row.item ===
                    item;


            /*
               SEARCH
            */

            const searchable = [

                row.customer,

                row.invoiceNumber,

                row.item,

                row.partNumber,

                row.customerCategory,

                row.status,

                row.contact,

                row.remark,

                row.salesOrderId

            ]

                .filter(
                    value =>
                        value !== null &&
                        value !== undefined
                )

                .join(" ")

                .toLowerCase();


            const searchMatch =
                !search ||
                searchable.includes(
                    search
                );


            return (

                dateMatch &&

                categoryMatch &&

                customerMatch &&

                itemMatch &&

                searchMatch

            );

        });


    currentPage = 1;


    updateDashboard();

}


/* =========================================================
   47. UPDATE DASHBOARD
========================================================= */
function updateDashboard() {

    updateKPIs();

    updateKPIChanges();

    renderCharts();

    renderTransactionsTable();

    renderProductsTable();

    renderCustomersTable();

}
/* =========================================================
   48. KPI UPDATE
========================================================= */

function updateKPIs() {

    const records =
        filteredData;


    /*
       TOTAL SALES
    */

    const totalSales =
        records.reduce(
            (sum, row) =>
                sum +
                (Number(row.total) || 0),
            0
        );


    /*
       INVOICES
    */

    const invoices =
        new Set(

            records

                .map(
                    row =>
                        cleanText(
                            row.invoiceNumber
                        )
                )

                .filter(Boolean)

        ).size;


    /*
       UNITS
    */

    const units =
        records.reduce(
            (sum, row) =>
                sum +
                (Number(row.quantity) || 0),
            0
        );


    /*
       CUSTOMERS
    */

    const customers =
        new Set(

            records

                .map(
                    row =>
                        cleanText(
                            row.customer
                        )
                )

                .filter(Boolean)

        ).size;


    /*
       AVERAGE TRANSACTION

       Based on recorded sales rows.
    */

    const average =
        records.length
            ? totalSales /
              records.length
            : 0;


    setText(
        "kpiSales",
        formatNaira(totalSales)
    );


    setText(
        "kpiInvoices",
        formatNumber(invoices)
    );


    setText(
        "kpiUnits",
        formatNumber(units)
    );


    setText(
        "kpiCustomers",
        formatNumber(customers)
    );


    setText(
        "kpiAverage",
        formatNaira(average)
    );


    setText(
        "kpiSalesMeta",
        `${records.length.toLocaleString(
            "en-NG"
        )} transactions`
    );


    /*
       Current version intentionally leaves
       change indicators blank because a
       previous-month comparison requires
       date-period logic.

       This prevents misleading percentages.
    */

    clearChangeIndicators();

}


/* =========================================================
   49. CHANGE INDICATORS
========================================================= */

function clearChangeIndicators() {

    const ids = [

        "kpiSalesChange",

        "kpiInvoicesChange",

        "kpiUnitsChange",

        "kpiCustomersChange",

        "kpiAverageChange"

    ];


    ids.forEach(id => {

        const element =
            document.getElementById(id);


        if (element) {

            element.textContent =
                "";

        }

    });

}


/* =========================================================
   50. POPULATE FILTERS
========================================================= */

function populateFilters() {

    populateSelect(
        "categoryFilter",
        uniqueValues(
            allData,
            "customerCategory"
        ),
        "All categories"
    );


    populateSelect(
        "customerFilter",
        uniqueValues(
            allData,
            "customer"
        ),
        "All customers"
    );


    populateSelect(
        "itemFilter",
        uniqueValues(
            allData,
            "item"
        ),
        "All items"
    );

}


/* =========================================================
   51. UNIQUE VALUES
========================================================= */

function uniqueValues(
    data,
    field
) {

    return [

        ...new Set(

            data

                .map(
                    row =>
                        cleanText(
                            row[field]
                        )
                )

                .filter(Boolean)

        )

    ].sort(
        (a, b) =>
            a.localeCompare(
                b,
                undefined,
                {
                    sensitivity:
                        "base"
                }
            )
    );

}


/* =========================================================
   52. POPULATE SELECT
========================================================= */

function populateSelect(
    elementId,
    values,
    defaultText
) {

    const select =
        document.getElementById(
            elementId
        );


    if (!select) {
        return;
    }


    select.innerHTML = "";


    const defaultOption =
        document.createElement(
            "option"
        );


    defaultOption.value = "";

    defaultOption.textContent =
        defaultText;


    select.appendChild(
        defaultOption
    );


    values.forEach(value => {

        const option =
            document.createElement(
                "option"
            );


        option.value = value;

        option.textContent = value;


        select.appendChild(
            option
        );

    });

}


/* =========================================================
   53. NUMBER FORMATTING
========================================================= */

function formatNumber(value) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {
        return "0";
    }


    return number.toLocaleString(
        "en-NG",
        {
            maximumFractionDigits: 2
        }
    );

}


/* =========================================================
   54. NAIRA FORMATTING
========================================================= */

function formatNaira(value) {

    const number =
        Number(value);


    if (!Number.isFinite(number)) {
        return "₦0";
    }


    return (
        "₦" +
        number.toLocaleString(
            "en-NG",
            {
                minimumFractionDigits: 0,
                maximumFractionDigits: 0
            }
        )
    );

}


/* =========================================================
   55. DATE FORMATTING
========================================================= */

function formatDate(value) {

    const date =
        parseDateValue(value);


    if (!date) {

        return value
            ? escapeHTML(value)
            : "—";

    }


    return date.toLocaleDateString(
        "en-NG",
        {
            day: "2-digit",
            month: "short",
            year: "numeric"
        }
    );

}


/* =========================================================
   56. DATE PARSER
========================================================= */

function parseDateValue(value) {

    if (!value) {
        return null;
    }


    if (
        value instanceof Date
    ) {

        return isNaN(value)
            ? null
            : value;

    }


    const text =
        String(value)
            .trim();


    if (!text) {
        return null;
    }


    /*
       YYYY-MM-DD
    */

    let match =
        text.match(
            /^(\d{4})-(\d{1,2})-(\d{1,2})/
        );


    if (match) {

        const date =
            new Date(
                Number(match[1]),
                Number(match[2]) - 1,
                Number(match[3])
            );


        return isNaN(date)
            ? null
            : date;

    }


    /*
       DD/MM/YYYY
       DD-MM-YYYY
    */

    match =
        text.match(
            /^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})/
        );


    if (match) {

        const date =
            new Date(
                Number(match[3]),
                Number(match[2]) - 1,
                Number(match[1])
            );


        return isNaN(date)
            ? null
            : date;

    }


    /*
       Native JavaScript fallback.
    */

    const parsed =
        new Date(text);


    if (
        !isNaN(parsed)
    ) {

        return parsed;

    }


    return null;

}


/* =========================================================
   57. DATE TIMESTAMP
========================================================= */

function dateTimestamp(value) {

    const date =
        parseDateValue(value);


    return date
        ? date.getTime()
        : 0;

}


/* =========================================================
   58. DATE INPUT TIMESTAMP
========================================================= */

function dateToInputTimestamp(value) {

    if (!value) {
        return 0;
    }


    const parts =
        value.split("-");


    if (parts.length !== 3) {
        return 0;
    }


    return new Date(
        Number(parts[0]),
        Number(parts[1]) - 1,
        Number(parts[2])
    ).getTime();

}


/* =========================================================
   59. TEXT CLEANING
========================================================= */

function cleanText(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)
        .trim()
        .replace(/\s+/g, " ");

}


/* =========================================================
   60. SHORTEN TEXT
========================================================= */

function shortenText(
    text,
    maxLength = 30
) {

    const value =
        cleanText(text);


    if (
        value.length <=
        maxLength
    ) {

        return value;

    }


    return (
        value.substring(
            0,
            maxLength - 3
        ) +
        "..."
    );

}


/* =========================================================
   61. ESCAPE HTML
========================================================= */

function escapeHTML(value) {

    if (
        value === null ||
        value === undefined
    ) {

        return "";

    }


    return String(value)

        .replace(
            /&/g,
            "&amp;"
        )

        .replace(
            /</g,
            "&lt;"
        )

        .replace(
            />/g,
            "&gt;"
        )

        .replace(
            /"/g,
            "&quot;"
        )

        .replace(
            /'/g,
            "&#039;"
        );

}


/* =========================================================
   62. SET TEXT
========================================================= */

function setText(
    id,
    value
) {

    const element =
        document.getElementById(id);


    if (element) {

        element.textContent =
            value;

    }

}


/* =========================================================
   63. FILE DATE
========================================================= */

function getFileDate() {

    const now =
        new Date();


    const year =
        now.getFullYear();


    const month =
        String(
            now.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            now.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;

}


/* =========================================================
   64. LAST UPDATED
========================================================= */

function updateLastUpdated() {

    /*
       The supplied HTML does not currently
       contain a lastUpdated element.

       This function therefore safely exits
       until one is added.
    */

    const element =
        document.getElementById(
            "lastUpdated"
        );


    if (!element) {
        return;
    }


    element.textContent =
        new Date().toLocaleString(
            "en-NG",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit"
            }
        );

}


/* =========================================================
   65. REFRESH DASHBOARD
========================================================= */

function refreshDashboard() {

    if (
        typeof loadCSVData ===
        "function"
    ) {

        loadCSVData();

        return;

    }


    filteredData =
        [...allData];


    currentPage = 1;


    updateDashboard();

}


/* =========================================================
   66. WINDOW RESIZE
========================================================= */

function setupChartResize() {

    window.addEventListener(
        "resize",
        function () {

            if (
                typeof Plotly ===
                "undefined"
            ) {

                return;

            }


            document
                .querySelectorAll(
                    ".chart"
                )
                .forEach(chart => {

                    try {

                        Plotly.Plots.resize(
                            chart
                        );

                    }

                    catch (error) {

                        console.warn(
                            "Chart resize error:",
                            error
                        );

                    }

                });

        }
    );

}


/* =========================================================
   67. DEBUG ACCESS
========================================================= */

window.FirstoptionDashboard = {

    getAllData: function () {

        return allData;

    },


    getFilteredData: function () {

        return filteredData;

    },


    refresh: function () {

        updateDashboard();

    },


    reset: function () {

        resetDashboard();

    },


    applyFilters: function () {

        applyFilters();

    },


    showView: function (view) {

        showView(view);

    }

};


/* =========================================================
   68. STARTUP SAFETY CHECK
========================================================= */

console.log(
    "Firstoption Solar Sales Dashboard — Part 3 loaded."
);


/*
   Final validation after the complete app.js
   has been loaded.
*/

setTimeout(
    function () {

        console.log(
            "Dashboard runtime check:",
            {
                allData:
                    typeof allData !==
                    "undefined"
                        ? allData.length
                        : "not initialized",

                filteredData:
                    typeof filteredData !==
                    "undefined"
                        ? filteredData.length
                        : "not initialized",

                plotly:
                    typeof Plotly !==
                    "undefined",

                papa:
                    typeof Papa !==
                    "undefined"
            }
        );

    },
    500
);


/* =========================================================
   END OF PART 3
========================================================= */

/* =========================================================
   KPI MONTH-OVER-MONTH CHANGE
   Compares the latest month in the dataset with the
   immediately preceding month.
========================================================= */

function updateKPIChanges() {

    const records = filteredData;

    if (!records || !records.length) {
        clearKPIChanges();
        return;
    }

    /*
       Group records by YYYY-MM
    */

    const monthly = {};

    records.forEach(row => {

        if (!row.date) {
            return;
        }

        const date = parseSalesDate(row.date);

        if (!date || isNaN(date.getTime())) {
            return;
        }

        const key =
            date.getFullYear() +
            "-" +
            String(date.getMonth() + 1).padStart(2, "0");

        if (!monthly[key]) {
            monthly[key] = [];
        }

        monthly[key].push(row);

    });


    const months =
        Object.keys(monthly).sort();


    /*
       Need at least two months
    */

    if (months.length < 2) {

        clearKPIChanges();

        return;
    }


    /*
       Latest month
    */

    const currentMonth =
        months[months.length - 1];


    /*
       Previous month
    */

    const previousMonth =
        months[months.length - 2];


    const current =
        calculateMonthlyMetrics(
            monthly[currentMonth]
        );


    const previous =
        calculateMonthlyMetrics(
            monthly[previousMonth]
        );


    /*
       Calculate and display changes
    */

    setKPIChange(
        "kpiSalesChange",
        current.sales,
        previous.sales
    );


    setKPIChange(
        "kpiInvoicesChange",
        current.invoices,
        previous.invoices
    );


    setKPIChange(
        "kpiUnitsChange",
        current.units,
        previous.units
    );


    setKPIChange(
        "kpiCustomersChange",
        current.customers,
        previous.customers
    );


    setKPIChange(
        "kpiAverageChange",
        current.average,
        previous.average
    );


    console.log(
        "KPI month comparison:",
        {
            currentMonth,
            previousMonth,
            current,
            previous
        }
    );

}


/* =========================================================
   CALCULATE MONTHLY METRICS
========================================================= */

function calculateMonthlyMetrics(records) {

    const sales =
        records.reduce(
            (sum, row) =>
                sum + Number(row.total || 0),
            0
        );


    const units =
        records.reduce(
            (sum, row) =>
                sum + Number(row.quantity || 0),
            0
        );


    const invoices =
        new Set(

            records
                .map(row =>
                    String(
                        row.invoiceNumber || ""
                    ).trim()
                )
                .filter(Boolean)

        ).size;


    const customers =
        new Set(

            records
                .map(row =>
                    String(
                        row.customer || ""
                    ).trim()
                )
                .filter(Boolean)

        ).size;


    const average =
        records.length
            ? sales / records.length
            : 0;


    return {

        sales,
        invoices,
        units,
        customers,
        average

    };

}


/* =========================================================
   SET KPI CHANGE
========================================================= */

function setKPIChange(
    elementId,
    currentValue,
    previousValue
) {

    const element =
        document.getElementById(
            elementId
        );


    if (!element) {
        return;
    }


    /*
       If previous month has no value,
       percentage cannot be calculated.
    */

    if (
        previousValue === 0 ||
        previousValue === null ||
        previousValue === undefined
    ) {

        element.textContent = "—";

        element.className =
            "kpi-change neutral";

        return;

    }


    const change =
        (
            (
                currentValue -
                previousValue
            )
            /
            previousValue
        ) * 100;


    const rounded =
        Math.abs(change).toFixed(1);


    /*
       Increase
    */

    if (change > 0) {

        element.textContent =
            `▲ ${rounded}%`;

        element.className =
            "kpi-change positive";

    }


    /*
       Decrease
    */

    else if (change < 0) {

        element.textContent =
            `▼ ${rounded}%`;

        element.className =
            "kpi-change negative";

    }


    /*
       No change
    */

    else {

        element.textContent =
            "0.0%";

        element.className =
            "kpi-change neutral";

    }


    element.title =
        "Compared with previous month";

}


/* =========================================================
   CLEAR KPI CHANGES
========================================================= */

function clearKPIChanges() {

    const ids = [

        "kpiSalesChange",
        "kpiInvoicesChange",
        "kpiUnitsChange",
        "kpiCustomersChange",
        "kpiAverageChange"

    ];


    ids.forEach(id => {

        const element =
            document.getElementById(id);


        if (!element) {
            return;
        }


        element.textContent =
            "—";

        element.className =
            "kpi-change neutral";

    });

}

/* =========================================================
   PARSE SALES DATE
========================================================= */

function parseSalesDate(value) {

    if (!value) {
        return null;
    }


    /*
       Already a Date object
    */

    if (value instanceof Date) {
        return value;
    }


    const text =
        String(value).trim();


    /*
       ISO / normal browser-readable dates
    */

    let date =
        new Date(text);


    if (!isNaN(date.getTime())) {
        return date;
    }


    /*
       Handle DD/MM/YYYY
    */

    const match =
        text.match(
            /^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/
        );


    if (match) {

        const day =
            Number(match[1]);

        const month =
            Number(match[2]) - 1;

        const year =
            Number(match[3]);


        date =
            new Date(
                year,
                month,
                day
            );


        if (!isNaN(date.getTime())) {
            return date;
        }

    }


    return null;

}



/* =========================================================
   FINAL SALES DASHBOARD NAVIGATION
   ========================================================= */

function switchSalesView(viewName) {

    console.log(
        "Switching to view:",
        viewName
    );


    /* -----------------------------------------------------
       VIEW ELEMENTS
    ----------------------------------------------------- */

    const dashboardView =
        document.getElementById(
            "dashboardView"
        );

    const transactionsView =
        document.getElementById(
            "transactionsView"
        );

    const productsView =
        document.getElementById(
            "productsView"
        );

    const customersView =
        document.getElementById(
            "customersView"
        );


    /* -----------------------------------------------------
       ALL PAGE VIEWS
    ----------------------------------------------------- */

    const pageViews = [

        dashboardView,
        transactionsView,
        productsView,
        customersView

    ];


    /* -----------------------------------------------------
       HIDE ALL PAGE VIEWS
    ----------------------------------------------------- */

    pageViews.forEach(view => {

        if (view) {

            view.style.setProperty(
                "display",
                "none",
                "important"
            );

        }

    });


    /* -----------------------------------------------------
       HIDE DASHBOARD FILTERS
       AND OTHER DASHBOARD-ONLY ELEMENTS
    ----------------------------------------------------- */

    document
        .querySelectorAll(
            ".view-dashboard"
        )
        .forEach(element => {

            element.style.setProperty(
                "display",
                "none",
                "important"
            );

        });


    /* -----------------------------------------------------
       SHOW SELECTED VIEW
    ----------------------------------------------------- */

    if (
        viewName ===
        "dashboard"
    ) {

        if (dashboardView) {

            dashboardView.style.setProperty(
                "display",
                "block",
                "important"
            );

        }


        /* Show filters */

        document
            .querySelectorAll(
                ".view-dashboard"
            )
            .forEach(element => {

                element.style.setProperty(
                    "display",
                    "",
                    "important"
                );

            });


        /* Re-render charts after view becomes visible */

        setTimeout(
            () => {

                if (
                    typeof renderSalesTrend ===
                    "function"
                ) {

                    renderSalesTrend(
                        filteredData
                    );

                }


                if (
                    typeof renderCategoryTransactions ===
                    "function"
                ) {

                    renderCategoryTransactions(
                        filteredData
                    );

                }


                if (
                    typeof renderCategorySales ===
                    "function"
                ) {

                    renderCategorySales(
                        filteredData
                    );

                }


                if (
                    typeof renderTopProducts ===
                    "function"
                ) {

                    renderTopProducts(
                        filteredData
                    );

                }


                if (
                    typeof renderTopCustomersFrequency ===
                    "function"
                ) {

                    renderTopCustomersFrequency(
                        filteredData
                    );

                }


                if (
                    typeof renderCustomerStatus ===
                    "function"
                ) {

                    renderCustomerStatus(
                        filteredData
                    );

                }


                if (
                    typeof renderSalesActivity ===
                    "function"
                ) {

                    renderSalesActivity(
                        filteredData
                    );

                }


                if (
                    typeof renderTopCustomersSales ===
                    "function"
                ) {

                    renderTopCustomersSales(
                        filteredData
                    );

                }

            },
            50
        );

    }


    /* -----------------------------------------------------
       TRANSACTIONS
    ----------------------------------------------------- */

    else if (
        viewName ===
        "transactions"
    ) {

        if (transactionsView) {

            transactionsView.style.setProperty(
                "display",
                "block",
                "important"
            );

        }


        if (
            typeof renderTransactionsTable ===
            "function"
        ) {

            currentPage = 1;

            renderTransactionsTable(
                filteredData
            );

        }

    }


    /* -----------------------------------------------------
       PRODUCTS
    ----------------------------------------------------- */

    else if (
        viewName ===
        "products"
    ) {

        if (productsView) {

            productsView.style.setProperty(
                "display",
                "block",
                "important"
            );

        }


        if (
            typeof renderProductsTable ===
            "function"
        ) {

            renderProductsTable(
                filteredData
            );

        }

    }


    /* -----------------------------------------------------
       CUSTOMERS
    ----------------------------------------------------- */

    else if (
        viewName ===
        "customers"
    ) {

        if (customersView) {

            customersView.style.setProperty(
                "display",
                "block",
                "important"
            );

        }


        if (
            typeof renderCustomersTable ===
            "function"
        ) {

            renderCustomersTable(
                filteredData
            );

        }

    }


    /* -----------------------------------------------------
       UPDATE ACTIVE NAVIGATION
    ----------------------------------------------------- */

    document
        .querySelectorAll(
            ".main-navigation .nav-item"
        )
        .forEach(item => {

            item.classList.toggle(
                "active",
                item.dataset.view ===
                viewName
            );

        });


    /* -----------------------------------------------------
       UPDATE URL HASH
    ----------------------------------------------------- */

    if (
        window.location.hash !==
        "#" + viewName
    ) {

        history.replaceState(
            null,
            "",
            "#" + viewName
        );

    }


    /* -----------------------------------------------------
       RETURN TO TOP
    ----------------------------------------------------- */

    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });


    console.log(
        "View successfully switched to:",
        viewName
    );

}


/* =========================================================
   INITIALIZE NAVIGATION
========================================================= */

function initializeSalesNavigation() {

    const navigation =
        document.querySelector(
            ".main-navigation"
        );


    if (!navigation) {

        console.error(
            "Main navigation was not found."
        );

        return;

    }


    /* -----------------------------------------------------
       EVENT DELEGATION

       This is more reliable than attaching individual
       listeners to every link.
    ----------------------------------------------------- */

    navigation.addEventListener(
        "click",
        function(event) {

            const link =
                event.target.closest(
                    ".nav-item"
                );


            if (!link) {
                return;
            }


            event.preventDefault();


            const viewName =
                link.getAttribute(
                    "data-view"
                );


            console.log(
                "Navigation clicked:",
                viewName
            );


            if (!viewName) {

                console.warn(
                    "Navigation item has no data-view."
                );

                return;

            }


            switchSalesView(
                viewName
            );

        }
    );


    /* -----------------------------------------------------
       INITIAL VIEW
    ----------------------------------------------------- */

    const hash =
        window.location.hash
            .replace(
                "#",
                ""
            )
            .trim();


    const validViews = [

        "dashboard",
        "transactions",
        "products",
        "customers"

    ];


    const initialView =
        validViews.includes(hash)
            ? hash
            : "dashboard";


    switchSalesView(
        initialView
    );


    console.log(
        "Sales navigation initialized."
    );

}


/* =========================================================
   START NAVIGATION
========================================================= */

document.addEventListener(
    "DOMContentLoaded",
    function() {

        initializeSalesNavigation();

    }
);