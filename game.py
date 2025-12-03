#!/usr/bin/env python3
"""
Incremental Hacking Game - A text-based incremental game
Build your hacking empire by generating power, purchasing upgrades, and completing missions!
"""

import json
import os
import time
import sys
from datetime import datetime

# Game save file location
SAVE_FILE = "game_save.json"

# ANSI color codes for terminal styling
class Colors:
    HEADER = '\033[95m'
    OKBLUE = '\033[94m'
    OKCYAN = '\033[96m'
    OKGREEN = '\033[92m'
    WARNING = '\033[93m'
    FAIL = '\033[91m'
    ENDC = '\033[0m'
    BOLD = '\033[1m'
    UNDERLINE = '\033[4m'

class GameState:
    """Manages the game state"""
    def __init__(self):
        self.hacking_power = 0.0
        self.xp = 0
        self.credits = 0
        self.power_per_second = 0.0
        self.upgrades = {}
        self.last_update = time.time()
        
    def update_passive_income(self):
        """Update hacking power based on time passed"""
        current_time = time.time()
        time_passed = current_time - self.last_update
        self.hacking_power += self.power_per_second * time_passed
        self.last_update = current_time
    
    def to_dict(self):
        """Convert game state to dictionary for saving"""
        return {
            'hacking_power': self.hacking_power,
            'xp': self.xp,
            'credits': self.credits,
            'power_per_second': self.power_per_second,
            'upgrades': self.upgrades,
            'last_update': self.last_update
        }
    
    def from_dict(self, data):
        """Load game state from dictionary"""
        self.hacking_power = data.get('hacking_power', 0.0)
        self.xp = data.get('xp', 0)
        self.credits = data.get('credits', 0)
        self.power_per_second = data.get('power_per_second', 0.0)
        self.upgrades = data.get('upgrades', {})
        self.last_update = data.get('last_update', time.time())

class Upgrade:
    """Represents an upgrade that can be purchased"""
    def __init__(self, id, name, description, base_cost, cost_multiplier, power_per_second):
        self.id = id
        self.name = name
        self.description = description
        self.base_cost = base_cost
        self.cost_multiplier = cost_multiplier
        self.power_per_second = power_per_second
    
    def get_cost(self, owned_count):
        """Calculate the cost based on how many are owned"""
        return int(self.base_cost * (self.cost_multiplier ** owned_count))

class Mission:
    """Represents a mission that can be completed"""
    def __init__(self, id, name, description, power_cost, xp_reward, credit_reward):
        self.id = id
        self.name = name
        self.description = description
        self.power_cost = power_cost
        self.xp_reward = xp_reward
        self.credit_reward = credit_reward

# Define all upgrades
UPGRADES = [
    Upgrade('auto_hacker', '🤖 Auto-Hacker', 'Generates 1 hacking power per second', 10, 1.15, 1),
    Upgrade('botnet', '🌐 Botnet', 'Network of compromised computers (+5 power/sec)', 100, 1.2, 5),
    Upgrade('ai_assistant', '🧠 AI Assistant', 'Advanced AI helps with hacking (+20 power/sec)', 500, 1.25, 20),
    Upgrade('quantum_core', '⚛️  Quantum Core', 'Quantum computing power (+100 power/sec)', 2500, 1.3, 100),
    Upgrade('neural_network', '🔮 Neural Network', 'Self-learning hacking system (+500 power/sec)', 10000, 1.35, 500),
]

# Define all missions
MISSIONS = [
    Mission('hack_website', '🌐 Hack Small Website', 'Compromise a basic website security', 50, 10, 5),
    Mission('steal_data', '💾 Steal Database', 'Extract sensitive data from a database', 200, 50, 25),
    Mission('break_encryption', '🔐 Break Encryption', 'Crack advanced encryption algorithms', 500, 150, 75),
    Mission('infiltrate_server', '🖥️  Infiltrate Server', 'Gain root access to a secured server', 1000, 300, 150),
    Mission('hack_corporation', '🏢 Hack Corporation', 'Penetrate corporate network defenses', 2500, 800, 400),
    Mission('breach_government', '🏛️  Breach Government', 'Access classified government databases', 5000, 2000, 1000),
]

