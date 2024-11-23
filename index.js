// Update these things
const MOTDS = [
    "Sometimes, **figuring out** is the most entertaining thing to do.",
    "There are definitely more things to come **;)**",
    "No, this website is not made with [jquery.terminal](https://github.com/jcubic/jquery.terminal). Although it looks nice.",
    "You can report bugs or suggest new features on [my GitHub repo](https://github.com/SyberiaK/syberiak.github.io/issues).",
    "RIP [WebX](https://github.com/face-hh/webx) (2024-2024)",
    "**LET'S GO GAMBLING!!!**",
    "Golf?",
    "Who knows?",
    "I use Windows **AND I'M PROUD OF IT!**",
    "Watch my 9mm go bang",
    "I'm not inside a fusion reactor.",
    "Any thoughts what to add here? Anything?",
    "buh",
    "\"**CALL VALVE LAZY ONE MORE TIME**\", - some German dude, probably.",
    "undefined",
    "defined",
    "Don't forget to like and sybscribe.",
    "LULE",
    "aga",
    "xdd",
    "unxdd"
];
const TITLE = "SybTerminal";
const VERSION = "v0.3.0";
const PREVIOUS_INPUTS_LIMIT = 50;
const THEMES = {
    dark: {
        text: "#d9d9d9",
        background: "#121417"
    },
    light: {
        text: "#000",
        background: "#d9d9d9"
    }
}
const PRECACHED_PROJECTS = ["incs2bot"];
const projects = {}

async function fetchProjectInfo(filename) {
    const res = await fetch(`projects/${filename}.md`);
    return await res.text();
}

async function parseChangelog() {
    const versionLabel = `### ${VERSION.slice(1)}`

    const res = await fetch("./CHANGELOG.md");
    const pages = (await res.text()).split(/(?:\n\n)|(?:\r\n\r\n)/g);
    for (let i = 1; i < pages.length; i++) {
        if (pages[i].startsWith(versionLabel)) {
            return "v" + pages[i].slice("### ".length);
        }
    }
}

PRECACHED_PROJECTS.forEach((name) => {
    fetchProjectInfo(name).then((text) => {
        projects[name] = text
    })
})

let changelog = "";

parseChangelog().then((text) => {
    changelog = text;
});

// fetch("projects/").then((res) => res.text()).then((text) => console.log(text))

