import test from "node:test";
import assert from "node:assert/strict";

import { addMembersToPrivateThread } from "./functions.js";


test("adds introduced member to thread", async () => {

    const thread = {
        name: "Saturday Walk",
        members: {
            add: async (member_id) => {
                thread.added_member = member_id;
            }
        }
    };

    const channel = {
        threads: {
            fetch: async () => thread
        }
    };

    await addMembersToPrivateThread(
        channel,
        "thread-123",
        ["825912071777681459"]
    );

    assert.equal(
        thread.added_member,
        "825912071777681459"
    );
});