import ResizeObserver from 'resize-observer-polyfill';
import { setHeight } from 'knowledgeworker-embedded-asset-api';

const ro = new ResizeObserver((entries) => {
    for (const entry of entries) {
        setHeight(Math.ceil(entry.contentRect.height));
    }
});

ro.observe(document.body);
