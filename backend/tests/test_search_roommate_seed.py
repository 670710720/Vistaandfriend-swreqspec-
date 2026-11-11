from app.seeds.search_roommate_seed import load_seed_profiles


def test_AC_SRS_03A_seed_contains_open_self_and_closed_profiles():
    """Given a seeded dataset, When checking available roommate profiles, Then the sample includes active, self, and closed profiles."""
    profiles = load_seed_profiles()

    assert any(profile.user_id == "user-1" and profile.is_open_for_search for profile in profiles)
    assert any(profile.user_id == "user-2" and profile.is_open_for_search for profile in profiles)
    assert any(profile.user_id == "user-3" and not profile.is_open_for_search for profile in profiles)
    assert any(profile.sleep_behavior for profile in profiles)