const COMMANDS = {
    "help": {
        help_description: [
            "help [NAME]",
            "    Prints out all the available commands.",
            "    duh."
        ],
        func: (name = "") => {
            if (name === "") {
                print({sep: "\n"},
                    "help [NAME]     Prints out all the available commands",
                    "                (specify NAME argument to get detailed info)",
                    "changelog       Prints out current changelog",
                    "echo [...TEXT]  Prints out given TEXT (because why not)",
                    "clear           Clears the console",
                    "motd            Updates the Message of The Day",
                    "project NAME    Prints out the information about one",
                    "                of the featured projects",
                    "                (use \"list\" to see all of them)",
                    "theme NAME      Sets the theme by name",
                    "                (use \"list\" to see available themes)"
                );
                return;
            }
            const command = COMMANDS[name]
            if (!command) {
                print({sep: "\n"}, 
                    "ERROR: Unknown command.",
                    "Use \"help\" to get info about all available commands."
                );
                return;
            }
            print({sep: "\n"}, ...(COMMANDS[name].help_description ?? [`${name}`, "    No detailed info specified."]))
        }
    },
    "changelog": {
        help_description: [
            "changelog",
            "    Prints out the changelog",
            "    of the current version."
        ],
        func: () => { 
            print({sep: "\n"}, changelog);
        }
    },
    "echo": {
        help_description: [
            "echo [...TEXT]",
            "    Prints out given text.",
            "    NOTE: Multiple spaces between the words",
            "    are ***not*** preserved.",
            "",
            "    Example:",
            "        > echo Hello, world!",
            "",
            "        Hello, world!"
        ],
        func: (...text) => { 
            print({}, ...text); 
        }
    },
    "theme": {
        help_description: [
            "theme NAME",
            "    Changes the terminal theme.",
            "    Available themes: `dark`, `white`"
        ],
        func: (name = "") => {
            if (name === "") {
                print({sep: "\n"}, 
                    "ERROR: Specify a theme you want to set.",
                    "Use \"theme list\" to get the full list of featured projects."
                )
                return;
            }
            if (name === "list") {
                print({sep: "\n"}, 
                    "Available themes: `dark`, `white`");
                return;
            }
            if (!THEMES[name]) {
                print({sep: "\n"}, 
                    "ERROR: Can't find the theme you entered.",
                    "Use \"theme list\" to get the full list of featured projects."
                )
                return;
            }
            
            applyTheme(name);
            if (name === "light") {
                motd = "eww light mode";
                updateHeader();
            }
            else if (name === "dark" && motd == "eww light mode") {
                motd = "much better now";
                updateHeader();
            }
            localStorage.setItem("theme", name);
        }
    },
    "clear": {
        help_description: [
            "clear",
            "    Clears the console."
        ],
        func: () => {
            terminalHeader.innerHTML = "";
            terminalOutput.innerHTML = "";
        }
    },
    "motd": {
        help_description: [
            "motd",
            "    Updates the **Message of The Day**",
            "    at the header."
        ],
        func: () => {
            let temp = motd;
            while (temp === motd) {
                temp = reformatStringForHTML(getRandomChoice(MOTDS));
            }
            motd = temp;
            updateHeader();
        }
    },
    "project": {
        help_description: [
            "project NAME",
            "    Prints out the information about one",
            "    of the featured projects",
            "    specified by NAME argument.",
            "    Use \"list\" to get the full list."
        ],
        func: (name = "") => {
            if (name === "") {
                print({sep: "\n"}, 
                    "ERROR: Specify a project name.",
                    "Use \"project list\" to get the full list of featured projects."
                )
                return;
            }
            if (name === "list") {
                print({sep: "\n"}, 
                    "**These are some of my projects I really like:**",
                    "- [aquaismissing/INCS2bot](https://github.com/aquaismissing/INCS2bot) - multilingual Telegram bot that provides a lot of useful information about CS2;",
                    "- [sl10n](https://github.com/SyberiaK/sl10n) - Python's library making type-safe localization;",
                    "- [You Shall Not Climb!](https://github.com/SyberiaK/ysnc) - fixes a Minecraft \"feature\" of all mobs being able to climb ladders (even if they aren't supposed to);",
                    "- [CSXhair](https://github.com/SyberiaK/csxhair) - decoding/encoding CS:GO/CS2 crosshairs without doing binary gymnastics by yourself.",
                    "",
                    "I would really appreciate if you leave a star to any of those (including this website **;D**)",
                    "**Note:** the list may be extended with new projects in the near future.");
                return;
            }

            if (!Object.keys(projects).includes(name.toLowerCase())) {
                fetchProjectInfo(name).then((text) => {
                    if (text) {
                        projects[name] = text
                    }
                })
            }

            const text = projects[name.toLowerCase()]
            if (!text) {
                print({sep: "\n"}, 
                    `ERROR: Can't find the detailed info about the "${name}" project.`,
                    "Make sure you use the correct name."
                )
                return;
            }
            print({}, text)
            return;
        }
    },
    "buh": {
        help_description: ["buh", "    ***buh***"],
        func: () => print({}, "***buh***")
    }
}
// end


function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min) ) + min;
}

function getRandomChoice(arr) {
    return arr[getRandomInt(0, arr.length)];
}

function cleanFromHTML(str) {
    return str.replace(/<\/?[^>]+(>|$)/g, "").replace("&nbsp;", " ");
}

