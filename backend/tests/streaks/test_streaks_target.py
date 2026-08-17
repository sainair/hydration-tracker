from datetime import timedelta

def test_streaks_break_by_amount(client, make_user, log_entries, today):
    user = make_user("missedgoal")

    log_entries(user["habit_id"], days_ago=1, count=7)
    log_entries(user["habit_id"], days_ago=0, count = 3)

    yesterday = today - timedelta(days=1)

    res = client.get("/streak", headers=user["headers"])

    assert res.status_code == 200
    assert res.json()["ended"] == str(yesterday)