/* @odoo-module */

import { click, contains, insertText, start } from "@mail/../tests/helpers/test_utils";

import { editInput, patchDate } from "@web/../tests/helpers/utils";

QUnit.test("create todo from activity menu without date", async function () {
    await start();
    await contains(".o_menu_systray i[aria-label='Activities']");
    await contains(".o-mail-ActivityMenu-counter", 0);
    await click(".o_menu_systray i[aria-label='Activities']");
    await contains(
        ".o-mail-ActivityMenu:contains(Congratulations, you're done with your activities.)"
    );
    await click(".btn", { text: "Add a To-do" });
    await contains(".btn", 0, { text: "Add a To-do" });

    await contains(".o-mail-ActivityMenu-show");
    await insertText("input.o-mail-ActivityMenu-input", "New To-do");
    await click(".btn", { text: "SAVE" });
    await contains(
        ".o_notification:contains(Your to-do has been successfully added to your tasks and scheduled for completion.)"
    );
    // Need to reopen systray as it automatically closes when a todo is created
    await click(".o_menu_systray i[aria-label='Activities']");
    await contains(".o-mail-ActivityMenu-counter", 1, { text: "1" });
    await contains(".o-mail-ActivityGroup span", 1, { text: "project.task" });
    await contains(".btn", 1, { text: "1 Today" });
    await contains(".btn", 1, { text: "Add a To-do" });
    await contains(".o-mail-ActivityMenu-show", 0);
    await contains(".o-mail-ActivityMenu-input", 0);
    await click(".btn", { text: "Add a To-do" });
    await contains(".btn", 0, { text: "Add a To-do" });

    await insertText("input.o-mail-ActivityMenu-input", "New To-do");
    await click(".btn", { text: "SAVE" });
    // Need to reopen systray as it automatically closes when a todo is created
    await contains(
        ".o_notification:contains(Your to-do has been successfully added to your tasks and scheduled for completion.)",
        2
    );
    await click(".o_menu_systray i[aria-label='Activities']");
    await contains(".o-mail-ActivityMenu-counter", 1, { text: "2" });
    await contains(".btn", 1, { text: "2 Today" });
});

QUnit.test("create to-do from activity menu with date", async function () {
    patchDate(2023, 1, 1, 6, 0, 0);
    const { DateTime } = luxon;
    const today = DateTime.utc();
    const futureDay = today.plus({ days: 2 });
    await start();
    await contains(".o_menu_systray i[aria-label='Activities']");
    await contains(".o-mail-ActivityMenu-counter", 0);

    await click(".o_menu_systray i[aria-label='Activities']");
    await click(".btn", { text: "Add a To-do" });
    await insertText("input.o-mail-ActivityMenu-input", "New To-do");
    await editInput(
        document.body,
        "input.o_datetime_input",
        futureDay.toString(luxon.DateTime.DATE_SHORT),
        {
            replace: true,
        }
    );
    await click(".btn", { text: "SAVE" });
    await contains(
        ".o_notification:contains(Your to-do has been successfully added to your tasks and scheduled for completion.)"
    );
    // Need to reopen systray as it automatically closes when a todo is created
    await click(".o_menu_systray i[aria-label='Activities']");
    await contains(".o-mail-ActivityMenu-counter", 1, { text: "1" });
    await contains(".o-mail-ActivityGroup span", 1, { text: "project.task" });
    await contains(".btn", 1, { text: "1 Future" });
});
