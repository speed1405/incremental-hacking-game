// Game Configuration
const LEVEL_BONUS_PERCENT = 0.01; // 1% power bonus per level
const LEVEL_BONUS_DISPLAY = LEVEL_BONUS_PERCENT * 100; // For display purposes (1)
const NOTIFICATION_DURATION = 3000; // Duration in milliseconds

// Game State
const gameState = {
    hackingPower: 0,
    xp: 0,
    credits: 0,
    powerPerSecond: 0,
    level: 1,
    hardware: {},
    completedMissions: []
};

// Hardware Shop Definitions (Real-life hardware from 1989-2025)
const hardware = [
    // CPUs - Real Intel and AMD processors
    { id: 'cpu_i386', name: '💻 Intel 80386', year: 1985, type: 'CPU', cost: 10, power: 1, description: '32-bit processor' },
    { id: 'cpu_i486', name: '💻 Intel 80486', year: 1989, type: 'CPU', cost: 20, power: 2, description: 'Built-in math coprocessor' },
    { id: 'cpu_pentium', name: '💻 Intel Pentium', year: 1993, type: 'CPU', cost: 40, power: 4, description: 'Superscalar architecture' },
    { id: 'cpu_k6', name: '💻 AMD K6', year: 1997, type: 'CPU', cost: 60, power: 6, description: 'Budget performance leader' },
    { id: 'cpu_pentium2', name: '💻 Intel Pentium II', year: 1997, type: 'CPU', cost: 80, power: 8, description: 'Slot 1 design' },
    { id: 'cpu_pentium3', name: '💻 Intel Pentium III', year: 1999, type: 'CPU', cost: 150, power: 15, description: 'SSE instructions' },
    { id: 'cpu_athlon', name: '💻 AMD Athlon', year: 1999, type: 'CPU', cost: 140, power: 14, description: 'First 1GHz CPU' },
    { id: 'cpu_pentium4', name: '💻 Intel Pentium 4', year: 2000, type: 'CPU', cost: 300, power: 30, description: 'NetBurst architecture' },
    { id: 'cpu_athlon64', name: '💻 AMD Athlon 64', year: 2003, type: 'CPU', cost: 500, power: 50, description: 'First x86-64 processor' },
    { id: 'cpu_core2duo', name: '💻 Intel Core 2 Duo', year: 2006, type: 'CPU', cost: 1000, power: 100, description: 'Dual-core revolution' },
    { id: 'cpu_corei7_920', name: '💻 Intel Core i7-920', year: 2008, type: 'CPU', cost: 2000, power: 200, description: 'Nehalem architecture' },
    { id: 'cpu_corei7_2600k', name: '💻 Intel Core i7-2600K', year: 2011, type: 'CPU', cost: 3500, power: 350, description: 'Sandy Bridge' },
    { id: 'cpu_corei7_4790k', name: '💻 Intel Core i7-4790K', year: 2014, type: 'CPU', cost: 5000, power: 500, description: 'Devils Canyon' },
    { id: 'cpu_ryzen7_1700', name: '💻 AMD Ryzen 7 1700', year: 2017, type: 'CPU', cost: 7000, power: 700, description: 'Zen architecture' },
    { id: 'cpu_corei9_9900k', name: '💻 Intel Core i9-9900K', year: 2018, type: 'CPU', cost: 10000, power: 1000, description: '8-core gaming beast' },
    { id: 'cpu_ryzen9_3950x', name: '💻 AMD Ryzen 9 3950X', year: 2019, type: 'CPU', cost: 15000, power: 1500, description: '16-core Zen 2' },
    { id: 'cpu_corei9_10900k', name: '💻 Intel Core i9-10900K', year: 2020, type: 'CPU', cost: 20000, power: 2000, description: 'Comet Lake flagship' },
    { id: 'cpu_ryzen9_5950x', name: '💻 AMD Ryzen 9 5950X', year: 2020, type: 'CPU', cost: 25000, power: 2500, description: 'Zen 3 powerhouse' },
    { id: 'cpu_corei9_12900k', name: '💻 Intel Core i9-12900K', year: 2021, type: 'CPU', cost: 35000, power: 3500, description: 'Alder Lake hybrid' },
    { id: 'cpu_ryzen9_7950x', name: '💻 AMD Ryzen 9 7950X', year: 2022, type: 'CPU', cost: 50000, power: 5000, description: 'Zen 4 flagship' },
    { id: 'cpu_corei9_13900k', name: '💻 Intel Core i9-13900K', year: 2022, type: 'CPU', cost: 55000, power: 5500, description: 'Raptor Lake' },
    { id: 'cpu_ryzen9_7950x3d', name: '💻 AMD Ryzen 9 7950X3D', year: 2023, type: 'CPU', cost: 75000, power: 7500, description: '3D V-Cache tech' },
    { id: 'cpu_corei9_14900k', name: '💻 Intel Core i9-14900K', year: 2023, type: 'CPU', cost: 80000, power: 8000, description: 'Raptor Lake Refresh' },
    { id: 'cpu_ryzen9_9950x', name: '💻 AMD Ryzen 9 9950X', year: 2024, type: 'CPU', cost: 120000, power: 12000, description: 'Zen 5 architecture' },
    { id: 'cpu_corei9_15900k', name: '💻 Intel Core Ultra 9 285K', year: 2024, type: 'CPU', cost: 130000, power: 13000, description: 'Arrow Lake' },

    // GPUs - Real NVIDIA and AMD graphics cards
    { id: 'gpu_vga', name: '🎮 IBM VGA', year: 1987, type: 'GPU', cost: 15, power: 2, description: '640x480 resolution' },
    { id: 'gpu_et4000', name: '🎮 Tseng ET4000', year: 1989, type: 'GPU', cost: 25, power: 3, description: 'SVGA standard' },
    { id: 'gpu_s3_trio', name: '🎮 S3 Trio64', year: 1995, type: 'GPU', cost: 50, power: 5, description: '64-bit graphics' },
    { id: 'gpu_voodoo', name: '🎮 3dfx Voodoo', year: 1996, type: 'GPU', cost: 100, power: 10, description: '3D acceleration pioneer' },
    { id: 'gpu_riva128', name: '🎮 NVIDIA RIVA 128', year: 1997, type: 'GPU', cost: 120, power: 12, description: 'First NVIDIA GPU' },
    { id: 'gpu_voodoo2', name: '🎮 3dfx Voodoo2', year: 1998, type: 'GPU', cost: 180, power: 18, description: 'SLI support' },
    { id: 'gpu_tnt2', name: '🎮 NVIDIA TNT2', year: 1999, type: 'GPU', cost: 200, power: 20, description: '32-bit color' },
    { id: 'gpu_geforce256', name: '🎮 NVIDIA GeForce 256', year: 1999, type: 'GPU', cost: 250, power: 25, description: 'First GPU with T&L' },
    { id: 'gpu_radeon7500', name: '🎮 ATI Radeon 7500', year: 2001, type: 'GPU', cost: 350, power: 35, description: 'Pixel shader 1.0' },
    { id: 'gpu_geforce3', name: '🎮 NVIDIA GeForce3', year: 2001, type: 'GPU', cost: 400, power: 40, description: 'Programmable shaders' },
    { id: 'gpu_radeon9700', name: '🎮 ATI Radeon 9700 Pro', year: 2002, type: 'GPU', cost: 600, power: 60, description: 'DirectX 9.0' },
    { id: 'gpu_geforcefx5900', name: '🎮 NVIDIA GeForce FX 5900', year: 2003, type: 'GPU', cost: 750, power: 75, description: 'CineFX engine' },
    { id: 'gpu_geforce6800', name: '🎮 NVIDIA GeForce 6800 GT', year: 2004, type: 'GPU', cost: 1200, power: 120, description: 'Shader Model 3.0' },
    { id: 'gpu_radeonx1900', name: '🎮 ATI Radeon X1900 XTX', year: 2006, type: 'GPU', cost: 2000, power: 200, description: 'Unified shader' },
    { id: 'gpu_geforce8800', name: '🎮 NVIDIA GeForce 8800 GTX', year: 2006, type: 'GPU', cost: 2500, power: 250, description: 'Tesla architecture' },
    { id: 'gpu_radeonhd4870', name: '🎮 ATI Radeon HD 4870', year: 2008, type: 'GPU', cost: 3500, power: 350, description: 'TeraScale design' },
    { id: 'gpu_gtx280', name: '🎮 NVIDIA GeForce GTX 280', year: 2008, type: 'GPU', cost: 4000, power: 400, description: 'GT200 flagship' },
    { id: 'gpu_radeonhd5870', name: '🎮 AMD Radeon HD 5870', year: 2009, type: 'GPU', cost: 5500, power: 550, description: 'First DirectX 11' },
    { id: 'gpu_gtx480', name: '🎮 NVIDIA GeForce GTX 480', year: 2010, type: 'GPU', cost: 7000, power: 700, description: 'Fermi architecture' },
    { id: 'gpu_radeonhd7970', name: '🎮 AMD Radeon HD 7970', year: 2012, type: 'GPU', cost: 9000, power: 900, description: 'GCN architecture' },
    { id: 'gpu_gtx680', name: '🎮 NVIDIA GeForce GTX 680', year: 2012, type: 'GPU', cost: 10000, power: 1000, description: 'Kepler GPU' },
    { id: 'gpu_gtx780ti', name: '🎮 NVIDIA GeForce GTX 780 Ti', year: 2013, type: 'GPU', cost: 13000, power: 1300, description: 'GK110 core' },
    { id: 'gpu_r9_290x', name: '🎮 AMD Radeon R9 290X', year: 2013, type: 'GPU', cost: 12000, power: 1200, description: 'Hawaii GPU' },
    { id: 'gpu_gtx980ti', name: '🎮 NVIDIA GeForce GTX 980 Ti', year: 2015, type: 'GPU', cost: 18000, power: 1800, description: 'Maxwell flagship' },
    { id: 'gpu_gtx1080', name: '🎮 NVIDIA GeForce GTX 1080', year: 2016, type: 'GPU', cost: 25000, power: 2500, description: 'Pascal architecture' },
    { id: 'gpu_vega64', name: '🎮 AMD Radeon RX Vega 64', year: 2017, type: 'GPU', cost: 28000, power: 2800, description: 'Vega architecture' },
    { id: 'gpu_gtx1080ti', name: '🎮 NVIDIA GeForce GTX 1080 Ti', year: 2017, type: 'GPU', cost: 35000, power: 3500, description: 'Pascal Ti variant' },
    { id: 'gpu_rtx2080ti', name: '🎮 NVIDIA GeForce RTX 2080 Ti', year: 2018, type: 'GPU', cost: 50000, power: 5000, description: 'First ray tracing GPU' },
    { id: 'gpu_radeon7', name: '🎮 AMD Radeon VII', year: 2019, type: 'GPU', cost: 45000, power: 4500, description: '7nm gaming GPU' },
    { id: 'gpu_rtx3080', name: '🎮 NVIDIA GeForce RTX 3080', year: 2020, type: 'GPU', cost: 75000, power: 7500, description: 'Ampere architecture' },
    { id: 'gpu_rtx3090', name: '🎮 NVIDIA GeForce RTX 3090', year: 2020, type: 'GPU', cost: 100000, power: 10000, description: 'BFGPU edition' },
    { id: 'gpu_rx6900xt', name: '🎮 AMD Radeon RX 6900 XT', year: 2020, type: 'GPU', cost: 85000, power: 8500, description: 'RDNA 2 flagship' },
    { id: 'gpu_rtx3090ti', name: '🎮 NVIDIA GeForce RTX 3090 Ti', year: 2022, type: 'GPU', cost: 140000, power: 14000, description: 'Ampere ultimate' },
    { id: 'gpu_rtx4090', name: '🎮 NVIDIA GeForce RTX 4090', year: 2022, type: 'GPU', cost: 200000, power: 20000, description: 'Ada Lovelace' },
    { id: 'gpu_rx7900xtx', name: '🎮 AMD Radeon RX 7900 XTX', year: 2022, type: 'GPU', cost: 180000, power: 18000, description: 'RDNA 3 flagship' },
    { id: 'gpu_rtx4080super', name: '🎮 NVIDIA GeForce RTX 4080 Super', year: 2024, type: 'GPU', cost: 220000, power: 22000, description: 'Super refresh' },
    { id: 'gpu_rtx5090', name: '🎮 NVIDIA GeForce RTX 5090', year: 2025, type: 'GPU', cost: 350000, power: 35000, description: 'Blackwell architecture' },

    // Motherboards - Real chipsets and socket types
    { id: 'mb_386', name: '🔌 ISA 386 Board', year: 1989, type: 'Motherboard', cost: 30, power: 3, description: 'AT form factor' },
    { id: 'mb_486', name: '🔌 VLB 486 Board', year: 1992, type: 'Motherboard', cost: 45, power: 5, description: 'VESA Local Bus' },
    { id: 'mb_socket7', name: '🔌 Socket 7', year: 1995, type: 'Motherboard', cost: 75, power: 8, description: 'ATX standard' },
    { id: 'mb_slot1', name: '🔌 Slot 1 (i440BX)', year: 1998, type: 'Motherboard', cost: 120, power: 12, description: 'Intel 440BX chipset' },
    { id: 'mb_socket370', name: '🔌 Socket 370 (i815)', year: 1999, type: 'Motherboard', cost: 180, power: 18, description: 'Intel 815 chipset' },
    { id: 'mb_socketA', name: '🔌 Socket A (KT266)', year: 2001, type: 'Motherboard', cost: 280, power: 28, description: 'VIA KT266' },
    { id: 'mb_socket478', name: '🔌 Socket 478 (i865PE)', year: 2003, type: 'Motherboard', cost: 450, power: 45, description: 'Intel 865 chipset' },
    { id: 'mb_socket939', name: '🔌 Socket 939 (nForce4)', year: 2004, type: 'Motherboard', cost: 650, power: 65, description: 'nForce4 Ultra' },
    { id: 'mb_lga775', name: '🔌 LGA 775 (P965)', year: 2006, type: 'Motherboard', cost: 1000, power: 100, description: 'Intel P965 Express' },
    { id: 'mb_am2plus', name: '🔌 AM2+ (790FX)', year: 2008, type: 'Motherboard', cost: 1500, power: 150, description: 'AMD 790FX' },
    { id: 'mb_lga1366', name: '🔌 LGA 1366 (X58)', year: 2008, type: 'Motherboard', cost: 2000, power: 200, description: 'Intel X58 chipset' },
    { id: 'mb_lga1156', name: '🔌 LGA 1156 (P55)', year: 2009, type: 'Motherboard', cost: 2500, power: 250, description: 'Intel P55 chipset' },
    { id: 'mb_am3plus', name: '🔌 AM3+ (990FX)', year: 2011, type: 'Motherboard', cost: 3500, power: 350, description: 'AMD 990FX' },
    { id: 'mb_lga1155', name: '🔌 LGA 1155 (Z77)', year: 2012, type: 'Motherboard', cost: 4500, power: 450, description: 'Intel Z77 chipset' },
    { id: 'mb_lga1150', name: '🔌 LGA 1150 (Z97)', year: 2014, type: 'Motherboard', cost: 6000, power: 600, description: 'Intel Z97 chipset' },
    { id: 'mb_lga1151', name: '🔌 LGA 1151 (Z170)', year: 2015, type: 'Motherboard', cost: 8000, power: 800, description: 'Intel Z170 chipset' },
    { id: 'mb_am4', name: '🔌 AM4 (X370)', year: 2017, type: 'Motherboard', cost: 11000, power: 1100, description: 'AMD X370 chipset' },
    { id: 'mb_lga1151_v2', name: '🔌 LGA 1151 v2 (Z390)', year: 2018, type: 'Motherboard', cost: 14000, power: 1400, description: 'Intel Z390 chipset' },
    { id: 'mb_am4_x570', name: '🔌 AM4 (X570)', year: 2019, type: 'Motherboard', cost: 18000, power: 1800, description: 'PCIe 4.0 support' },
    { id: 'mb_lga1200', name: '🔌 LGA 1200 (Z490)', year: 2020, type: 'Motherboard', cost: 23000, power: 2300, description: 'Intel Z490 chipset' },
    { id: 'mb_lga1700', name: '🔌 LGA 1700 (Z690)', year: 2021, type: 'Motherboard', cost: 30000, power: 3000, description: 'DDR5 & PCIe 5.0' },
    { id: 'mb_am5', name: '🔌 AM5 (X670E)', year: 2022, type: 'Motherboard', cost: 40000, power: 4000, description: 'AMD X670E chipset' },
    { id: 'mb_lga1700_z790', name: '🔌 LGA 1700 (Z790)', year: 2022, type: 'Motherboard', cost: 45000, power: 4500, description: 'Intel Z790 chipset' },
    { id: 'mb_am5_x870', name: '🔌 AM5 (X870E)', year: 2024, type: 'Motherboard', cost: 60000, power: 6000, description: 'AMD X870E chipset' },
    { id: 'mb_lga1851', name: '🔌 LGA 1851 (Z890)', year: 2024, type: 'Motherboard', cost: 70000, power: 7000, description: 'Intel Z890 chipset' }
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

// Initialize hardware count
hardware.forEach(item => {
    gameState.hardware[item.id] = 0;
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
    shopList: document.getElementById('shopList'),
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
    // Formula: 100 * level^1.5 (polynomial growth)
    return Math.floor(100 * Math.pow(level, 1.5));
}

// Get current level progress
function getLevelProgress() {
    const currentLevelXP = getXPForLevel(gameState.level);
    const previousLevelXP = gameState.level > 1 ? getXPForLevel(gameState.level - 1) : 0;
    const xpIntoLevel = gameState.xp - previousLevelXP;
    const xpNeeded = currentLevelXP - previousLevelXP;
    
    // Prevent division by zero
    const percentage = xpNeeded > 0 ? (xpIntoLevel / xpNeeded) * 100 : 0;
    
    return {
        current: Math.max(0, xpIntoLevel),
        needed: Math.max(1, xpNeeded),
        percentage: percentage
    };
}

// Check for level up
function checkLevelUp() {
    let xpRequired = getXPForLevel(gameState.level);
    
    // Use a while loop to handle multiple level-ups safely
    while (gameState.xp >= xpRequired) {
        gameState.level++;
        
        // Show level up notification
        showLevelUpNotification();
        
        // Recalculate power per second with level bonus
        calculatePowerPerSecond();
        
        // Update XP requirement for next level
        xpRequired = getXPForLevel(gameState.level);
    }
}

// Show level up notification
function showLevelUpNotification() {
    const bonusPercent = (gameState.level - 1) * LEVEL_BONUS_DISPLAY;
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'level-up-notification';
    notification.innerHTML = `
        <div class="notification-content">
            🎉 LEVEL UP! 🎉<br>
            <span class="level-text">Level ${gameState.level}</span><br>
            <span class="bonus-text">+${bonusPercent.toFixed(0)}% Total Power Bonus!</span>
        </div>
    `;
    document.body.appendChild(notification);
    
    // Remove notification after animation
    setTimeout(() => {
        notification.remove();
    }, NOTIFICATION_DURATION);
}

// Get level bonus multiplier
function getLevelBonus() {
    // Calculate power generation multiplier based on level
    // Level 1 = 1.00x (no bonus), Level 2 = 1.01x (+1%), Level 10 = 1.09x (+9%), etc.
    return 1 + (gameState.level - 1) * LEVEL_BONUS_PERCENT;
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

// Buy hardware
function buyHardware(item) {
    if (gameState.credits >= item.cost) {
        gameState.credits -= item.cost;
        gameState.hardware[item.id]++;
        
        // Update power per second
        calculatePowerPerSecond();
        
        updateDisplay();
        renderShop();
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
    hardware.forEach(item => {
        const count = gameState.hardware[item.id];
        total += item.power * count;
    });
    
    // Apply level bonus
    const levelBonus = getLevelBonus();
    gameState.powerPerSecond = total * levelBonus;
}

// Render shop
function renderShop() {
    elements.shopList.innerHTML = '';
    
    hardware.forEach(item => {
        const count = gameState.hardware[item.id];
        const canAfford = gameState.credits >= item.cost;
        
        const shopDiv = document.createElement('div');
        shopDiv.className = 'shop-item';
        
        const button = document.createElement('button');
        button.className = 'shop-btn';
        button.disabled = !canAfford;
        
        button.innerHTML = `
            <span class="item-name">${item.name} (${item.year})</span>
            <span class="item-description">${item.description} | +${formatNumber(item.power)} power/sec</span>
            <span class="item-cost">Cost: ${formatNumber(item.cost)} Credits</span>
            ${count > 0 ? `<span class="item-count"> | Owned: ${count}</span>` : ''}
        `;
        
        button.addEventListener('click', () => buyHardware(item));
        
        shopDiv.appendChild(button);
        elements.shopList.appendChild(shopDiv);
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
    
    renderShop();
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
        
        // Migrate old upgrades to hardware (for backward compatibility)
        if (!gameState.hardware) {
            gameState.hardware = {};
            hardware.forEach(item => {
                gameState.hardware[item.id] = 0;
            });
        }
        
        calculatePowerPerSecond();
        updateDisplay();
        renderShop();
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
        
        hardware.forEach(item => {
            gameState.hardware[item.id] = 0;
        });
        
        calculatePowerPerSecond();
        updateDisplay();
        renderShop();
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
    renderShop();
    renderMissions();
    
    // Start game loop (100ms interval for smooth updates)
    setInterval(gameLoop, 100);
}

// Start the game when page loads
init();
