def test_user_cannot_read_another_users_entries(client, make_user):
    user_a = make_user("usera")
    user_b = make_user("userb")
    client.post("/entries/", headers=user_a["headers"])
    res = client.get("/entries/today", headers=user_b["headers"])

    assert res.status_code == 200
    assert res.json() == []