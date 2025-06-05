// ==UserScript==
// @name         IMDbTags
// @namespace    http://tampermonkey.net/
// @version      2025-06-01
// @description  try to take over the world!
// @author       You
// @match        https://www.imdb.com/list/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=imdb.com
// @grant        GM_setValue
// @grant        GM_getValue
// @require      file://C:/scripts/imdbtags.js
// ==/UserScript==

(async function () {
    'use strict';

    function slugify(text) {
        return text
            .toString()
            .toLowerCase()
            .trim()
            .replace(/^\d+\.\s*/, '')   // Remove leading numbers and dots
            .replace(/\s+/g, '-')       // Replace spaces with -
            .replace(/[^\w\-]+/g, '')   // Remove all non-word chars
            .replace(/\-\-+/g, '-')     // Replace multiple - with single -
    }

    function createTagsParentNode() {
        const node = document.createElement("span");
        node.style.color = "rgba(0, 0, 0, 0.87)";
        node.style.listStyle = "none";
        node.style.letterSpacing = ".01786em";
        node.style.textTransform = "none";
        node.style.boxSizing = "border-box";
        node.style.margin = "0px";
        node.style.padding = "0px";
        node.style.border = "0px";
        node.style.font = "inherit";
        node.style.verticalAlign = "baseline";
        node.className = "imdb_user_tags_parent";
        return node;
    }

    function createTagsNode(tag = "Tags") {
        const node = document.createElement("span");
        node.innerText = tag;
        node.style.listStyle = "none";
        node.style.letterSpacing = ".01786em";
        node.style.boxSizing = "border-box";
        node.style.margin = "0px";
        node.style.padding = "0px";
        node.style.border = "0px";
        node.style.font = "inherit";
        node.style.verticalAlign = "baseline";
        node.style.color = "rgba(0, 0, 0, 0.87)";
        node.style.fontWeight = "bold";
        node.style.marginRight = "0.75rem"
        node.className = "imdb_user_tags" + (tag === "Tags" ? "_head" : "_value");
        return node;
    }

    function createTagsInputNode() {
        const node = document.createElement("input");
        node.type = "text";
        node.placeholder = "Add tags (comma separated)";
        node.name = "imdb_user_tags_input";
        node.class = "imdb_user_tags_input";
        return node;
    }

    function getTags(name) {
        const tags = GM_getValue(name);
        if (tags == null) return [];
        return tags;
    }

    function sumbitTags(name, tagsInputNode) {
        const tagsValues = tagsInputNode.value.split(",").map(tag => tag.trim()).filter(tag => tag);
        if (tagsValues.length === 0) return;

        // append tags to existing tags
        let allTags = getTags(name).concat(tagsValues);
        
        GM_setValue(name, allTags);
        tagsInputNode.value = ""; // clear input
    }

    function displayTags(name, tagsParentNode) {
        let tags = getTags(name);
        if (!tags) return;

        const tagsValuesNodes = tags.map(tag => createTagsNode(tag));
        const fragment  = document.createDocumentFragment();
        tagsValuesNodes.forEach(node => fragment.appendChild(node));
        tagsParentNode.querySelectorAll(".imdb_user_tags_value").forEach(node => node.remove()); // remove old tags
        tagsParentNode.appendChild(fragment);
    }

    const cardNodes = document.querySelectorAll("div.dli-parent");

    cardNodes.forEach(card => {
        let name = slugify(card.querySelector(":scope > div:nth-of-type(1) > div:nth-of-type(2) > div:nth-of-type(1) > a > h3").innerText);

        const tagsParentNode = createTagsParentNode();
        const tagsHeadNode = createTagsNode();
        const tagsInputNode = createTagsInputNode();

        tagsInputNode.addEventListener("keydown", (e) => {
            if (e.key === "Enter") {
                sumbitTags(name, tagsInputNode);
                displayTags(name, tagsParentNode);
            }
        });

        const descNode = card.querySelector(":scope > div:nth-of-type(2)");
        
        descNode.appendChild(tagsParentNode);
        tagsParentNode.appendChild(tagsHeadNode);
        displayTags(name, tagsParentNode);
        descNode.appendChild(tagsInputNode);
    });
})();
