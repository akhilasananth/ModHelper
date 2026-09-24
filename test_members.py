from members import add_new_members


class MockMember:
    def __init__(self, id, name):
        self.id = id
        self.name = name


def test_add_new_member():
    data = []

    new_members = {
        "123": "Alice"
    }

    guild_members = [
        MockMember(123, "Alice")
    ]

    result = add_new_members(data, new_members, guild_members)

    assert result == [
        {
            "user_id": "123",
            "member_id": "123",
            "name": "Alice"
        }
    ]

def test_add_multiple_members():
    data = []

    new_members = {
        "123": "Alice",
        "456": "Bob"
    }

    guild_members = [
        MockMember(123, "Alice"),
        MockMember(456, "Bob")
    ]

    result = add_new_members(data, new_members, guild_members)

    assert len(result) == 2
    assert result[0]["name"] == "Alice"
    assert result[1]["name"] == "Bob"


def test_existing_members_are_preserved():
    data = [
        {
            "user_id": "999",
            "member_id": "999",
            "name": "Existing"
        }
    ]

    new_members = {
        "123": "Alice"
    }

    guild_members = [
        MockMember(123, "Alice")
    ]

    result = add_new_members(data, new_members, guild_members)

    assert len(result) == 2
    assert result[0]["name"] == "Existing"
    assert result[1]["name"] == "Alice"

def test_no_new_members():
    data = [
        {
            "user_id": "999",
            "member_id": "999",
            "name": "Existing"
        }
    ]

    result = add_new_members(data, {}, [])

    assert result == data