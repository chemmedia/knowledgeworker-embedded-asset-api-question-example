import { convertToPercent } from './helper';
import {
    answered,
    onDeactivate,
    onInitialize, onReset,
    onShowResult, onShowSolution,
    ready,
    setSuspendData
} from 'knowledgeworker-embedded-asset-api';
import './resize';
import './style.scss';

const questionArea = document.getElementById('question-area');
const stars = document.querySelectorAll('.star');

interface Choice {
    element: HTMLDivElement;
    x: string;
    y: string;
    name?: string;
}

let choices: Choice[] = [];
let isDeactivated = false;

const addChoice = (x: string, y: string, name?: string, shouldEvaluate: boolean = true) => {
    const choice = document.createElement('div');
    choice.classList.add('choice');
    choice.style.left = x;
    choice.style.top = y;
    choices.push({
        element: choice,
        x,
        y,
        name
    });

    choice.addEventListener('click', (event) => !isDeactivated && removeChoice(event));
    questionArea?.appendChild(choice);
    shouldEvaluate && evaluate();
}

const removeChoice = (event: MouseEvent) => {
    event.stopPropagation();
    event?.target && questionArea?.removeChild(event.target as HTMLDivElement);
    choices = choices.filter(choice => choice.element !== event.target);
    evaluate();
};

const selectChoice = (event: MouseEvent, name?: string) => {
    event.stopPropagation();

    if (!questionArea) {
        return;
    }

    const x = convertToPercent(questionArea.clientWidth, event.pageX);
    const y = convertToPercent(questionArea.clientHeight, event.pageY);

    addChoice(x, y, name);
}

const evaluate = () => {
    const answer = choices.map(choice => choice.name || `${choice.x}:${choice.y}`)
    const isCorrect = Array.from(new Set(choices.map(choice => choice.name)))
        .filter(name => !!name).length === stars.length && stars.length === choices.length;
    setSuspendData(JSON.stringify(choices.map(({element, ...others}) => others)));

    answered(answer.length > 0 ? answer.toString() : undefined, isCorrect, isCorrect ? 1 : 0);
};

Array.from(stars).forEach(star => star.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as undefined | HTMLDivElement;

    if (!target || isDeactivated) {
        return;
    }

    selectChoice(event, target.getAttribute('data-name') || undefined)
}));
questionArea?.addEventListener('click', (event: MouseEvent) => !isDeactivated && selectChoice(event));

onInitialize((suspendData) => {
    let restoredChoices: Choice[] = [];

    try {
        restoredChoices = JSON.parse(suspendData);
    } catch (e) {
        //
    }

    restoredChoices.forEach(choice => addChoice(choice.x, choice.y, choice.name, false));
});

onDeactivate(() => {
    isDeactivated = true;
    document.body.classList.add('deactivated');
});

onShowResult((show, correct) => choices.forEach(choice => {
    if (show) {
        choice.element.classList.add(choice.name ? correct ? 'correct' : 'partial-correct' : 'wrong');
    } else {
        choice.element.classList.remove('correct', 'partial-correct', 'wrong');
    }
}));

onReset(() => {
    Array.from(document.querySelectorAll('.choice')).forEach(choice => questionArea?.removeChild(choice));
    choices = [];
    isDeactivated = false;
    document.body.classList.remove('deactivated');
    evaluate();
});

onShowSolution((show) => {
    choices.forEach(choice => {
        if (show) {
            choice.element.classList.remove('partial-correct');
            choice.element.classList.add(choice.name ? 'correct' : 'wrong');
        } else {
            choice.element.classList.remove('correct', 'wrong');
        }
    });

    const choiceNames = choices.map(choice => choice.name);

    stars.forEach(star => {
        if (show) {
            if (!choiceNames.includes(star.getAttribute('data-name') || undefined)) {
                star.classList.add('solution');
            }
        } else {
            star.classList.remove('solution');
        }
    });
});

ready();
