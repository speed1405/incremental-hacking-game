// Game State
const gameState = {
    hackingPower: 0,
    xp: 0,
    credits: 0,
    powerPerSecond: 0,
    level: 1,
    upgrades: {},
    completedMissions: []
};

// Upgrade Definitions
const upgrades = [
    {
        id: 'autoHacker',
        name: '🤖 Auto-Hacker',
        description: 'Generates 1 hacking power per second',
        baseCost: 10,
        costMultiplier: 1.15,
        powerPerSecond: 1,
        type: 'power'
    },
    {
        id: 'botnet',
        name: '🌐 Botnet',
        description: 'A network of compromised computers. +5 power/sec',
        baseCost: 100,
        costMultiplier: 1.2,
        powerPerSecond: 5,
        type: 'power'
    },
    {
        id: 'aiAssistant',
        name: '🧠 AI Assistant',
        description: 'Advanced AI helps with hacking. +20 power/sec',
        baseCost: 500,
        costMultiplier: 1.25,
        powerPerSecond: 20,
        type: 'power'
    },
    {
        id: 'quantumCore',
        name: '⚛️ Quantum Core',
        description: 'Quantum computing power. +100 power/sec',
        baseCost: 2500,
        costMultiplier: 1.3,
        powerPerSecond: 100,
        type: 'power'
    },
    {
        id: 'neuralNetwork',
        name: '🔮 Neural Network',
        description: 'Self-learning hacking system. +500 power/sec',
        baseCost: 10000,
        costMultiplier: 1.35,
        powerPerSecond: 500,
        type: 'power'
    }
];

// Mission Definitions
const missions = [
    {
        id: 'hackWebsite',
        name: '🌐 Hack Small Website',
        description: 'Compromise a basic website security',
        powerCost: 50,
        xpReward: 10,
        creditReward: 5,
        cooldown: 0
    },
    {
        id: 'stealData',
        name: '💾 Steal Database',
        description: 'Extract sensitive data from a database',
        powerCost: 200,
        xpReward: 50,
        creditReward: 25,
        cooldown: 0
    },
    {
        id: 'breakEncryption',
        name: '🔐 Break Encryption',
        description: 'Crack advanced encryption algorithms',
        powerCost: 500,
        xpReward: 150,
        creditReward: 75,
        cooldown: 0
    },
    {
        id: 'infiltrateServer',
        name: '🖥️ Infiltrate Server',
        description: 'Gain root access to a secured server',
        powerCost: 1000,
        xpReward: 300,
        creditReward: 150,
        cooldown: 0
    },
    {
        id: 'hackCorporation',
        name: '🏢 Hack Corporation',
        description: 'Penetrate corporate network defenses',
        powerCost: 2500,
        xpReward: 800,
        creditReward: 400,
        cooldown: 0
    },
    {
        id: 'breachGovernment',
        name: '🏛️ Breach Government System',
        description: 'Access classified government databases',
        powerCost: 5000,
        xpReward: 2000,
        creditReward: 1000,
        cooldown: 0
    }
];

// Initialize upgrades count
upgrades.forEach(upgrade => {
    gameState.upgrades[upgrade.id] = 0;
});

// DOM Elements
const elements = {
    hackingPower: document.getElementById('hackingPower'),
    xp: document.getElementById('xp'),
    credits: document.getElementById('credits'),
    powerPerSec: document.getElementById('powerPerSec'),
    level: document.getElementById('level'),
    levelProgress: document.getElementById('levelProgress'),
    xpProgress: document.getElementById('xpProgress'),
    hackBtn: document.getElementById('hackBtn'),
    upgradesList: document.getElementById('upgradesList'),
    missionsList: document.getElementById('missionsList'),
    saveBtn: document.getElementById('saveBtn'),
    resetBtn: document.getElementById('resetBtn')
};

// Format numbers for display
function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(2) + 'M';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(2) + 'K';
    }
    return Math.floor(num).toString();
}

// Calculate XP required for next level
function getXPForLevel(level) {
    // Formula: 100 * level^1.5 (exponential growth)
    return Math.floor(100 * Math.pow(level, 1.5));
}

// Get current level progress
function getLevelProgress() {
    const currentLevelXP = getXPForLevel(gameState.level);
    const previousLevelXP = gameState.level > 1 ? getXPForLevel(gameState.level - 1) : 0;
    const xpIntoLevel = gameState.xp - previousLevelXP;
    const xpNeeded = currentLevelXP - previousLevelXP;
    return {
        current: xpIntoLevel,
        needed: xpNeeded,
        percentage: (xpIntoLevel / xpNeeded) * 100
    };
}

// Check for level up
function checkLevelUp() {
    const xpRequired = getXPForLevel(gameState.level);
    
    if (gameState.xp >= xpRequired) {
        gameState.level++;
        
        // Show level up notification
        showLevelUpNotification();
        
        // Recalculate power per second with level bonus
        calculatePowerPerSecond();
        
        // Check if we can level up again
        checkLevelUp();
    }
}

