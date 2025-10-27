const stageData = {
  'Tension Building': {
    description:
      "You may notice mood swings, monitoring, or comments that feel like they're shrinking your space.",
    quests: [
      {
        prompt:
          'Which behaviors might be part of the tension building stage?',
        choices: [
          { text: 'Unpredictable anger or silent treatment', value: true },
          { text: 'Celebrating your wins together', value: false },
          { text: 'Encouraging your friendships', value: false },
        ],
        insight:
          'Tension can show up as criticism, jealousy, or having to “keep the peace” constantly.',
      },
      {
        prompt: 'What power-up helps during this stage?',
        choices: [
          { text: 'Secretly track incidents in a journal or app', value: true },
          { text: 'Stop talking to everyone', value: false },
          { text: 'Blame yourself', value: false },
        ],
        insight:
          'Documenting patterns builds clarity. You are never to blame for another person’s abuse.',
      },
    ],
    powerUp:
      'Create a “tension tracker” — record dates, feelings, and triggers to spot patterns early.',
  },
  Incident: {
    description:
      'This stage can include emotional, physical, financial, or digital abuse. Your safety comes first.',
    quests: [
      {
        prompt: 'Pick the strongest safety move if an incident escalates.',
        choices: [
          { text: 'Call a trusted person or hotline when safe', value: true },
          { text: 'Argue louder to prove a point', value: false },
          { text: 'Stay because leaving feels scary', value: false },
        ],
        insight:
          'Having a code word or safe contact ready can create a life-saving exit route.',
      },
      {
        prompt: 'Which statement is true?',
        choices: [
          { text: 'Abuse is about power and control, not losing tempers.', value: true },
          { text: 'If there are no bruises, it is not serious.', value: false },
          { text: 'You must fix it alone.', value: false },
        ],
        insight:
          'Abuse can be verbal, financial, or digital. You deserve support to stay safe.',
      },
    ],
    powerUp:
      'Pack an emergency go-bag with essentials, copies of documents, and hotline numbers.',
  },
  Reconciliation: {
    description:
      'After harm, there may be apologies, gifts, or promises that things will change.',
    quests: [
      {
        prompt: 'Which sign can appear in the reconciliation phase?',
        choices: [
          { text: 'Sudden gifts and love bombing', value: true },
          { text: 'Respecting your boundaries consistently', value: false },
          { text: 'Accountability with long-term action', value: false },
        ],
        insight:
          'Reconciliation often comes with promises and grand gestures meant to reset the wheel.',
      },
      {
        prompt:
          'What reminder helps keep perspective when apologies arrive?',
        choices: [
          { text: 'Change is proven by behavior over time', value: true },
          { text: 'It is rude to question the apology', value: false },
          { text: 'You must forgive immediately', value: false },
        ],
        insight:
          'Long-term respect and safety matter more than short-term words.',
      },
    ],
    powerUp:
      'Share your experiences with a counselor or advocate to reality-check promises.',
  },
  Calm: {
    description:
      'Everything may feel peaceful. Use this time to invest in your support network.',
    quests: [
      {
        prompt: 'What can you build during the calm stage?',
        choices: [
          { text: 'A safety plan with contacts and exit strategies', value: true },
          { text: 'Isolation from your community', value: false },
          { text: 'Self-blame for the past incident', value: false },
        ],
        insight:
          'Use the calm to plan, save emergency funds, and strengthen support.',
      },
      {
        prompt: 'Pick a joy-restoring activity that rebuilds power.',
        choices: [
          { text: 'Reconnect with a hobby or supportive group', value: true },
          { text: 'Monitor your partner constantly', value: false },
          { text: 'Ignore your own needs', value: false },
        ],
        insight:
          'Reclaiming hobbies and friendships restores confidence and autonomy.',
      },
    ],
    powerUp:
      'Create an empowerment circle — list people and places that make you feel safe and seen.',
  },
};

const safetyPlan = new Set();
const completedStages = new Set();
let activeStage = null;

