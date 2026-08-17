def test_new_user_has_zero_streak(client, make_user):
    user = make_user("newuser")
    res = client.get("/streak", headers=user["headers"])
    
    assert res.json()["current_streak"] == 0
    assert res.json()["last_run_length"] == 0
    assert res.json()["started"] == None
    assert res.json()["ended"] == None