// Show level up notification
function showLevelUpNotification() {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
        <div class="notification-content">
            🎉 LEVEL UP! 🎉<br>
            <span class="level-text">Level ${gameState.level}</span><br>
            <span class="bonus-text">+${gameState.level}% Power Bonus!</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Get level bonus multiplier
function getLevelBonus() {
    // Each level gives 1% bonus to power generation
    return 1 + (gameState.level - 1) * 0.01;
}

// Calculate upgrade cost
function getUpgradeCost(upgrade) {
    const count = gameState.upgrades[upgrade.id];
    return Math.floor(upgrade.baseCost * Math.pow(upgrade.costMultiplier, count));
}

// Update display
function updateDisplay() {
    elements.hackingPower.textContent = formatNumber(gameState.hackingPower);
    elements.xp.textContent = formatNumber(gameState.xp);
    elements.credits.textContent = formatNumber(gameState.credits);
    elements.powerPerSec.textContent = formatNumber(gameState.powerPerSecond);
    
    // Update level display
    if (elements.level) {
        elements.level.textContent = gameState.level;
    }
    
    // Update XP progress bar
    if (elements.levelProgress && elements.xpProgress) {
        const progress = getLevelProgress();
        const percentage = Math.min(progress.percentage, 100);
        elements.levelProgress.style.width = percentage + '%';
        elements.xpProgress.textContent = `${formatNumber(progress.current)} / ${formatNumber(progress.needed)} XP`;
    }
}

// Manual hack action
function hack() {
    gameState.hackingPower += 1;
    updateDisplay();
}

// Buy upgrade
function buyUpgrade(upgrade) {
    const cost = getUpgradeCost(upgrade);
    
    if (gameState.hackingPower >= cost) {
        gameState.hackingPower -= cost;
        gameState.upgrades[upgrade.id]++;
        
        // Update power per second
        calculatePowerPerSecond();
        
        updateDisplay();
        renderUpgrades();
    }
}

// Complete mission
function completeMission(mission) {
    if (gameState.hackingPower >= mission.powerCost) {
        gameState.hackingPower -= mission.powerCost;
        gameState.xp += mission.xpReward;
        gameState.credits += mission.creditReward;
        
        // Check for level up
        checkLevelUp();
        
        updateDisplay();
        renderMissions();
    }
}

// Calculate total power per second
function calculatePowerPerSecond() {
    let total = 0;
    upgrades.forEach(upgrade => {
        const count = gameState.upgrades[upgrade.id];
        total += upgrade.powerPerSecond * count;
    });
    
    // Apply level bonus
    const levelBonus = getLevelBonus();
    gameState.powerPerSecond = total * levelBonus;
}

// Render upgrades
function renderUpgrades() {
    elements.upgradesList.innerHTML = '';
    
    upgrades.forEach(upgrade => {
        const cost = getUpgradeCost(upgrade);
        const count = gameState.upgrades[upgrade.id];
        const canAfford = gameState.hackingPower >= cost;
        
        const upgradeDiv = document.createElement('div');
        upgradeDiv.className = 'upgrade-item';
        
        const button = document.createElement('button');
        button.className = 'upgrade-btn';
        button.disabled = !canAfford;
        
        button.innerHTML = `
            <span class="item-name">${upgrade.name}</span>
            <span class="item-description">${upgrade.description}</span>
            <span class="item-cost">Cost: ${formatNumber(cost)} Power</span>
            ${count > 0 ? `<span class="item-count"> | Owned: ${count}</span>` : ''}
        `;
        
        button.addEventListener('click', () => buyUpgrade(upgrade));
        
        upgradeDiv.appendChild(button);
        elements.upgradesList.appendChild(upgradeDiv);
    });
}

// Render missions
function renderMissions() {
    elements.missionsList.innerHTML = '';
    
    missions.forEach(mission => {
        const canAfford = gameState.hackingPower >= mission.powerCost;
        
        const missionDiv = document.createElement('div');
        missionDiv.className = 'mission-item';
        
        const button = document.createElement('button');
        button.className = 'mission-btn';
        button.disabled = !canAfford;
        
        button.innerHTML = `
            <span class="item-name">${mission.name}</span>
            <span class="item-description">${mission.description}</span>
            <span class="item-cost">Cost: ${formatNumber(mission.powerCost)} Power</span>
            <span class="item-reward"> | Reward: ${formatNumber(mission.xpReward)} XP, ${formatNumber(mission.creditReward)} Credits</span>
        `;
        
        button.addEventListener('click', () => completeMission(mission));
        
        missionDiv.appendChild(button);
        elements.missionsList.appendChild(missionDiv);
    });
}

// Game loop - runs every second
function gameLoop() {
    if (gameState.powerPerSecond > 0) {
        gameState.hackingPower += gameState.powerPerSecond / 10; // Divide by 10 for smoother increment
        updateDisplay();
    }
    
    renderUpgrades();
    renderMissions();
}

// Save game
function saveGame() {
    localStorage.setItem('hackingGameSave', JSON.stringify(gameState));
    alert('Game saved! ✅');
}

// Load game
function loadGame() {
    const savedGame = localStorage.getItem('hackingGameSave');
    if (savedGame) {
        const loaded = JSON.parse(savedGame);
        Object.assign(gameState, loaded);
        
        // Set default level if not present (for old saves)
        if (!gameState.level) {
            gameState.level = 1;
        }
        
        calculatePowerPerSecond();
        updateDisplay();
        renderUpgrades();
        renderMissions();
    }
}

// Reset game
function resetGame() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone!')) {
        localStorage.removeItem('hackingGameSave');
        gameState.hackingPower = 0;
        gameState.xp = 0;
        gameState.credits = 0;
        gameState.powerPerSecond = 0;
        gameState.level = 1;
        gameState.completedMissions = [];
        
        upgrades.forEach(upgrade => {
            gameState.upgrades[upgrade.id] = 0;
        });
        
        calculatePowerPerSecond();
        updateDisplay();
        renderUpgrades();
        renderMissions();
    }
}

// Event Listeners
elements.hackBtn.addEventListener('click', hack);
elements.saveBtn.addEventListener('click', saveGame);
elements.resetBtn.addEventListener('click', resetGame);

// Initialize game
function init() {
    loadGame();
    updateDisplay();
    renderUpgrades();
    renderMissions();
    
    // Start game loop (100ms interval for smooth updates)
    setInterval(gameLoop, 100);
}

// Start the game when page loads
init();