function reformatStringForHTML(str) {
    return str.replace(/\r\n|\r|\n/g, "<br>")
              .replace(/\s\s\s/g, "&nbsp;&nbsp;&nbsp;")  // html suck ass
              .replace(/\s\s/g, "&nbsp;&nbsp;")
              .replace(/\[([^\]]+)]\(([^\)]+)\)/g, "<a href=\"$2\">$1</a>")
              .replace(/\*\*([^\*]+)\*\*/g, "<b>$1</b>")
              .replace(/\*([^\*]+)\*/g, "<i>$1</i>")
              .replace(/\`([^\`]+)\`/g, "<code>$1</code>");
}


function updateHeader() {
    let isTitleSplitted = false;
    const terminalHeaderLines = [];
    const maxLineLength = Math.floor((window.innerWidth - 6) / 10) - 4;
    
    let titleLength = `${TITLE} ${VERSION}`.length;
    if (titleLength > maxLineLength) {
        isTitleSplitted = true;
        titleLength = Math.max(TITLE.length, VERSION.length);
    }
    let longestLineLength = titleLength;

    let motdLength = cleanFromHTML(motd).length;
    if (motdLength > maxLineLength) {  // mostly on mobiles
        const lines = [];
        const motdParts = motd.split(/\s+(?![^<]*>|[^<>]*<\/)/g);

        let line = [];
        for (const part of motdParts) {
            if (cleanFromHTML(line + part).length > maxLineLength) {
                lines.push(line.join(" "));
                line = [];
            }
            line.push(part);
        }
        lines.push(line.join(" "));
        motdLength = Math.max(...lines.map((v) => cleanFromHTML(v).length));
        longestLineLength = Math.max(motdLength, titleLength)

        for (const line of lines) {
            terminalHeaderLines.push(`| ${line}` + " ".repeat(longestLineLength - cleanFromHTML(line).length) + " |");
        }
    } else {
        longestLineLength = Math.max(motdLength, titleLength)
        terminalHeaderLines.push(`| ${motd}` + " ".repeat(longestLineLength - motdLength) + " |");
    }

    if (isTitleSplitted) {
        titleLength = Math.max(TITLE.length, VERSION.length);
        terminalHeaderLines.splice(0, 0, `| ${TITLE}` + " ".repeat(longestLineLength - TITLE.length) + " |",
                                         `| ${VERSION}` + " ".repeat(longestLineLength - VERSION.length) + " |");
    } else {
        terminalHeaderLines.splice(0, 0, `| ${TITLE} ${VERSION}` + " ".repeat(longestLineLength - titleLength) + " |");
    }


    const borderLine = `|=` + "=".repeat(longestLineLength) + "=|";
    terminalHeaderLines.splice(0, 0, borderLine);
    terminalHeaderLines.push(borderLine);

    let header = "";
    for (const line of terminalHeaderLines) {
        header += `<regular>${line}</regular>`;
    }

    terminalHeader.innerHTML = header;
}

const terminalHeader = document.getElementById("terminal-header");
const terminalInput = document.getElementById("terminal-input");
const terminalInputPrompt = document.getElementById("terminal-input-prompt");
const terminalOutput = document.getElementById("terminal-output");
const previousInputs = [];
let previousInputsPointer = 0;
const prefersDarkTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
const themeName = localStorage.getItem("theme") ?? ("dark" ? prefersDarkTheme : "light");
applyTheme(themeName);

let motd = reformatStringForHTML(getRandomChoice(MOTDS));
updateHeader();


function handleCommand(query, recursive) {
    if (recursive != true) {
        print({}, `>${query}`);
    }

    if (query.includes(";")) {
        let [...cmds] = query.split(";");
        for (let cmd of cmds) {
            handleCommand(cmd.trimStart(), true);
        }
        return;
    }

    let [cmd, ...args] = query.split(/\s+/);

    if (!(cmd in COMMANDS)) {
        print({}, `Unknown command: "${cmd}". Use "help" to get info about all available commands.`);
        return;
    }

    COMMANDS[cmd].func(...args);
}

function applyTheme(name) {
    let theme = THEMES[name] ?? THEMES.dark;

    document.body.style.backgroundColor = theme.background;
    document.body.style.color = theme.text;
}

function print({sep = " ", end = "\n\n"}, ...data) {
    let totalOutput = (data.length > 1) ? data.join(sep) : (data[0] ?? "");
    totalOutput += end;

    terminalOutput.innerHTML += reformatStringForHTML(totalOutput);
}

setTimeout(() => {
    terminalInput.style.opacity = 1;

    window.addEventListener('resize', function() {
        updateHeader();
    });

    document.querySelector("html").addEventListener("click", () => {
        terminalInputPrompt.focus();
    });

    document.querySelector("html").addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            e.preventDefault();

            const query = terminalInputPrompt.innerText;
            if (previousInputs.at(-1) != query) {
                if (query.length >= PREVIOUS_INPUTS_LIMIT) {
                    previousInputs.shift();
                }
                previousInputs.push(query);
            }
            previousInputsPointer = -1;

            handleCommand(query);
            terminalInputPrompt.innerText = "";
        }
        else if (e.key === "ArrowUp") {
            e.preventDefault();

            if (previousInputsPointer === -1) previousInputsPointer = previousInputs.length;
            if (previousInputsPointer <= 0) return;
            
            previousInputsPointer--;
            terminalInputPrompt.innerText = previousInputs[previousInputsPointer];
        }
        else if (e.key === "ArrowDown") {
            e.preventDefault();

            if (previousInputsPointer >= previousInputs.length - 1) return;

            previousInputsPointer++;
            terminalInputPrompt.innerText = previousInputs[previousInputsPointer];
        }
    });
}, 500);


const callback = function (mutationsList, _) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(terminalOutput, { childList: true });


