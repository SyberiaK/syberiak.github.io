// Update this things
const MOTDS = [
    "Sometimes, <b>figuring out</b> is the most entertaining thing to do.",
    "There are definitely more things to come <b>;)</b>",
    "No, this website is not made with <a href=\"https://github.com/jcubic/jquery.terminal\">\"jquery.terminal\"</a>. Although it looks nice.",
    "GUIs were introduced by a devil.",
    "You can report bugs or suggest new features on <a href=\"https://github.com/SyberiaK/syberiak.github.io/issues\">GitHub</a>."
];
const TITLE = "SybTerminal";
const VERSION = "v0.0.0002";

const COMMANDS = {
    "help": () => {
        print({}, "\
help     Prints out all available commands\n\
echo     Prints out given text (because why not)\n\
clear    Clears the console\n\
motd     Updates the Message of The Day\
");
    },
    "echo": (...text) => { 
        print({}, text); 
    },
    "clear": () => {
        terminalHeader.innerHTML = "";
        terminalOutput.innerHTML = "";
    },
    "motd": () => {
        let temp = motd;
        while (temp === motd) {
            temp = getRandomChoice(MOTDS);
        }
        motd = temp;
        updateHeader();
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
    return str.replace(/<\/?[^>]+(>|$)/g, "");
}

function reformatStringForHTML(str) {
    return str.replace(/\r\n|\r|\n/g, "<br>").replace(/\s/g, "&nbsp;");
}


function updateHeader() {
    const titleLength = `${TITLE} ${VERSION}`.length;
    const motdLength = cleanFromHTML(motd).length;

    const titleLine = `| ${TITLE} ${VERSION}` + " ".repeat(Math.max(motdLength - titleLength, 0)) + " |";
    const motdLine = `| ${motd}` + " ".repeat(Math.max(titleLength - motdLength, 0)) + " |";
    const borderLine = `|=` + "=".repeat(Math.max(motdLength, titleLength)) + "=|";
    const terminalHeaderLines = `<regular>${borderLine}</regular>
                                <regular>${titleLine}</regular>
                                <regular>${motdLine}</regular>
                                <regular>${borderLine}</regular>`;

    terminalHeader.innerHTML = terminalHeaderLines
}

let motd = getRandomChoice(MOTDS);

const terminalHeader = document.getElementById("terminal-header");
updateHeader(motd);

const terminalInput = document.getElementById("terminal-input");
const terminalInputPrompt = document.getElementById("terminal-input-prompt");
const terminalOutput = document.getElementById("terminal-output");


function handleCommand(query, recursive) {
    if (recursive != true) {
        print({}, `>${query}`)
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

    COMMANDS[cmd](...args);
}

function print({sep = " ", end = "\n\n"}, ...data) {
    let totalOutput;
    if (data.length > 1) 
        totalOutput = data.join(sep);
    else 
        totalOutput = (data[0] ?? "");
    totalOutput += end;

    terminalOutput.innerHTML += reformatStringForHTML(totalOutput);
}

setTimeout(() => {
    terminalInput.style.opacity = 1;

    document.querySelector("html").addEventListener("click", () => {
        terminalInputPrompt.focus();
    })

    document.querySelector("html").addEventListener("keydown", (e) => {
        if (e.key == "Enter") {
            e.preventDefault();

            const query = terminalInputPrompt.innerText;

            handleCommand(query);
            terminalInputPrompt.innerText = "";
        }
    });
}, 500);


const config = { childList: true };

const callback = function (mutationsList, _) {
  for (let mutation of mutationsList) {
    if (mutation.type === "childList") {
      window.scrollTo(0, document.body.scrollHeight);
    }
  }
};

const observer = new MutationObserver(callback);
observer.observe(terminalOutput, config);


