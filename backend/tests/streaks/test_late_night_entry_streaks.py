from datetime import timedelta

def test_late_night_entry_streaks(client, make_user, log_entries, today):
    user = make_user("midnightman")
    log_entries(user["habit_id"], days_ago=1, count=7, hour=23)

    res = client.get("/streak", headers=user["headers"])
    
    assert res.json()["ended"] == str(today - timedelta(days=1))