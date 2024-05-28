// ==UserScript==
// @name         StockUnlock Header Buttons
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  Add custom buttons to the header on StockUnlock pages
// @author       You
// @match        https://stockunlock.com/stockDetails/*
// @grant        none
// @run-at       document-end
// ==/UserScript==

(function() {
    'use strict';

    // Function to extract the ticker from the URL
    function getTickerFromURL() {
        const pathSegments = window.location.pathname.split('/');
        const tickerIndex = pathSegments.indexOf('stockDetails');
        if (tickerIndex !== -1 && tickerIndex + 1 < pathSegments.length) {
            return pathSegments[tickerIndex + 1];
        }
        return null;
    }

    // Function to create the buttons with the correct ticker
    function createButtons(ticker) {
        const buttonsHTML = `
        <style>
            .button {
                border: none;
                color: white;
                padding: 15px 32px;
                text-align: center;
                text-decoration: none;
                display: inline-block;
                font-size: 16px;
                margin: 4px 2px;
                cursor: pointer;
            }
            .button-green {
                background-color: #04AA6D; /* Green */
            }
            .button-blue {
                background-color: #008CBA; /* Blue */
            }
        </style>
        <div class="button-container">
            <a href="/valuation/?initialTicker=${ticker}">
                <button class="button button-green" type="button">Go to DCF</button>
            </a>
            <a href="/freeForm?initialTickers=${ticker}">
                <button class="button button-blue" type="button">Go to Free Form</button>
            </a>
        </div>
        `;
        return buttonsHTML;
    }

    // Function to add the buttons to the header
    function addButtonsToHeader() {
        const ticker = getTickerFromURL();
        if (ticker) {
            // Use a mutation observer to wait for the h5 element to be available
            const observer = new MutationObserver(function(mutations, me) {
                // Find the h5 element that contains the ticker text
                const h5 = Array.from(document.querySelectorAll('h5')).find(el => el.textContent.includes(ticker));
                if (h5) {
                    // Traverse up the DOM to find the parent div of the h5 element
                    let parentDiv = h5.parentElement.parentElement;
                    while (parentDiv && parentDiv.tagName !== 'DIV') {
                        parentDiv = parentDiv.parentElement;
                    }
                    if (parentDiv) {
                        // Create a container element for the new buttons
                        const container = document.createElement('div');
                        container.innerHTML = createButtons(ticker);
                        // Append the container as the last child of the parent div
                        parentDiv.appendChild(container);
                        me.disconnect(); // stop observing
                        return;
                    }
                }
            });

            // Start observing
            observer.observe(document, {
                childList: true,
                subtree: true
            });
        }
    }

    // Run the function to add the buttons
    addButtonsToHeader();
})();
