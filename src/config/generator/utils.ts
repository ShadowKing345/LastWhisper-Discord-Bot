import inquirer from "inquirer";

export async function inquireInput(message: string): Promise<string> {
    return (await inquirer.prompt<{ result: string }>({
        type: "input",
        name: "result",
        message
    })).result;
}

export async function inquireOptions(message: string, options: any[]): Promise<number> {
    return (await inquirer.prompt<{ result: number }>({
        name: "result",
        type: "list",
        message,
        choices: [
            ...options.map((option, index) => ({ name: option, value: index })),
            {
                type: "separator"
            },
            {
                name: "Cancel",
                value: -1
            }
        ],
    })).result;
}

export async function inquireBoolean(message: string): Promise<boolean | null> {
    const result = (await inquirer.prompt<{ result: number }>({
        name: "result",
        type: "list",
        message,
        choices: [
            {
                name: "Yes",
                value: 1,
            },
            {
                name: "No",
                value: 0,
            },
            {
                type: "separator",
            },
            {
                name: "Cancel",
                value: -1,
            },
        ]
    })).result;

    return result === -1 ? null : result === 1;
}

enum DictionaryQuestionResult {
    NEW = -1,
    DELETE = -2,
    CANCEL = -3,
    DONE = -4,
}

export async function inquireDictionary(result: { [key: string]: any } = {}): Promise<{ [key: string]: any } | null> {
    for (; ;) {
        const entries = Object.entries(result);
        const entriesMap = entries.map((item, index) => ({
            name: `${index}) ${item[0]}: ${item[1]}`,
            value: index,
        }))

        const { action } = await inquirer.prompt<{ action: DictionaryQuestionResult }>({
            name: "action",
            message: "Create dictionary.",
            type: "list",
            choices: [
                ...entriesMap,
                {
                    type: "separator"
                },
                {
                    name: "New Entry",
                    value: DictionaryQuestionResult.NEW,
                },
                {
                    name: "Delete Entry",
                    value: DictionaryQuestionResult.DELETE,
                },
                {
                    type: "separator"
                },
                {
                    name: "Done",
                    value: DictionaryQuestionResult.DONE,
                },
                {
                    name: "Cancel",
                    value: DictionaryQuestionResult.CANCEL,
                },
            ],
        });

        let key;
        let value;
        let res;
        switch (action) {
            case DictionaryQuestionResult.NEW:
                [ key, value ] = [ await inquireInput("Key name."), await inquireInput("Value.") ];
                result[key] = value;
                break;
            case DictionaryQuestionResult.DELETE:
                res = (await inquirer.prompt<{ index: number }>({
                    name: "index",
                    message: "Which item would you like to delete?",
                    type: "list",
                    choices: [ ...entriesMap, { type: "separator", }, { name: "Cancel", value: -1 } ],
                })).index;

                if (res > -1) {
                    delete result[entries[res][0]];
                }

                break;
            case DictionaryQuestionResult.CANCEL:
                return;
            case DictionaryQuestionResult.DONE:
                return result;
            default:
                break;
        }
    }
}