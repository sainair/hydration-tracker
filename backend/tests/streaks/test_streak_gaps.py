from datetime import timedelta

def test_streaks_break_with_gap(client, make_user, log_entries, today):
    user = make_user("streakbreaker")

    for days_ago in (5,6,7):
        log_entries(user["habit_id"], days_ago=days_ago, count=7)

    for days_ago in (1,2,3):
        log_entries(user["habit_id"], days_ago=days_ago, count=7)

    res = client.get("/streak", headers=user["headers"])

    assert res.status_code == 200
    assert res.json()["current_streak"] == 3
    assert res.json()["last_run_length"] == 3
    assert res.json()["started"] == str(today - timedelta(days=3))
    assert res.json()["ended"] == str(today - timedelta(days=1))