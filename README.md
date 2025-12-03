# Incremental Hacking Game 🔓

A text-based incremental game where you build your hacking empire!

## Features

- 💻 **Hacking Power**: The main currency - generate it by hacking or through passive income
- ⭐ **XP System**: Gain experience points by completing missions
- 💰 **Credits**: Earn credits from missions for future features
- 🚀 **Upgrades**: Purchase upgrades to increase your passive power generation
- 🎯 **Missions**: Complete various hacking missions for rewards
- 💾 **Save/Load**: Your progress is automatically saved

## How to Play

### Requirements
- Python 3.6 or higher

### Running the Game

#### Option 1: Python (Recommended)
```bash
python3 game.py
```

#### Option 2: Web Browser
Open `index.html` in your web browser for a web-based version.

## Game Mechanics

### Actions
- **Hack**: Manually generate +1 Hacking Power
- **Upgrades**: Purchase upgrades that generate power per second
- **Missions**: Spend power to complete missions and earn XP and Credits

### Upgrades
1. 🤖 **Auto-Hacker** - Generates 1 power/sec (Cost: 10)
2. 🌐 **Botnet** - Network of compromised computers, +5 power/sec (Cost: 100)
3. 🧠 **AI Assistant** - Advanced AI, +20 power/sec (Cost: 500)
4. ⚛️ **Quantum Core** - Quantum computing, +100 power/sec (Cost: 2,500)
5. 🔮 **Neural Network** - Self-learning system, +500 power/sec (Cost: 10,000)

### Missions
1. 🌐 **Hack Small Website** - Basic website compromise (50 Power → 10 XP, 5 Credits)
2. 💾 **Steal Database** - Extract sensitive data (200 Power → 50 XP, 25 Credits)
3. 🔐 **Break Encryption** - Crack encryption (500 Power → 150 XP, 75 Credits)
4. 🖥️ **Infiltrate Server** - Root access (1,000 Power → 300 XP, 150 Credits)
5. 🏢 **Hack Corporation** - Corporate networks (2,500 Power → 800 XP, 400 Credits)
6. 🏛️ **Breach Government** - Classified databases (5,000 Power → 2,000 XP, 1,000 Credits)

## Controls (Python Version)

- `h` - Hack (+1 Power)
- `u` - View/Buy Upgrades
- `m` - View/Complete Missions
- `s` - Save Game
- `r` - Reset Game
- `q` - Quit

## Tips

1. Start by manually hacking to build up initial power
2. Buy your first Auto-Hacker as soon as possible for passive income
3. Balance between buying upgrades and completing missions
4. Higher-tier upgrades become more expensive but generate much more power
5. Your game auto-saves when you quit, so you won't lose progress!

## Technical Details

- Game state is saved to `game_save.json`
- Passive income is calculated based on time elapsed
- Upgrade costs increase exponentially with each purchase
- Terminal colors enhance the hacking aesthetic

Enjoy building your hacking empire! 🚀