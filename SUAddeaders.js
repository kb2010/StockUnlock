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
            <div class="css-b2x44j">
                <a class="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineAlways css-1pus56s" href="/valuation/?initialTicker=${ticker}">
                    <button class="MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root css-gz8nge" tabindex="0" type="button">
                        <span class="MuiButton-startIcon MuiButton-iconSizeMedium css-6xugel">
                            <!-- SVG for DCF button -->
                        </span>
                        <div class="MuiTypography-root MuiTypography-body2 css-11vc980">Go to DCF</div>
                        <span class="MuiTouchRipple-root css-w0pj6f"></span>
                    </button>
                </a>
                <a class="MuiTypography-root MuiTypography-inherit MuiLink-root MuiLink-underlineAlways css-1pus56s" href="/freeForm?initialTickers=${ticker}">
                    <button class="MuiButton-root MuiButton-contained MuiButton-containedPrimary MuiButton-sizeMedium MuiButton-containedSizeMedium MuiButtonBase-root css-1lmquvn" tabindex="0" type="button">
                        <span class="MuiButton-startIcon MuiButton-iconSizeMedium css-6xugel">
                            <!-- SVG for Free Form button -->
                        </span>
                        <div class="MuiTypography-root MuiTypography-body2 css-11vc980">Go to Free Form</div>
                        <span class="MuiTouchRipple-root css-w0pj6f"></span>
                    </button>
                </a>
            </div>
        `;
        return buttonsHTML;
    }

    // Function to add the buttons to the header
    function addButtonsToHeader() {
        const ticker = getTickerFromURL();
        if (ticker) {
            // Use a mutation observer to wait for the header div to be available
            const observer = new MutationObserver(function(mutations, me) {
                const headerDiv = document.querySelector('.css-1i8o3xl');
                if (headerDiv) {
                    // Create a container element for the new buttons
                    const container = document.createElement('div');
                    container.innerHTML = createButtons(ticker);
                    // Append the container as the last child of the header div
                    headerDiv.appendChild(container);
                    me.disconnect(); // stop observing
                    return;
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
