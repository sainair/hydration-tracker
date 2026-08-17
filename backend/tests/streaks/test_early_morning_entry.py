from datetime import timedelta

def test_early_morning_entry_streaks(client, make_user, log_entries, today):
    user = make_user("earlybird")
    log_entries(user["habit_id"], days_ago=0, count=7, hour=1)

    res = client.get("/streak", headers=user["headers"])

    assert res.json()["ended"] == str(today)
    assert res.json()["current_streak"] == 1