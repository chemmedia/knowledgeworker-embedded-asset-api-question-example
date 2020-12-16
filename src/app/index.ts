import { convertToPercent } from './helper';
import {
    answered,
    DesignUpdate,
    onDeactivate,
    onInitialize,
    onReset,
    onShowResult,
    onShowSolution,
    onUpdateDesign,
    ready,
    setSuspendData
} from 'knowledgeworker-embedded-asset-api';
import './resize';
import './style.scss';

const questionArea = document.getElementById('question-area');
const stars: HTMLDivElement[] = Array.from(document.querySelectorAll('.star'));
const root = document.documentElement;

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
    const answer = choices.map(choice => choice.name || `${choice.x}:${choice.y}`);
    const isCorrect = Array.from(new Set(choices.map(choice => choice.name)))
        .filter(name => !!name).length === stars.length && stars.length === choices.length;
    setSuspendData(JSON.stringify(choices.map(({element, ...others}) => others)));

    answered(answer.length > 0 ? answer.toString() : undefined, isCorrect, isCorrect ? 1 : 0);
};

const updateCssVars = (design: DesignUpdate) => {
    design.actionColor && root.style.setProperty('--actionColor', design.actionColor);
    design.feedbackPositiveColor && root.style.setProperty('--feedbackPositiveColor', design.feedbackPositiveColor);
    design.feedbackPartialPositiveColor && root.style.setProperty('--feedbackPartialPositiveColor', design.feedbackPartialPositiveColor);
    design.feedbackNegativeColor && root.style.setProperty('--feedbackNegativeColor', design.feedbackNegativeColor);
    design.feedbackSolutionColor && root.style.setProperty('--feedbackSolutionColor', design.feedbackSolutionColor);
};

stars.forEach(star => star.addEventListener('click', (event: MouseEvent) => {
    const target = event.target as undefined | HTMLDivElement;

    if (!target || isDeactivated) {
        return;
    }

    selectChoice(event, target.getAttribute('data-name') || undefined)
}));
questionArea?.addEventListener('click', (event: MouseEvent) => !isDeactivated && selectChoice(event));

onInitialize((configuration) => {
    let restoredChoices: Choice[] = [];

    try {
        restoredChoices = JSON.parse(configuration.suspendData);
    } catch (e) {
        //
    }

    restoredChoices.forEach(choice => addChoice(choice.x, choice.y, choice.name, false));
    updateCssVars(configuration);
});

onUpdateDesign(updateCssVars);

onDeactivate(() => {
    isDeactivated = true;
    document.body.classList.add('deactivated');
});

onShowResult((correct) => choices.forEach(choice => {
    choice.element.classList.add(choice.name ? correct ? 'correct' : 'partial-correct' : 'wrong');
}));

onReset(() => {
    Array.from(document.querySelectorAll('.choice')).forEach(choice => questionArea?.removeChild(choice));
    choices = [];
    isDeactivated = false;
    document.body.classList.remove('deactivated');
    stars.forEach(star => star.classList.remove('solution'));
    evaluate();
});

onShowSolution(() => {
    choices.forEach(choice => choice.element.classList.add(choice.name ? 'correct' : 'wrong'));

    const choiceNames = choices.map(choice => choice.name);
    stars.forEach(star => !choiceNames.includes(star.getAttribute('data-name') || undefined) && star.classList.add('solution'));
});

ready();