class Game:
    """Main game class"""
    def __init__(self):
        self.state = GameState()
        self.running = True
        
    def clear_screen(self):
        """Clear the terminal screen"""
        os.system('cls' if os.name == 'nt' else 'clear')
    
    def format_number(self, num):
        """Format numbers for display"""
        if num >= 1000000:
            return f"{num/1000000:.2f}M"
        elif num >= 1000:
            return f"{num/1000:.2f}K"
        else:
            return f"{int(num)}"
    
    def print_header(self):
        """Print the game header"""
        print(f"{Colors.OKGREEN}{Colors.BOLD}")
        print("=" * 60)
        print("🔓  INCREMENTAL HACKING GAME  🔓".center(60))
        print("Build your hacking empire".center(60))
        print("=" * 60)
        print(f"{Colors.ENDC}")
    
    def print_resources(self):
        """Print current resources"""
        print(f"\n{Colors.OKCYAN}{'RESOURCES':^60}{Colors.ENDC}")
        print("-" * 60)
        print(f"💻 Hacking Power: {Colors.WARNING}{self.format_number(self.state.hacking_power)}{Colors.ENDC}")
        print(f"⭐ XP: {Colors.WARNING}{self.format_number(self.state.xp)}{Colors.ENDC}")
        print(f"💰 Credits: {Colors.WARNING}{self.format_number(self.state.credits)}{Colors.ENDC}")
        print(f"🚀 Power/sec: {Colors.WARNING}{self.format_number(self.state.power_per_second)}{Colors.ENDC}")
        print("-" * 60)
    
    def hack(self):
        """Manual hack action"""
        self.state.hacking_power += 1
        print(f"{Colors.OKGREEN}✓ Hacked! +1 Power{Colors.ENDC}")
    
    def buy_upgrade(self, upgrade):
        """Purchase an upgrade"""
        owned = self.state.upgrades.get(upgrade.id, 0)
        cost = upgrade.get_cost(owned)
        
        if self.state.hacking_power >= cost:
            self.state.hacking_power -= cost
            self.state.upgrades[upgrade.id] = owned + 1
            self.state.power_per_second += upgrade.power_per_second
            print(f"{Colors.OKGREEN}✓ Purchased {upgrade.name}!{Colors.ENDC}")
            print(f"{Colors.OKCYAN}  Power/sec increased by {upgrade.power_per_second}{Colors.ENDC}")
        else:
            print(f"{Colors.FAIL}✗ Not enough hacking power! Need {self.format_number(cost)}{Colors.ENDC}")
    
    def complete_mission(self, mission):
        """Complete a mission"""
        if self.state.hacking_power >= mission.power_cost:
            self.state.hacking_power -= mission.power_cost
            self.state.xp += mission.xp_reward
            self.state.credits += mission.credit_reward
            print(f"{Colors.OKGREEN}✓ Mission completed!{Colors.ENDC}")
            print(f"{Colors.OKCYAN}  Gained {mission.xp_reward} XP and {mission.credit_reward} Credits{Colors.ENDC}")
        else:
            print(f"{Colors.FAIL}✗ Not enough hacking power! Need {self.format_number(mission.power_cost)}{Colors.ENDC}")
    
    def show_upgrades(self):
        """Display available upgrades"""
        print(f"\n{Colors.OKBLUE}{'UPGRADES':^60}{Colors.ENDC}")
        print("-" * 60)
        for i, upgrade in enumerate(UPGRADES, 1):
            owned = self.state.upgrades.get(upgrade.id, 0)
            cost = upgrade.get_cost(owned)
            can_afford = self.state.hacking_power >= cost
            color = Colors.OKGREEN if can_afford else Colors.FAIL
            
            print(f"{color}{i}. {upgrade.name}{Colors.ENDC}")
            print(f"   {upgrade.description}")
            print(f"   Cost: {self.format_number(cost)} Power | Owned: {owned}")
            print()
    
    def show_missions(self):
        """Display available missions"""
        print(f"\n{Colors.OKBLUE}{'MISSIONS':^60}{Colors.ENDC}")
        print("-" * 60)
        for i, mission in enumerate(MISSIONS, 1):
            can_afford = self.state.hacking_power >= mission.power_cost
            color = Colors.OKGREEN if can_afford else Colors.FAIL
            
            print(f"{color}{i}. {mission.name}{Colors.ENDC}")
            print(f"   {mission.description}")
            print(f"   Cost: {self.format_number(mission.power_cost)} Power | Reward: {mission.xp_reward} XP, {mission.credit_reward} Credits")
            print()
    
    def save_game(self):
        """Save the game to a file"""
        try:
            with open(SAVE_FILE, 'w') as f:
                json.dump(self.state.to_dict(), f)
            print(f"{Colors.OKGREEN}✓ Game saved successfully!{Colors.ENDC}")
        except Exception as e:
            print(f"{Colors.FAIL}✗ Error saving game: {e}{Colors.ENDC}")
    
    def load_game(self):
        """Load the game from a file"""
        if os.path.exists(SAVE_FILE):
            try:
                with open(SAVE_FILE, 'r') as f:
                    data = json.load(f)
                self.state.from_dict(data)
                print(f"{Colors.OKGREEN}✓ Game loaded successfully!{Colors.ENDC}")
                return True
            except Exception as e:
                print(f"{Colors.FAIL}✗ Error loading game: {e}{Colors.ENDC}")
                return False
        return False
    
    def reset_game(self):
        """Reset the game"""
        confirm = input(f"{Colors.WARNING}Are you sure you want to reset? This cannot be undone! (yes/no): {Colors.ENDC}")
        if confirm.lower() == 'yes':
            self.state = GameState()
            if os.path.exists(SAVE_FILE):
                os.remove(SAVE_FILE)
            print(f"{Colors.OKGREEN}✓ Game reset!{Colors.ENDC}")
        else:
            print(f"{Colors.OKCYAN}Reset cancelled.{Colors.ENDC}")
    
    def print_menu(self):
        """Print the main menu"""
        print(f"\n{Colors.BOLD}ACTIONS:{Colors.ENDC}")
        print("  h - Hack (+1 Power)")
        print("  u - View/Buy Upgrades")
        print("  m - View/Complete Missions")
        print("  s - Save Game")
        print("  r - Reset Game")
        print("  q - Quit")
        print()
    
    def run(self):
        """Main game loop"""
        # Try to load saved game
        self.load_game()
        
        while self.running:
            # Update passive income
            self.state.update_passive_income()
            
            # Display game state
            self.clear_screen()
            self.print_header()
            self.print_resources()
            self.print_menu()
            
            # Get user input
            choice = input(f"{Colors.BOLD}Enter your choice: {Colors.ENDC}").lower().strip()
            
            if choice == 'h':
                self.hack()
                input(f"\n{Colors.OKCYAN}Press Enter to continue...{Colors.ENDC}")
                
            elif choice == 'u':
                self.clear_screen()
                self.print_header()
                self.print_resources()
                self.show_upgrades()
                
                upgrade_choice = input(f"{Colors.BOLD}Enter upgrade number (or 'b' to go back): {Colors.ENDC}").strip()
                if upgrade_choice.isdigit():
                    idx = int(upgrade_choice) - 1
                    if 0 <= idx < len(UPGRADES):
                        self.buy_upgrade(UPGRADES[idx])
                    else:
                        print(f"{Colors.FAIL}Invalid upgrade number!{Colors.ENDC}")
                
                input(f"\n{Colors.OKCYAN}Press Enter to continue...{Colors.ENDC}")
                
            elif choice == 'm':
                self.clear_screen()
                self.print_header()
                self.print_resources()
                self.show_missions()
                
                mission_choice = input(f"{Colors.BOLD}Enter mission number (or 'b' to go back): {Colors.ENDC}").strip()
                if mission_choice.isdigit():
                    idx = int(mission_choice) - 1
                    if 0 <= idx < len(MISSIONS):
                        self.complete_mission(MISSIONS[idx])
                    else:
                        print(f"{Colors.FAIL}Invalid mission number!{Colors.ENDC}")
                
                input(f"\n{Colors.OKCYAN}Press Enter to continue...{Colors.ENDC}")
                
            elif choice == 's':
                self.save_game()
                input(f"\n{Colors.OKCYAN}Press Enter to continue...{Colors.ENDC}")
                
            elif choice == 'r':
                self.reset_game()
                input(f"\n{Colors.OKCYAN}Press Enter to continue...{Colors.ENDC}")
                
            elif choice == 'q':
                confirm = input(f"{Colors.WARNING}Save before quitting? (y/n): {Colors.ENDC}")
                if confirm.lower() == 'y':
                    self.save_game()
                self.running = False
                print(f"{Colors.OKGREEN}Thanks for playing!{Colors.ENDC}")
            
            else:
                print(f"{Colors.FAIL}Invalid choice!{Colors.ENDC}")
                input(f"\n{Colors.OKCYAN}Press Enter to continue...{Colors.ENDC}")

def main():
    """Entry point for the game"""
    try:
        game = Game()
        game.run()
    except KeyboardInterrupt:
        print(f"\n{Colors.OKGREEN}Game interrupted. Thanks for playing!{Colors.ENDC}")
        sys.exit(0)

if __name__ == "__main__":
    main()