const startButton = document.getElementById('startGame');
const questSection = document.getElementById('questSection');
const safetyPlanSection = document.getElementById('safetyPlan');
const powerUpsList = document.getElementById('powerUps');
const questList = document.getElementById('questList');
const nextStageBtn = document.getElementById('nextStage');
const stageName = document.getElementById('stageName');
const stageDescription = document.getElementById('stageDescription');
const miniGame = document.getElementById('miniGame');
const miniGameTitle = document.getElementById('miniGameTitle');
const miniGamePrompt = document.getElementById('miniGamePrompt');
const miniGameChoices = document.getElementById('miniGameChoices');

const stages = Array.from(document.querySelectorAll('.segment'));

startButton.addEventListener('click', () => {
  questSection.hidden = false;
  safetyPlanSection.hidden = false;
  startButton.disabled = true;
  stageName.textContent = 'Spin the wheel!';
  stageDescription.textContent = 'Tap each stage to unlock insights and power-ups.';
});

stages.forEach((segment) => {
  segment.addEventListener('click', () => {
    const stage = segment.dataset.stage;
    activeStage = stage;
    const data = stageData[stage];
    stageName.textContent = stage;
    stageDescription.textContent = data.description;
    questSection.hidden = false;
    renderQuests(data);
    highlightSegment(stage);
  });
});

nextStageBtn.addEventListener('click', () => {
  if (!activeStage) return;
  const currentIndex = stages.findIndex(
    (segment) => segment.dataset.stage === activeStage,
  );
  const nextIndex = (currentIndex + 1) % stages.length;
  stages[nextIndex].click();
});

function renderQuests(data) {
  questList.innerHTML = '';
  nextStageBtn.disabled = true;

  data.quests.forEach((quest, index) => {
    const listItem = document.createElement('li');
    const prompt = document.createElement('p');
    prompt.textContent = `${index + 1}. ${quest.prompt}`;
    listItem.appendChild(prompt);

    const actionButton = document.createElement('button');
    actionButton.textContent = 'Play Mini Challenge';
    actionButton.className = 'primary';

    actionButton.addEventListener('click', () => {
      openMiniGame(quest, listItem);
    });

    listItem.appendChild(actionButton);
    questList.appendChild(listItem);
  });
}

function openMiniGame(quest, listItem) {
  miniGameTitle.textContent = `${activeStage} Challenge`;
  miniGamePrompt.textContent = quest.prompt;
  miniGameChoices.innerHTML = '';

  quest.choices.forEach((choice) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.textContent = choice.text;
    button.className = choice.value ? 'primary' : 'secondary';

    button.addEventListener('click', () => {
      if (choice.value) {
        listItem.classList.add('completed');
        listItem.querySelector('button').disabled = true;
        showInsight(quest.insight);
        checkStageCompletion();
      } else {
        showInsight('Try again — trust your gut and look for patterns of control.');
      }
    });

    miniGameChoices.appendChild(button);
  });

  miniGame.showModal();
}

function showInsight(text) {
  miniGamePrompt.textContent = text;
}

function checkStageCompletion() {
  const completed = questList.querySelectorAll('.completed');
  const total = questList.children.length;

  if (completed.length === total) {
    completedStages.add(activeStage);
    nextStageBtn.disabled = false;
    unlockPowerUp(stageData[activeStage].powerUp);
  }
}

function unlockPowerUp(text) {
  if (safetyPlan.has(text)) return;
  safetyPlan.add(text);

  const item = document.createElement('li');
  item.textContent = text;
  powerUpsList.appendChild(item);
}

function highlightSegment(stage) {
  stages.forEach((segment) => {
    segment.classList.toggle('active', segment.dataset.stage === stage);
  });
}

miniGame.addEventListener('close', () => {
  miniGameChoices.innerHTML = '';
});

// Keyboard accessibility
stages.forEach((segment) => {
  segment.tabIndex = 0;
  segment.addEventListener('keypress', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      segment.click();
    }
  });
});
