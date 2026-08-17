def test_user_cannot_delete_other_users_entries(client, make_user):
    user_c = make_user("userc")
    user_d = make_user("userd")
    entry_id = client.post("/entries/", headers=user_c["headers"]).json()["id"]
    res = client.delete(f"/entries/{entry_id}", headers=user_d["headers"])

    assert res.status_code == 404
    assert len(client.get("/entries/today", headers=user_c["headers"]).json()) == 1
