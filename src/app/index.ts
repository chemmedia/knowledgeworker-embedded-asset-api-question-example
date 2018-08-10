import ResizeObserver from 'resize-observer-polyfill';
import { setHeight, disableAutomaticCompletion, triggerCompleted } from 'knowledgeworker-embedded-asset-api';
import './style.scss';
import { start } from './example';
const size = document.getElementById('size');
const console = document.getElementById('console');
const consoleContent = document.getElementById('console-content');
const completedLink = document.getElementById('completed');
let consoleTimer: number;

const log = (message: string) => {
    if (console && consoleContent) {
        consoleContent.innerHTML = message;
        console.classList.add('visible');
        clearTimeout(consoleTimer);
        setTimeout(
            () => {
                console.classList.remove('visible');
            },
            1500
        )
    }
};

const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
        const width = Math.ceil(entry.contentRect.width);
        const height = Math.ceil(entry.contentRect.height);

        if (size) {
            size.innerHTML = `Size ${width} &times; ${height}`;
        }

        setHeight(height);
        log(`Height set to ${height}&thinsp;px`);
    }
});

ro.observe(document.body);
disableAutomaticCompletion();
start();

completedLink && completedLink.addEventListener("click", () => {
    triggerCompleted();
    log(`Triggered completion event`);
});