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

    let pageHref = window.location.href;
    let observer;

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

    // Function to handle page changes
    function handlePageChange() {
        // Disconnect the existing observer
        if (observer) {
            observer.disconnect();
        }

        // Update the pageHref with the new URL
        pageHref = window.location.href;

        // Remove existing buttons if they exist
        const existingButtons = document.querySelector('.button-container');
        if (existingButtons) {
            existingButtons.remove();
        }

        // Add the new buttons with the updated ticker
        addButtonsToHeader();

        // Start observing the DOM again for further changes
        observeDom();
    }


    // Function to add the buttons to the header
    function addButtonsToHeader() {
        const ticker = getTickerFromURL();
        if (ticker) {
            // Find the parent div of the h5 element that contains the ticker text
            const h5 = Array.from(document.querySelectorAll('h5')).find(el => el.textContent.includes(ticker));
            if (h5) {
                let parentDiv = h5.parentElement.parentElement; // Two levels up
                if (parentDiv && parentDiv.tagName === 'DIV') {
                    // Create a container element for the new buttons
                    const container = document.createElement('div');
                    container.innerHTML = createButtons(ticker);
                    // Append the container as the last child of the parent div
                    parentDiv.appendChild(container);
                    return;
                }
            }
        }
    }



    // Function to observe DOM changes
    function observeDom() {
        const bodies = document.querySelectorAll('body');
        if (bodies && bodies.length > 0) {
            observer = new MutationObserver((mutations) => {
                // If mutation observer detects a change in the page URL, handle the page change
                if (pageHref !== window.location.href) {
                    handlePageChange();
                    return;
                }
            });

            // Start observing the body for child list changes
            observer.observe(bodies[0], {
                childList: true,
                subtree: true
            });
        }
    }

    // Initial call to add buttons and start observing DOM changes
    handlePageChange();

})();
