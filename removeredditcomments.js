
// ==UserScript==
// @name         RemoveComments
// @namespace    http://tampermonkey.net/
// @version      2025-05-26
// @description  Remove Reddit comments after a certain date.
// @author       You
// @match        https://www.reddit.com/r/*/comments/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @grant        none
// ==/UserScript==

(function() {
    'use strict';

    function createBtnNode() {
        const node = document.createElement("p");
        node.innerText = "Rem";
        node.style.fontSize = "15px";
        node.style.color = "white";
        node.style.fontWeight = "bold";
        node.style.marginLeft = "10px";
        node.style.cursor = "pointer";
        return node;
    }

    const specificDate = new Date('2018-02-26T00:00:00Z');

    const btnParentNode = document.querySelector("body > shreddit-app > reddit-header-large > reddit-header-action-items > header > nav > div.pl-lg.gap-xs.flex.items-center.justify-end > div:nth-child(2)");
    const btnNode = createBtnNode();
    btnNode.addEventListener("click", removeCommentsAfterDate);
    btnParentNode.appendChild(btnNode);
    
    //var commentsSection = document.querySelector("#comment-tree-content-anchor-7zqsdy > faceplate-batch");
    var i = 0;
    function removeCommentsAfterDate() {
        document.querySelectorAll('shreddit-comment').forEach(comment => {
            try {
                const date = comment.querySelector('time');
                const parsedDate = new Date(date.getAttribute('datetime'));
                if (parsedDate > specificDate) {
                    comment.querySelector('[id^="t1_"][id$="-comment-rtjson-content"]').remove();
                    i++;
                }
                else {
                    console.log("Comment date is before the specific date");
                }
            }
            catch (error) {
                console.error("Error processing comment:", error);
            }
        });
        console.log(i + " Comments after " + specificDate.toISOString() + " have been removed.");
    }
})();
