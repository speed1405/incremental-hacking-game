#!/usr/bin/env python3
"""
Test script for the Incremental Hacking Game
Tests core functionality without interactive input
"""

import json
import os
import sys

# Add the game directory to path (use relative path)
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from game import Game, GameState, UPGRADES, MISSIONS

def test_manual_hack():
    """Test manual hacking"""
    print("Testing manual hack...")
    game = Game()
    initial_power = game.state.hacking_power
    game.hack()
    assert game.state.hacking_power == initial_power + 1, "Manual hack should add 1 power"
    print("✓ Manual hack works correctly")

def test_buy_upgrade():
    """Test buying upgrades"""
    print("\nTesting upgrade purchase...")
    game = Game()
    game.state.hacking_power = 1000  # Give enough power
    
    upgrade = UPGRADES[0]  # Auto-Hacker
    initial_power = game.state.hacking_power
    initial_power_per_sec = game.state.power_per_second
    
    game.buy_upgrade(upgrade)
    
    # Check that power was deducted
    assert game.state.hacking_power < initial_power, "Power should be deducted"
    # Check that power per second increased
    assert game.state.power_per_second == initial_power_per_sec + upgrade.power_per_second, \
        "Power per second should increase"
    # Check that upgrade count increased
    assert game.state.upgrades.get(upgrade.id, 0) == 1, "Upgrade count should be 1"
    
    print(f"✓ Upgrade purchase works correctly")
    print(f"  Power: {initial_power} → {game.state.hacking_power}")
    print(f"  Power/sec: {initial_power_per_sec} → {game.state.power_per_second}")

def test_complete_mission():
    """Test completing missions"""
    print("\nTesting mission completion...")
    game = Game()
    game.state.hacking_power = 1000  # Give enough power
    
    mission = MISSIONS[0]  # Hack Small Website
    initial_power = game.state.hacking_power
    initial_xp = game.state.xp
    initial_credits = game.state.credits
    
    game.complete_mission(mission)
    
    # Check that power was deducted
    assert game.state.hacking_power == initial_power - mission.power_cost, \
        "Power should be deducted by mission cost"
    # Check that XP was gained
    assert game.state.xp == initial_xp + mission.xp_reward, \
        "XP should increase by reward amount"
    # Check that credits were gained
    assert game.state.credits == initial_credits + mission.credit_reward, \
        "Credits should increase by reward amount"
    
    print(f"✓ Mission completion works correctly")
    print(f"  Power: {initial_power} → {game.state.hacking_power}")
    print(f"  XP: {initial_xp} → {game.state.xp}")
    print(f"  Credits: {initial_credits} → {game.state.credits}")

def test_save_load():
    """Test save and load functionality"""
    print("\nTesting save/load...")
    
    # Create a game with some progress
    game1 = Game()
    game1.state.hacking_power = 500
    game1.state.xp = 100
    game1.state.credits = 50
    game1.state.power_per_second = 10
    game1.state.upgrades = {'auto_hacker': 2}
    
    # Save the game
    game1.save_game()
    
    # Create a new game and load
    game2 = Game()
    game2.load_game()
    
    # Verify the state was loaded correctly
    assert game2.state.hacking_power == 500, "Hacking power should be loaded"
    assert game2.state.xp == 100, "XP should be loaded"
    assert game2.state.credits == 50, "Credits should be loaded"
    assert game2.state.power_per_second == 10, "Power per second should be loaded"
    assert game2.state.upgrades.get('auto_hacker') == 2, "Upgrades should be loaded"
    
    print("✓ Save/load works correctly")
    
    # Clean up
    if os.path.exists('game_save.json'):
        os.remove('game_save.json')

def test_passive_income():
    """Test passive income generation"""
    print("\nTesting passive income...")
    import time
    
    game = Game()
    game.state.hacking_power = 0
    game.state.power_per_second = 10
    game.state.last_update = time.time()
    
    # Wait a bit
    time.sleep(1)
    
    # Update passive income
    game.state.update_passive_income()
    
    # Should have gained approximately 10 power (10 power/sec * 1 sec)
    assert game.state.hacking_power >= 9 and game.state.hacking_power <= 11, \
        f"Should gain ~10 power in 1 second, got {game.state.hacking_power}"
    
    print(f"✓ Passive income works correctly")
    print(f"  Generated {game.state.hacking_power:.2f} power in ~1 second")

def test_upgrade_cost_scaling():
    """Test that upgrade costs scale correctly"""
    print("\nTesting upgrade cost scaling...")
    
    upgrade = UPGRADES[0]  # Auto-Hacker
    
    cost_0 = upgrade.get_cost(0)
    cost_1 = upgrade.get_cost(1)
    cost_2 = upgrade.get_cost(2)
    
    assert cost_0 == 10, "First upgrade should cost base amount"
    assert cost_1 > cost_0, "Second upgrade should cost more"
    assert cost_2 > cost_1, "Third upgrade should cost even more"
    
    print(f"✓ Upgrade cost scaling works correctly")
    print(f"  Costs: {cost_0} → {cost_1} → {cost_2}")

def run_all_tests():
    """Run all tests"""
    print("=" * 60)
    print("Running Incremental Hacking Game Tests")
    print("=" * 60)
    
    try:
        test_manual_hack()
        test_buy_upgrade()
        test_complete_mission()
        test_save_load()
        test_passive_income()
        test_upgrade_cost_scaling()
        
        print("\n" + "=" * 60)
        print("✓ All tests passed!")
        print("=" * 60)
        return True
    except AssertionError as e:
        print(f"\n✗ Test failed: {e}")
        return False
    except Exception as e:
        print(f"\n✗ Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return False

if __name__ == "__main__":
    success = run_all_tests()
    sys.exit(0 if success else 1)
