from datetime import timedelta

def test_streaks_die_when_stale(client, make_user, log_entries, today):
    user=make_user("abandoner")
    for days_ago in (3,4,5):
        log_entries(user["habit_id"], days_ago=days_ago, count=7)

    res = client.get("/streak", headers=user["headers"])

    assert res.json()["current_streak"] == 0
    assert res.json()["last_run_length"] == 3
    assert res.json()["ended"] == str(today - timedelta(days=3))