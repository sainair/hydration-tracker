def test_streaks_count_consecutive_qualifying_days(client, make_user, log_entries):
    user = make_user("streakuser")

    for days_ago in (1,2,3):
        log_entries(user["habit_id"], days_ago=days_ago, count=7)

    res = client.get("/streak", headers = user["headers"])

    assert res.status_code == 200
    assert res.json()["current_streak"] == 3