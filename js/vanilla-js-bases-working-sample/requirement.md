# Project Overview

To assess your ability to do front end development work, you will be required to create a simple Cryptocurrency dashboard. The dashboard will use information from the Cryptocurrency Market Capitalizations API (coinmarketcap.com) to construct a table. As a user, I should be able to see the different cryptocurrencies, filter them by using a search box and reload the table if the currency changes, based on the selection from a dropdown.

## Requirements

- The columns in the table should be:
    - Rank e.g. 1
    - Name e.g. Bitcoin
    - Symbol e.g. BTC
    - Price (In the currently selected currency. No need to add the related currency symbol)
    - 24h Volume (In the currently selected currency)
    - Market Cap (In the currently selected currency)
    - Percent change in last hour
    - Percent change in last 24 hours
    - Percent change in last 7 days
- The dropdown should support selecting the following currencies:
    - EUR
    - GBP
    - ZAR (default selected option)
    - NZD
- The table should be searchable for the different cryptocurrencies and update dynamically. Removing the non-relevant rows.
- Layout should be done using a modern layout system such as flexbox or grids. 
- Make use of Cryptocurrency Market Capitalizations API (coinmarketcap.com/api)
- Do not make use of any front end Javascript framework (e.g. React or Angular) or existing table - library such as (www.datatables.net) for creating the project. You may however use other libraries to provide including CSS frameworks e.g. Materialize CSS.
- The project should be responsive for different viewport sizes. 
- Make use of the fetch API for all requests. You are not expected to polyfill it for older environments.

## Bonus

- Additional features that can be added: 
- The table search should be fuzzy.
- Make the table sortable by column.
- Indicate the percent change in price using green and a drop in price using red.
- Subtle but effective UI effects or animations to improve look and feel.
