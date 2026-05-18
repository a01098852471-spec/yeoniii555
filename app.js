const app = {
    // Current state
    currentView: 'dashboard',
    currentScenarioIndex: 0,
    
    // Data objects
    titlesAndEndings: {
        friend: { title: "Name or 야/아", ending: "Informal (~어/아)", note: "Use informal language (Banmal)." },
        senior: { title: "선배님 (Seonbae-nim)", ending: "Polite (~요)", note: "Use polite language (Jeondaetmal). If close, you might drop the 'nim'." },
        professor: { title: "교수님 (Gyosu-nim)", ending: "Formal (~습니다/ㅂ니다)", note: "Always use formal language and show high respect." },
        boss: { title: "직급 + 님 (e.g., 팀장님)", ending: "Formal (~습니다/ㅂ니다)", note: "Workplace requires formal respect." },
        parents: { title: "어머님/아버님 (Eomeonim/Abeonim)", ending: "Formal/Polite (~습니다/요)", note: "Show respect to elders." }
    },

    guidesData: {
        dining: [
            { title: "Table Setting", items: ["Wait for elders to sit first.", "Place the spoon and chopsticks on the right side of the bowl."] },
            { title: "Eating", items: ["Do not start eating until the oldest person at the table takes their first bite.", "Do not hold your rice bowl in your hand while eating; leave it on the table.", "Try to keep pace with others, especially elders."] },
            { title: "Finishing", items: ["Place your spoon and chopsticks back on the table when finished.", "Wait for elders to finish before leaving the table."] }
        ],
        drinking: [
            { title: "Pouring Drinks", items: ["Use two hands when pouring a drink for someone older or senior.", "Never pour your own drink; wait for someone else to pour it for you.", "Ensure others' glasses are never empty."] },
            { title: "Receiving Drinks", items: ["Hold your glass with both hands when receiving a drink from an elder.", "If you don't drink alcohol, politely accept the first glass, take a small sip, and leave it full."] },
            { title: "Drinking", items: ["Turn your head and upper body slightly away when drinking in front of an elder to show respect.", "Do not expose the bottom of your glass directly to the elder."] }
        ]
    },

    scenarios: [
        {
            id: 'scenario1',
            title: "Meeting a Senior (선배)",
            dialogue: [
                { text: "Oh, hi! Are you the new exchange student?", sender: "bot" }
            ],
            options: [
                { text: "Yes, hi! (네, 안녕하세요!)", correct: true, feedback: "Great! '안녕하세요' is polite and perfect for a senior." },
                { text: "Yeah, hi! (응, 안녕!)", correct: false, feedback: "Oops! '안녕' is for friends. Use polite language with seniors." }
            ]
        },
        {
            id: 'scenario2',
            title: "Emailing a Professor",
            dialogue: [
                { text: "How should you start an email to Professor Kim?", sender: "bot" }
            ],
            options: [
                { text: "김 교수님, 안녕하세요. (Professor Kim, hello.)", correct: true, feedback: "Perfect! Always attach '님' (nim) to their title." },
                { text: "김씨, 안녕. (Mr. Kim, hi.)", correct: false, feedback: "Very disrespectful! Never call a professor '씨' (ssi) or use informal greetings." }
            ]
        }
    ],

    // Initialization
    init() {
        this.cacheDOM();
        this.bindEvents();
        this.renderGuides('dining');
        this.renderScenarios();
    },

    cacheDOM() {
        this.navItems = document.querySelectorAll('.nav-item');
        this.views = document.querySelectorAll('.view');
        this.pageTitle = document.getElementById('page-title');
        
        this.calcRole = document.getElementById('calc-role');
        this.calcAge = document.getElementById('calc-age');
        this.calcBtn = document.getElementById('calc-btn');
        this.calcResult = document.getElementById('calc-result');
        
        this.tabBtns = document.querySelectorAll('.tab-btn');
        this.guideContent = document.getElementById('guide-content');
        
        this.scenarioList = document.getElementById('scenario-list');
        this.chatMessages = document.getElementById('chat-messages');
        this.optionsContainer = document.getElementById('options-container');
        this.chatPartnerName = document.getElementById('chat-partner-name');
    },

    bindEvents() {
        // Navigation
        this.navItems.forEach(item => {
            item.addEventListener('click', () => {
                this.navigateTo(item.dataset.target);
            });
        });

        // Calculator
        this.calcBtn.addEventListener('click', () => this.calculateTitle());

        // Guide Tabs
        this.tabBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.tabBtns.forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.renderGuides(e.target.dataset.guide);
            });
        });
    },

    navigateTo(targetViewId) {
        // Update Nav
        this.navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.target === targetViewId) {
                item.classList.add('active');
                this.pageTitle.textContent = item.querySelector('span').textContent;
            }
        });

        // Update Views
        this.views.forEach(view => {
            view.classList.remove('active-view');
            if (view.id === targetViewId) {
                view.classList.add('active-view');
            }
        });
        this.currentView = targetViewId;
    },

    // Calculator Logic
    calculateTitle() {
        const role = this.calcRole.value;
        const age = this.calcAge.value;
        const result = this.titlesAndEndings[role];
        
        if (!result) return;

        let finalNote = result.note;
        if (role === 'friend' && age === 'older') {
            finalNote = "Even if they are a friend, since they are older, you might need to use 'Hyung/Oppa' or 'Nuna/Unni' and use polite language (~요) until agreed otherwise.";
        } else if (role === 'senior' && age === 'same') {
            finalNote += " If they are the same age, you might become friends quickly, but stay polite initially.";
        }

        this.calcResult.innerHTML = `
            <h4>Result:</h4>
            <div class="result-item"><strong>Title:</strong> ${result.title}</div>
            <div class="result-item"><strong>Ending:</strong> ${result.ending}</div>
            <div class="result-item"><strong>Note:</strong> ${finalNote}</div>
        `;
        this.calcResult.classList.remove('hidden');
    },

    // Guide Rendering
    renderGuides(type) {
        const data = this.guidesData[type];
        if (!data) return;

        let html = '';
        data.forEach(section => {
            html += `
                <div class="guide-section">
                    <h4>${section.title}</h4>
                    <ul>
                        ${section.items.map(item => \`<li>\${item}</li>\`).join('')}
                    </ul>
                </div>
            `;
        });
        this.guideContent.innerHTML = html;
    },

    // Practice Logic
    renderScenarios() {
        this.scenarioList.innerHTML = '';
        this.scenarios.forEach((scenario, index) => {
            const li = document.createElement('li');
            li.className = 'scenario-item';
            li.textContent = scenario.title;
            li.addEventListener('click', () => {
                document.querySelectorAll('.scenario-item').forEach(i => i.classList.remove('active'));
                li.classList.add('active');
                this.loadScenario(index);
            });
            this.scenarioList.appendChild(li);
        });
    },

    loadScenario(index) {
        this.currentScenarioIndex = index;
        const scenario = this.scenarios[index];
        this.chatPartnerName.textContent = scenario.title;
        this.chatMessages.innerHTML = '';
        this.optionsContainer.innerHTML = '';

        // Add initial bot message
        scenario.dialogue.forEach(msg => {
            this.appendMessage(msg.text, msg.sender);
        });

        // Add options
        scenario.options.forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'option-btn';
            btn.textContent = opt.text;
            btn.addEventListener('click', () => this.handleOptionSelect(opt));
            this.optionsContainer.appendChild(btn);
        });
    },

    appendMessage(text, sender) {
        const msgDiv = document.createElement('div');
        msgDiv.className = \`msg \${sender}\`;
        msgDiv.textContent = text;
        this.chatMessages.appendChild(msgDiv);
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    },

    handleOptionSelect(option) {
        // User's choice
        this.appendMessage(option.text, 'user');
        
        // Hide options
        this.optionsContainer.innerHTML = '';

        // Bot feedback
        setTimeout(() => {
            this.appendMessage(option.feedback, 'bot');
        }, 800);
    }
};

// Start app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    app.init();
});
